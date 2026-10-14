import { MongoClient } from "mongodb";

// Run only after a real Google sign-in has created an auth_accounts record.
// This preserves legacy recipe IDs and owner IDs; it never rewrites recipes.
const args = new Set(process.argv.slice(2));
const option = (name: string) => process.argv.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1);
const ownerId = option("--owner-id");
const googleSub = option("--google-sub");
const expectedEmail = option("--verified-email")?.toLowerCase();
const apply = args.has("--apply");
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function main() {
if (!uri || !dbName || !ownerId || !googleSub || !expectedEmail) {
  throw new Error("Set MONGODB_URI and MONGODB_DB, then pass --owner-id, --google-sub, and --verified-email");
}
if (!/^[A-Za-z0-9_-]{4,64}$/.test(ownerId) || googleSub.length < 5) {
  throw new Error("Invalid owner ID or Google sub");
}
if (apply && !args.has("--backup-confirmed")) {
  throw new Error("--apply requires a verified, restorable backup and --backup-confirmed");
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const accounts = db.collection<{ provider: string; provider_account_id: string; user_id: string }>("auth_accounts");
  const users = db.collection<{ id: string; email?: string; name?: string; image?: string | null }>("users");
  const recipes = db.collection<{ user_id: string }>("recipes");
  const account = await accounts.findOne({ provider: "google", provider_account_id: googleSub });
  if (!account) throw new Error("This Google account has not signed in to this database");
  const currentUser = await users.findOne({ id: account.user_id });
  if (!currentUser || currentUser.email?.toLowerCase() !== expectedEmail) {
    throw new Error("The signed-in Google account does not match the verified email");
  }
  const [legacyRecipes, currentRecipes, targetUser, otherAccount] = await Promise.all([
    recipes.countDocuments({ user_id: ownerId }),
    recipes.countDocuments({ user_id: account.user_id }),
    users.findOne({ id: ownerId }),
    accounts.findOne({ user_id: ownerId, provider_account_id: { $ne: googleSub } }),
  ]);
  if (!legacyRecipes) throw new Error("No recipes belong to the requested legacy owner ID");
  if (otherAccount) throw new Error("Another account already owns the requested legacy owner ID");
  if (targetUser?.email && targetUser.email.toLowerCase() !== expectedEmail) {
    throw new Error("The target owner record belongs to a different email; investigate manually");
  }
  if (account.user_id !== ownerId && currentRecipes) {
    throw new Error("The current Google user already owns recipes; merge those deliberately before relinking");
  }
  console.log(JSON.stringify({ database: dbName, legacyOwnerId: ownerId, legacyRecipes, currentOwnerId: account.user_id, currentRecipes, alreadyLinked: account.user_id === ownerId, action: apply ? "apply" : "dry-run" }, null, 2));
  if (apply && account.user_id !== ownerId) {
    await users.updateOne({ id: ownerId }, {
      $setOnInsert: { id: ownerId, created_at: new Date() },
      $set: { email: currentUser.email, name: currentUser.name ?? "", image: currentUser.image ?? null, login_at: new Date() },
    }, { upsert: true });
    const result = await accounts.updateOne(
      { provider: "google", provider_account_id: googleSub, user_id: account.user_id },
      { $set: { user_id: ownerId } },
    );
    if (result.modifiedCount !== 1) throw new Error("Account mapping changed concurrently; check it before retrying");
    console.log("Google account linked to the legacy owner; recipe records were not modified.");
  }
} finally {
  await client.close();
}
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
