import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { MongoServerError } from "mongodb";
import { getDb } from "./db";

export type ApiToken = {
  id: string;
  user_id: string;
  label: string;
  hash: string;
  scopes: string[];
  created_at: Date;
  expires_at: Date;
  revoked_at?: Date;
};

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueToken(ownerId: string, label: string) {
  const id = randomBytes(9).toString("base64url");
  const secret = randomBytes(32).toString("base64url");
  const token = `wtf_${id}_${secret}`;
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const db = await getDb();
  await db.collection<ApiToken>("api_tokens").insertOne({
    id, user_id: ownerId, label: label.trim().slice(0, 80),
    hash: hashToken(token), scopes: ["recipes:create"],
    created_at: new Date(), expires_at: expiresAt,
  });
  return { token, id, expires_at: expiresAt };
}

export async function verifyToken(value: string): Promise<ApiToken | null> {
  const match = /^wtf_([A-Za-z0-9_-]{12})_([A-Za-z0-9_-]{43})$/.exec(value);
  if (!match) return null;
  const db = await getDb();
  const record = await db.collection<ApiToken>("api_tokens").findOne({ id: match[1] });
  if (!record || record.revoked_at || record.expires_at <= new Date()) return null;
  const supplied = Buffer.from(hashToken(value), "hex");
  const expected = Buffer.from(record.hash, "hex");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  return record.scopes.includes("recipes:create") ? record : null;
}

export async function applyRateLimit(tokenId: string): Promise<boolean> {
  const db = await getDb();
  const window = Math.floor(Date.now() / 60000);
  const collection = db.collection<{ token_id: string; window: number; count: number }>("api_rate_limits");
  let record: { count: number } | null;
  try {
    record = await collection.findOneAndUpdate(
      { token_id: tokenId, window },
      { $inc: { count: 1 }, $setOnInsert: { expires_at: new Date((window + 2) * 60000) } },
      { upsert: true, returnDocument: "after" },
    );
  } catch (error) {
    if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
    // Another request created this window between the lookup and the upsert.
    record = await collection.findOneAndUpdate(
      { token_id: tokenId, window }, { $inc: { count: 1 } }, { returnDocument: "after" },
    );
  }
  return (record?.count ?? 0) <= 30;
}

export function idempotentRecipeId(tokenId: string, key: string): string {
  return createHash("sha256").update(`${tokenId}:${key}`).digest("base64url").slice(0, 16);
}
