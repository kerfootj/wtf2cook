import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { MongoClient } from "mongodb";
import { createRecipe, getRecipe, updateRecipe } from "../src/lib/recipes";
import { resolveGoogleUser, resolveLinkedUser } from "../src/lib/identity";
import { issueToken, verifyToken } from "../src/lib/tokens";
import { closeDbConnections } from "../src/lib/db";
import { POST as agentCreateRecipe } from "../src/app/api/v1/recipes/route";

const uri = process.env.TEST_MONGODB_URI;
const name = process.env.MONGODB_DB;

test("ownership and token integration against an isolated local database", { skip: !uri }, async () => {
  if (!uri || !name || !["localhost", "127.0.0.1"].includes(new URL(uri).hostname) || name !== "wtf2cook_test") {
    throw new Error("Integration tests require localhost wtf2cook_test");
  }
  process.env.MONGODB_URI = uri;
  const client = new MongoClient(uri);
  const db = client.db(name);
  const sub = `test-${randomUUID()}`;
  let recipeId = "";
  let userId = "";
  let tokenId = "";
  try {
    userId = await resolveGoogleUser({ sub, email: "test@example.invalid", name: "Test Chef" });
    assert.equal(await resolveLinkedUser(sub), userId);
    assert.equal(await resolveGoogleUser({ sub, email: "renamed@example.invalid" }), userId);
    const recipe = await createRecipe({
      name: "Test soup", servings: 2, time_prep: 10,
      ingredients: [{ title: null, ingredients: ["Water"] }],
      instructions: [{ title: null, instructions: ["Boil it."] }],
    }, userId);
    recipeId = recipe.id;
    assert.equal((await getRecipe(recipe.id))?.user_id, userId);
    const updatedInput = {
      name: "Better soup", servings: 2, time_prep: 10,
      ingredients: [{ title: null, ingredients: ["Water"] }],
      instructions: [{ title: null, instructions: ["Boil it."] }],
    };
    assert.equal(await updateRecipe(recipe.id, updatedInput, "other-user"), null);
    const updated = await updateRecipe(recipe.id, updatedInput, userId);
    assert.equal(updated?.name, "Better soup");
    const issued = await issueToken(userId, "Integration test");
    tokenId = issued.id;
    assert.equal((await verifyToken(issued.token))?.user_id, userId);
    await db.collection("api_tokens").updateOne({ id: tokenId }, { $set: { revoked_at: new Date() } });
    assert.equal(await verifyToken(issued.token), null);
  } finally {
    if (recipeId) await db.collection("recipes").deleteOne({ id: recipeId });
    if (tokenId) await db.collection("api_tokens").deleteOne({ id: tokenId });
    await db.collection("auth_accounts").deleteOne({ provider: "google", provider_account_id: sub });
    if (userId) await db.collection("users").deleteOne({ id: userId });
    await client.close();
    await closeDbConnections();
  }
});

test("agent API publishes once, rejects forged ownership, and honors revocation", { skip: !uri }, async () => {
  if (!uri || !name || !["localhost", "127.0.0.1"].includes(new URL(uri).hostname) || name !== "wtf2cook_test") {
    throw new Error("Integration tests require localhost wtf2cook_test");
  }
  process.env.MONGODB_URI = uri;
  const client = new MongoClient(uri);
  const db = client.db(name);
  const ownerId = `test-${randomUUID()}`;
  const issued = await issueToken(ownerId, "Agent API test");
  const key = `test-${randomUUID()}`;
  const input = {
    name: "Agent soup", servings: 2, time_prep: 10,
    ingredients: [{ title: null, ingredients: ["Water"] }],
    instructions: [{ title: null, instructions: ["Boil it."] }],
  };
  const request = (body: unknown, token = issued.token, idempotencyKey = key) => new Request("http://localhost/api/v1/recipes", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "idempotency-key": idempotencyKey },
    body: JSON.stringify(body),
  });
  try {
    const first = await agentCreateRecipe(request(input));
    assert.equal(first.status, 201);
    const created = await first.json();
    assert.equal(created.status, "published");
    assert.equal((await getRecipe(created.id))?.user_id, ownerId);
    const retry = await agentCreateRecipe(request(input));
    assert.equal(retry.status, 200);
    assert.equal((await retry.json()).id, created.id);
    assert.equal((await agentCreateRecipe(request({ ...input, name: "Different soup" }))).status, 409);
    assert.equal((await agentCreateRecipe(request({ ...input, user_id: "another-user" }, issued.token, `${key}-forged`))).status, 400);
    assert.equal((await agentCreateRecipe(request(input, "invalid", `${key}-invalid`))).status, 401);
    await db.collection("api_tokens").updateOne({ id: issued.id }, { $set: { revoked_at: new Date() } });
    assert.equal((await agentCreateRecipe(request(input, issued.token, `${key}-revoked`))).status, 401);
  } finally {
    await db.collection("recipes").deleteMany({ user_id: ownerId });
    await db.collection("api_tokens").deleteOne({ id: issued.id });
    await db.collection("idempotency").deleteMany({ token_id: issued.id });
    await db.collection("api_rate_limits").deleteMany({ token_id: issued.id });
    await client.close();
    await closeDbConnections();
  }
});

test("legacy owner link is dry-run first and idempotent after verified apply", { skip: !uri }, async () => {
  if (!uri || !name || !["localhost", "127.0.0.1"].includes(new URL(uri).hostname) || name !== "wtf2cook_test") {
    throw new Error("Integration tests require localhost wtf2cook_test");
  }
  const client = new MongoClient(uri);
  const db = client.db(name);
  const suffix = randomUUID().slice(0, 8);
  const sourceId = `current-${suffix}`;
  const legacyId = `legacy-${suffix}`;
  const googleSub = `google-${suffix}`;
  const email = "owner@example.invalid";
  const command = (extra: string[] = []) => spawnSync(process.execPath, [
    "--import", "tsx", "scripts/link-owner.ts",
    `--owner-id=${legacyId}`, `--google-sub=${googleSub}`, `--verified-email=${email}`, ...extra,
  ], { cwd: process.cwd(), env: { ...process.env, MONGODB_URI: uri, MONGODB_DB: name }, encoding: "utf8" });
  try {
    await db.collection("users").insertOne({ id: sourceId, email, name: "Owner" });
    await db.collection("auth_accounts").insertOne({ provider: "google", provider_account_id: googleSub, user_id: sourceId });
    await db.collection("recipes").insertOne({ id: `recipe-${suffix}`, user_id: legacyId, name: "Legacy soup" });
    const dry = command();
    assert.equal(dry.status, 0, dry.stderr);
    assert.match(dry.stdout, /"action": "dry-run"/);
    assert.equal((await db.collection("auth_accounts").findOne({ provider_account_id: googleSub }))?.user_id, sourceId);
    assert.notEqual(command(["--apply"]).status, 0);
    const applied = command(["--apply", "--backup-confirmed"]);
    assert.equal(applied.status, 0, applied.stderr);
    assert.equal((await db.collection("auth_accounts").findOne({ provider_account_id: googleSub }))?.user_id, legacyId);
    assert.equal((await db.collection("recipes").findOne({ id: `recipe-${suffix}` }))?.user_id, legacyId);
    assert.equal(command(["--apply", "--backup-confirmed"]).status, 0);
  } finally {
    await db.collection("users").deleteMany({ id: { $in: [sourceId, legacyId] } });
    await db.collection("auth_accounts").deleteOne({ provider_account_id: googleSub });
    await db.collection("recipes").deleteOne({ id: `recipe-${suffix}` });
    await client.close();
    await closeDbConnections();
  }
});
