import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BurgerLoader } from "../src/components/burger-loader";

test("burger loader keeps the original six layers and sesame seeds", () => {
  const markup = renderToStaticMarkup(createElement(BurgerLoader, { label: "Finding another recipe" }));
  for (const layer of ["top", "lettuce", "tomato", "cheese", "patty", "bottom"]) {
    assert.match(markup, new RegExp(`takeout-${layer}`));
  }
  assert.equal(markup.match(/class="takeout-seed"/g)?.length, 21);
  assert.match(markup, /role="status" aria-label="Finding another recipe"/);
});
