import { createHash } from "node:crypto";
import { MongoServerError } from "mongodb";
import { ensureIndexes, getDb } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { createRecipe, getRecipe, normalizeInput, recipeUrl } from "@/lib/recipes";
import { applyRateLimit, idempotentRecipeId, verifyToken } from "@/lib/tokens";

export async function POST(request: Request) {
  const bearer = /^Bearer (.+)$/i.exec(request.headers.get("authorization") ?? "");
  if (!bearer) return Response.json({ error: "Bearer token required" }, { status: 401 });
  await ensureIndexes();
  const token = await verifyToken(bearer[1]);
  if (!token) return Response.json({ error: "Invalid or expired token" }, { status: 401 });
  if (!await applyRateLimit(token.id)) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const input = normalizeInput(await request.json());
    const key = request.headers.get("idempotency-key");
    if (key && (key.length > 128 || key.length < 8 || !/^[A-Za-z0-9._:-]+$/.test(key))) {
      return Response.json({ error: "Invalid Idempotency-Key" }, { status: 400 });
    }
    let id: string | undefined;
    if (key) {
      id = idempotentRecipeId(token.id, key);
      const requestHash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
      const db = await getDb();
      const records = db.collection<{ token_id: string; key: string; request_hash: string; recipe_id: string }>("idempotency");
      let record: { request_hash: string } | null;
      try {
        record = await records.findOneAndUpdate(
          { token_id: token.id, key },
          { $setOnInsert: { request_hash: requestHash, recipe_id: id, created_at: new Date() } },
          { upsert: true, returnDocument: "after" },
        );
      } catch (error) {
        if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
        record = await records.findOne({ token_id: token.id, key });
      }
      if (record?.request_hash !== requestHash) {
        return Response.json({ error: "Idempotency-Key was used with different content" }, { status: 409 });
      }
      const existing = await getRecipe(id);
      if (existing) return Response.json({ id: existing.id, url: recipeUrl(existing), status: "published" });
    }
    try {
      const recipe = await createRecipe(input, token.user_id, id);
      return Response.json({ id: recipe.id, url: recipeUrl(recipe), status: "published" }, { status: 201 });
    } catch (error) {
      if (id && error instanceof MongoServerError && error.code === 11000) {
        const existing = await getRecipe(id);
        if (existing) return Response.json({ id: existing.id, url: recipeUrl(existing), status: "published" });
      }
      throw error;
    }
  } catch (error) {
    return errorResponse(error);
  }
}
