import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getDb } from "./db";

const sectionTitle = z.string().trim().max(120).nullable().default(null);
const sectionLines = z.array(z.string().trim().min(1).max(1000)).min(1).max(100);
const ingredientSection = z.object({ title: sectionTitle, ingredients: sectionLines });
const instructionSection = z.object({ title: sectionTitle, instructions: sectionLines });

export const recipeInputSchema = z.object({
  name: z.string().trim().min(2).max(140),
  description: z.string().trim().max(3000).default(""),
  photo_url: z.union([
    z.literal(""),
    z.url().max(2000).refine((value) => new URL(value).protocol === "https:", "Photo URL must use HTTPS"),
  ]).optional(),
  servings: z.number().int().min(1).max(100),
  time_prep: z.number().int().min(0).max(10080),
  time_cook: z.number().int().min(0).max(10080).default(0),
  time_chill: z.number().int().min(0).max(10080).default(0),
  ingredients: z.array(ingredientSection).min(1).max(30),
  instructions: z.array(instructionSection).min(1).max(30),
  notes: z.string().trim().max(5000).default(""),
}).strict();

export type RecipeInput = z.infer<typeof recipeInputSchema>;

export type Recipe = RecipeInput & {
  id: string;
  user_id: string;
  time_total: number;
  created_at?: Date;
  updated_at?: Date;
};

export { slugify, recipeUrl, safePhotoUrl } from "./recipe-links";

export function normalizeInput(input: unknown): RecipeInput {
  return recipeInputSchema.parse(input);
}

export async function listRecipes(search = "", page = 1, ownerId?: string) {
  const db = await getDb();
  const safePage = Math.max(1, Math.min(1000, Math.trunc(page) || 1));
  const query: Record<string, unknown> = {};
  if (ownerId) query.user_id = ownerId;
  if (search.trim()) {
    const escaped = search.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } },
    ];
  }
  const [recipes, count] = await Promise.all([
    db.collection<Recipe>("recipes").find(query, { projection: { _id: 0 } })
      .sort({ created_at: -1, id: -1 }).skip((safePage - 1) * 24).limit(24).toArray(),
    db.collection("recipes").countDocuments(query),
  ]);
  return { recipes, page: safePage, pages: Math.max(1, Math.ceil(count / 24)), count };
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  if (!/^[a-zA-Z0-9_-]{4,64}$/.test(id)) return null;
  const db = await getDb();
  return db.collection<Recipe>("recipes").findOne({ id }, { projection: { _id: 0 } });
}

export async function getRandomRecipe(excludeId?: string): Promise<Recipe | null> {
  const db = await getDb();
  const match = excludeId ? { id: { $ne: excludeId } } : {};
  const [recipe] = await db.collection<Recipe>("recipes")
    .aggregate<Recipe>([{ $match: match }, { $sample: { size: 1 } }, { $project: { _id: 0 } }])
    .toArray();
  return recipe ?? null;
}

export async function createRecipe(input: unknown, ownerId: string, id?: string): Promise<Recipe> {
  if (!ownerId) throw new Error("An authenticated owner is required");
  const parsed = normalizeInput(input);
  const now = new Date();
  const recipe: Recipe = {
    ...parsed,
    id: id ?? randomBytes(6).toString("base64url"),
    user_id: ownerId,
    time_total: parsed.time_prep + parsed.time_cook + parsed.time_chill,
    created_at: now,
    updated_at: now,
  };
  const db = await getDb();
  await db.collection<Recipe>("recipes").insertOne(recipe);
  return recipe;
}

export async function updateRecipe(id: string, input: unknown, ownerId: string): Promise<Recipe | null> {
  if (!ownerId) throw new Error("An authenticated owner is required");
  const parsed = normalizeInput(input);
  const db = await getDb();
  const recipe = await db.collection<Recipe>("recipes").findOneAndUpdate(
    { id, user_id: ownerId },
    { $set: {
      ...parsed,
      time_total: parsed.time_prep + parsed.time_cook + parsed.time_chill,
      updated_at: new Date(),
    } },
    { returnDocument: "after", projection: { _id: 0 } },
  );
  return recipe;
}
