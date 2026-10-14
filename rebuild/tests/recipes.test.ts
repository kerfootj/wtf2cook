import assert from "node:assert/strict";
import test from "node:test";
import { normalizeInput, recipeUrl, safePhotoUrl, slugify } from "../src/lib/recipes";
import { hashToken, idempotentRecipeId } from "../src/lib/tokens";

const valid = {
  name: "Lemon pasta", servings: 2, time_prep: 10,
  ingredients: [{ title: null, ingredients: ["Pasta", "Lemon"] }],
  instructions: [{ title: null, instructions: ["Cook pasta."] }],
};

test("normalizes recipe input and rejects forged owner fields", () => {
  assert.equal(normalizeInput(valid).time_cook, 0);
  assert.throws(() => normalizeInput({ ...valid, user_id: "someone-else" }));
  assert.throws(() => normalizeInput({ ...valid, ingredients: [] }));
  assert.throws(() => normalizeInput({ ...valid, photo_url: "javascript:alert(1)" }));
});

test("URLs preserve IDs and generate safe slugs", () => {
  assert.equal(slugify("Crème & lemon pasta!"), "creme-lemon-pasta");
  assert.equal(recipeUrl({ id: "pasta001", name: "Lemon Pasta" }), "/recipes/pasta001/lemon-pasta");
  assert.equal(safePhotoUrl("/images/burger.jpg"), "/images/burger.jpg");
  assert.equal(safePhotoUrl("javascript:alert(1)"), null);
});

test("token hashing and idempotent IDs are deterministic", () => {
  assert.equal(hashToken("abc"), hashToken("abc"));
  assert.notEqual(hashToken("abc"), hashToken("abd"));
  assert.equal(idempotentRecipeId("token", "request-1"), idempotentRecipeId("token", "request-1"));
  assert.notEqual(idempotentRecipeId("token", "request-1"), idempotentRecipeId("token", "request-2"));
});
