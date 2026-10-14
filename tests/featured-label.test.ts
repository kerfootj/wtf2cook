import assert from "node:assert/strict";
import test from "node:test";
import { featuredLabelForHour } from "../src/lib/featured-label";

test("featured label follows local meal times", () => {
  assert.equal(featuredLabelForHour(4), "Midnight munchies? Obviously.");
  assert.equal(featuredLabelForHour(5), "Breakfast? F*ck yeah.");
  assert.equal(featuredLabelForHour(10), "Breakfast? F*ck yeah.");
  assert.equal(featuredLabelForHour(11), "Lunch? Let’s f*cking eat.");
  assert.equal(featuredLabelForHour(15), "Lunch? Let’s f*cking eat.");
  assert.equal(featuredLabelForHour(16), "What the f*ck's for dinner?");
  assert.equal(featuredLabelForHour(21), "What the f*ck's for dinner?");
  assert.equal(featuredLabelForHour(22), "Midnight munchies? Obviously.");
});
