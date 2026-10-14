import { MongoClient } from "mongodb";
import { normalizeInput, safePhotoUrl, type Recipe } from "../src/lib/recipes";

// Public recipe preview only: production is read, never written. The source
// cluster and database were verified against the Vercel production project.
const sourceUri = process.env.MONGODB_URI;
const sourceDb = "prod";
const targetUri = "mongodb://127.0.0.1:27017";
const targetDb = "wtf2cook_dev";
const expectedSourceHost = "cluster0.g1hqksk.mongodb.net";
const apply = process.argv.includes("--apply");
const sampleIds = [
  "03ipbxix88h6", "3vjbvv96m0da", "60dlzvq66r5c", "asa2r2g4gms3",
  "km3olkk7ntri", "18446j55oa5b", "8siln39hdddo", "37sr7r77ydws",
];

function legacyMinutes(value: unknown, field: string): number {
  if (value == null) return 0;
  let minutes: number;
  if (typeof value === "number") minutes = value;
  else if (value instanceof Date) minutes = value.getTime();
  else if (typeof value === "string" && /^1970-01-01T00:00:/.test(value)) minutes = new Date(value).getTime();
  else throw new Error(`Unsupported legacy timing in ${field}`);
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 10_080) {
    throw new Error(`Invalid legacy timing in ${field}`);
  }
  return minutes;
}

async function main() {
  if (!sourceUri || new URL(sourceUri).hostname !== expectedSourceHost) {
    throw new Error("The source URI is not the verified production Atlas cluster");
  }
  const source = new MongoClient(sourceUri, { serverSelectionTimeoutMS: 10_000 });
  const target = new MongoClient(targetUri, { serverSelectionTimeoutMS: 10_000 });
  try {
    await Promise.all([source.connect(), target.connect()]);
    const sourceRecipes = source.db(sourceDb).collection<Recipe>("recipes");
    const targetRecipes = target.db(targetDb).collection<Recipe & { preview_import?: boolean }>("recipes");
    const documents = await sourceRecipes.find({ id: { $in: sampleIds } }).toArray();
    if (documents.length !== sampleIds.length) throw new Error("The production sample changed; review IDs before importing");
    const prepared = sampleIds.map((id) => {
      const original = documents.find((recipe) => recipe.id === id);
      if (!original) throw new Error(`Missing recipe ${id}`);
      const input = normalizeInput({
        name: original.name,
        description: original.description ?? "",
        photo_url: safePhotoUrl(original.photo_url) ?? "",
        servings: original.servings,
        time_prep: legacyMinutes(original.time_prep, "time_prep"),
        time_cook: legacyMinutes(original.time_cook, "time_cook"),
        time_chill: legacyMinutes(original.time_chill, "time_chill"),
        ingredients: original.ingredients,
        instructions: original.instructions,
        notes: original.notes ?? "",
      });
      if (original.time_total != null && legacyMinutes(original.time_total, "time_total") !== input.time_prep + input.time_cook + input.time_chill) {
        throw new Error(`Legacy total does not match component timings for ${id}`);
      }
      return { id, ...input, user_id: "production-preview-unlinked", time_total: input.time_prep + input.time_cook + input.time_chill };
    });
    const existing = await targetRecipes.find({ id: { $in: sampleIds } }, { projection: { id: 1, preview_import: 1 } }).toArray();
    const collisions = existing.filter((recipe) => !recipe.preview_import).map((recipe) => recipe.id);
    if (collisions.length) throw new Error(`Local recipes already use these IDs: ${collisions.join(", ")}`);
    console.log(JSON.stringify({ source: `${expectedSourceHost}/${sourceDb}`, target: `localhost/${targetDb}`, selected: prepared.map(({ id, name }) => ({ id, name })), alreadyImported: existing.length, action: apply ? "import" : "dry-run" }, null, 2));
    if (!apply) return;
    let inserted = 0;
    for (const recipe of prepared) {
      const result = await targetRecipes.updateOne({ id: recipe.id }, { $setOnInsert: {
        ...recipe, preview_import: true, created_at: new Date(), updated_at: new Date(),
      } }, { upsert: true });
      if (result.upsertedCount) inserted += 1;
    }
    console.log(`Imported ${inserted} preview recipes; ${prepared.length - inserted} were already present. Production was not changed.`);
  } finally {
    await Promise.all([source.close(), target.close()]);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
