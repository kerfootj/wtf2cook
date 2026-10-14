import assert from "node:assert/strict";
import test from "node:test";
import { formatCompactDuration, formatDuration } from "../src/lib/duration";

test("durations over 60 minutes display hours and remaining minutes", () => {
  assert.equal(formatDuration(60), "60 min");
  assert.equal(formatDuration(61), "1 hr 1 min");
  assert.equal(formatDuration(90), "1 hr 30 min");
  assert.equal(formatDuration(120), "2 hrs");
  assert.equal(formatDuration(270), "4 hrs 30 min");
});

test("compact duration labels stay on one line in recipe detail stats", () => {
  assert.equal(formatCompactDuration(20), "20m");
  assert.equal(formatCompactDuration(60), "60m");
  assert.equal(formatCompactDuration(70), "1h 10m");
  assert.equal(formatCompactDuration(120), "2h");
  assert.equal(formatCompactDuration(270), "4h 30m");
});
