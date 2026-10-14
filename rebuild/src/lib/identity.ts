import { randomBytes } from "node:crypto";
import { MongoServerError } from "mongodb";
import { getDb } from "./db";

export type GoogleProfile = {
  sub: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
};

export async function resolveGoogleUser(profile: GoogleProfile): Promise<string> {
  if (!profile.sub) throw new Error("Google account ID is missing");
  const db = await getDb();
  const accounts = db.collection<{ provider: string; provider_account_id: string; user_id: string }>("auth_accounts");
  let account: { user_id: string } | null;
  try {
    account = await accounts.findOneAndUpdate(
      { provider: "google", provider_account_id: profile.sub },
      { $setOnInsert: { user_id: randomBytes(9).toString("base64url"), created_at: new Date() } },
      { upsert: true, returnDocument: "after" },
    );
  } catch (error) {
    if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
    account = await accounts.findOne({ provider: "google", provider_account_id: profile.sub });
  }
  if (!account) throw new Error("Could not resolve Google account");
  await db.collection("users").updateOne(
    { id: account.user_id },
    {
      $setOnInsert: { id: account.user_id, created_at: new Date() },
      $set: {
        name: profile.name || "",
        email: profile.email || "",
        image: profile.picture || null,
        login_at: new Date(),
      },
    },
    { upsert: true },
  );
  return account.user_id;
}

export async function resolveLinkedUser(googleSub: string): Promise<string | null> {
  const db = await getDb();
  const account = await db.collection<{ user_id: string }>("auth_accounts")
    .findOne({ provider: "google", provider_account_id: googleSub });
  return account?.user_id ?? null;
}
