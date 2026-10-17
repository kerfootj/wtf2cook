import assert from "node:assert/strict";
import test from "node:test";
import { IMAGE_MAX_BYTES, isRecipeImagePath, recipeImagePath } from "../src/lib/image-upload";

test("recipe uploads accept only supported images under 5 MB", () => {
  for (const [type, extension] of [
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
  ]) {
    const path = recipeImagePath({ type, size: IMAGE_MAX_BYTES });
    assert.ok(path.endsWith(`.${extension}`));
    assert.ok(isRecipeImagePath(path));
  }
  assert.throws(() => recipeImagePath({ type: "image/svg+xml", size: 100 }));
  assert.throws(() => recipeImagePath({ type: "image/png", size: 0 }));
  assert.throws(() => recipeImagePath({ type: "image/png", size: IMAGE_MAX_BYTES + 1 }));
  assert.equal(isRecipeImagePath("../secrets.txt"), false);
  assert.equal(isRecipeImagePath("other/photo.jpg"), false);
});
