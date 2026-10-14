import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { BSON, MongoClient, type Document } from "mongodb";

const { EJSON } = BSON;

const productionUri = process.env.MONGODB_URI;
const productionHost = "cluster0.g1hqksk.mongodb.net";
const productionDbName = "prod";
const localUri = "mongodb://127.0.0.1:27017";
const localDbName = "wtf2cook_dev";
const backupPath = resolve("backups/production-before-repair.ejson");
const action = process.argv[2] ?? "audit";

type Recipe = Document & { id: string; user_id: string; time_prep?: unknown; time_cook?: unknown; time_chill?: unknown; time_total?: unknown };
type User = Document & { id: string; email?: string; auth?: { provider?: string; provider_id?: string } };

function minutes(value: unknown, field: string): number {
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value
    : value instanceof Date ? value.getTime()
    : typeof value === "string" && /^1970-01-01T00:00:/.test(value) ? Date.parse(value)
    : NaN;
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 10_080) throw new Error(`Unsupported ${field} value`);
  return parsed;
}

function digest(value: unknown): string {
  return createHash("sha256").update(EJSON.stringify(value, { relaxed: false })).digest("hex");
}

async function main() {
  if (!productionUri || new URL(productionUri).hostname !== productionHost) throw new Error("Production Atlas URI is not the verified host");
  if (!["audit", "backup", "restore-check", "apply", "verify"].includes(action)) throw new Error("Use audit, backup, restore-check, apply, or verify");
  const production = new MongoClient(productionUri, { serverSelectionTimeoutMS: 10_000 });
  const local = new MongoClient(localUri, { serverSelectionTimeoutMS: 10_000 });
  try {
    await Promise.all([production.connect(), local.connect()]);
    const db = production.db(productionDbName);
    const localDb = local.db(localDbName);
    const [recipes, users, localAccounts, prodAccounts] = await Promise.all([
      db.collection<Recipe>("recipes").find().toArray(),
      db.collection<User>("users").find().toArray(),
      localDb.collection("auth_accounts").find({ provider: "google" }).toArray(),
      db.collection("auth_accounts").find().toArray(),
    ]);
    if (localAccounts.length !== 1) throw new Error("Expected exactly one local signed-in Google account");
    const localAccount = localAccounts[0];
    const localUser = await localDb.collection<User>("users").findOne({ id: localAccount.user_id });
    if (localUser?.email?.toLowerCase() !== "joelkerfoot@gmail.com") throw new Error("The local signed-in Google account is not Joel's");
    const googleSub = localAccount.provider_account_id;
    if (typeof googleSub !== "string") throw new Error("Google sub is missing");
    const joelUsers = users.filter((user) => user.auth?.provider === "google" && user.auth.provider_id === googleSub);
    if (joelUsers.length !== 1 || joelUsers[0].email?.toLowerCase() !== "joelkerfoot@gmail.com") throw new Error("Could not uniquely match Joel's production Google identity");
    const joel = joelUsers[0];
    const usersById = new Map(users.map((user) => [user.id, user]));
    const orphans = recipes.filter((recipe) => !usersById.has(recipe.user_id));
    const joelOwned = recipes.filter((recipe) => recipe.user_id === joel.id);
    const otherOwned = recipes.filter((recipe) => usersById.has(recipe.user_id) && recipe.user_id !== joel.id);
    const inconsistentTotals: Array<{ id: string; stored: number; sum: number }> = [];
    const conversion = recipes.map((recipe) => {
      const time_prep = minutes(recipe.time_prep, "time_prep");
      const time_cook = minutes(recipe.time_cook, "time_cook");
      const time_chill = minutes(recipe.time_chill, "time_chill");
      const time_total = minutes(recipe.time_total, "time_total");
      const sum = time_prep + time_cook + time_chill;
      if (sum !== time_total) inconsistentTotals.push({ id: recipe.id, stored: time_total, sum });
      return { _id: recipe._id, id: recipe.id, user_id: recipe.user_id, time_prep, time_cook, time_chill, time_total: sum };
    });
    const IDs = recipes.map((recipe) => recipe.id);
    if (new Set(IDs).size !== IDs.length) throw new Error("Duplicate production recipe IDs");
    const mappingConflict = prodAccounts.find((account) => account.provider === "google" && account.provider_account_id === googleSub && account.user_id !== joel.id);
    if (mappingConflict) throw new Error("Joel's production Google mapping conflicts with the legacy user");
    const summary = {
      productionRecipes: recipes.length,
      joelOwned: joelOwned.length,
      orphanedForJoel: orphans.length,
      otherOwnedUnchanged: otherOwned.length,
      inconsistentTotals,
      legacyTimingConversions: conversion.filter((_row, index) => ["time_prep", "time_cook", "time_chill", "time_total"].some((field) => typeof recipes[index][field] !== "number")).length,
      productionGoogleMappings: prodAccounts.length,
    };
    if (recipes.length !== 55 || otherOwned.length !== 1 || (action !== "verify" && (joelOwned.length !== 29 || orphans.length !== 25))) throw new Error(`Production counts changed: ${JSON.stringify(summary)}`);
    if (action === "audit") { console.log(JSON.stringify({ action, ...summary }, null, 2)); return; }
    if (action === "backup") {
      const collections = await db.listCollections({}, { nameOnly: true }).toArray();
      const snapshot: Record<string, Document[]> = {};
      for (const { name } of collections) snapshot[name] = await db.collection(name).find().toArray();
      const payload = EJSON.stringify({ database: productionDbName, host: productionHost, created_at: new Date(), collections: snapshot }, { relaxed: false });
      await mkdir(resolve("backups"), { recursive: true, mode: 0o700 });
      await writeFile(backupPath, payload, { flag: "wx", mode: 0o600 });
      const loaded = EJSON.parse(await readFile(backupPath, "utf8"), { relaxed: false }) as { collections: Record<string, Document[]> };
      if (digest(snapshot) !== digest(loaded.collections)) throw new Error("Backup round-trip validation failed");
      console.log(JSON.stringify({ action, path: backupPath, collections: Object.fromEntries(Object.entries(snapshot).map(([name, documents]) => [name, documents.length])), sha256: createHash("sha256").update(payload).digest("hex") }, null, 2));
      return;
    }
    const saved = EJSON.parse(await readFile(backupPath, "utf8"), { relaxed: false }) as { database: string; host: string; collections: Record<string, Document[]> };
    if (saved.database !== productionDbName || saved.host !== productionHost) throw new Error("Backup source mismatch");
    if (!Array.isArray(saved.collections.recipes) || saved.collections.recipes.length !== 55 || !Array.isArray(saved.collections.users)) throw new Error("Backup is incomplete");
    if (action === "restore-check") {
      const checkDb = local.db("wtf2cook_production_backup_check");
      if ((await checkDb.listCollections({}, { nameOnly: true }).toArray()).length) throw new Error("Restore-check database already exists; refusing to overwrite it");
      for (const [name, documents] of Object.entries(saved.collections)) {
        await checkDb.createCollection(name);
        if (documents.length) await checkDb.collection(name).insertMany(documents);
        const restored = await checkDb.collection(name).find().toArray();
        if (digest(documents) !== digest(restored)) throw new Error(`Restored ${name} differs from backup`);
      }
      console.log(JSON.stringify({ action, restoredDatabase: "localhost/wtf2cook_production_backup_check", collections: Object.fromEntries(Object.entries(saved.collections).map(([name, documents]) => [name, documents.length])) }, null, 2));
      return;
    }
    if (action === "verify") {
      const repaired = recipes.every((recipe) => ["time_prep", "time_cook", "time_chill", "time_total"].every((field) => typeof recipe[field] === "number")) && inconsistentTotals.length === 0;
      const linked = prodAccounts.some((account) => account.provider === "google" && account.provider_account_id === googleSub && account.user_id === joel.id);
      if (!repaired || !linked || orphans.length || joelOwned.length !== 54) throw new Error(`Production verification failed: ${JSON.stringify({ repaired, linked, ...summary })}`);
      console.log(JSON.stringify({ action, ...summary, repaired, linked }, null, 2));
      return;
    }
    if (process.env.CONFIRM_PRODUCTION_REPAIR !== "repair-prod-55") throw new Error("Set CONFIRM_PRODUCTION_REPAIR=repair-prod-55 to apply");
    if (digest(saved.collections.recipes) !== digest(recipes) || digest(saved.collections.users) !== digest(users)) throw new Error("Production data changed after the backup; stop and re-audit");
    const recipesCollection = db.collection<Recipe>("recipes");
    const accounts = db.collection("auth_accounts");
    const googleUsers = users.filter((user) => user.auth?.provider === "google" && user.auth.provider_id);
    if (new Set(googleUsers.map((user) => user.auth?.provider_id)).size !== googleUsers.length) throw new Error("Duplicate legacy Google identities");
    let updated = 0;
    const session = production.startSession();
    try {
      await session.withTransaction(async () => {
        for (const row of conversion) {
          const source = recipes.find((recipe) => recipe.id === row.id);
          if (!source) throw new Error("Recipe vanished during repair");
          const owner = usersById.has(row.user_id) ? row.user_id : joel.id;
          const result = await recipesCollection.updateOne(
            { _id: row._id, user_id: row.user_id, time_prep: source.time_prep, time_cook: source.time_cook, time_chill: source.time_chill, time_total: source.time_total },
            { $set: { user_id: owner, time_prep: row.time_prep, time_cook: row.time_cook, time_chill: row.time_chill, time_total: row.time_total } },
            { session },
          );
          if (result.matchedCount !== 1) throw new Error(`Recipe changed during repair: ${row.id}`);
          updated += result.modifiedCount;
        }
        for (const user of googleUsers) {
          const providerId = user.auth?.provider_id;
          if (!providerId) throw new Error("Legacy Google user has no provider ID");
          const result = await accounts.updateOne(
            { provider: "google", provider_account_id: providerId },
            { $setOnInsert: { provider: "google", provider_account_id: providerId, user_id: user.id, created_at: new Date() } },
            { upsert: true, session },
          );
          if (!result.acknowledged) throw new Error("Could not add Google ownership mapping");
        }
      });
    } finally {
      await session.endSession();
    }
    console.log(JSON.stringify({ action, recipesUpdated: updated, orphanedAssignedToJoel: orphans.length, otherOwnedUnchanged: otherOwned.length, googleMappings: await accounts.countDocuments({ provider: "google" }) }, null, 2));
  } finally {
    await Promise.all([production.close(), local.close()]);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
