import { expect, test } from "@playwright/test";

test("visitor can browse, search, and read a recipe", async ({ page }) => {
  await page.goto("/");
  const hero = page.getByRole("heading", { name: "What the F*ck to Cook?" });
  const heroSize = await hero.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
  }));
  expect(heroSize.height).toBeLessThan(heroSize.lineHeight * 1.25);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()?.width ?? 0);
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Recipes" })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Add recipe" })).toHaveCount(0);
  await expect(nav.getByRole("button", { name: "Sign out" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /All recipes/ })).toBeVisible();
  await expect(page.locator(".site-header").getByRole("searchbox", { name: "Search recipes" })).toBeVisible();
  await expect(page.locator(".browse-section").getByRole("searchbox")).toHaveCount(0);
  await expect(page.locator(".recipe-grid .card-arrow")).toHaveCount(0);
  const firstRecipe = page.locator(".recipe-grid .card-link").first();
  await expect(firstRecipe).toBeVisible();
  const recipeName = await firstRecipe.locator("h2").innerText();
  await page.getByRole("searchbox", { name: "Search recipes" }).fill(recipeName);
  await page.getByRole("button", { name: /Search/ }).click();
  await expect(page).toHaveURL(/\?q=/);
  expect(new URL(page.url()).searchParams.get("q")).toBe(recipeName);
  await page.getByRole("link", { name: `View ${recipeName}` }).last().click();
  await expect(page.getByRole("heading", { name: "Ingredients" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Method" })).toBeVisible();
});

test("featured recipe fits a laptop and is hidden on mobile", async ({ page }, testInfo) => {
  await page.goto("/");
  const featured = page.locator(".featured-wrap");
  if (testInfo.project.name === "mobile") {
    await expect(featured).toBeHidden();
    const snap = await page.locator("html").evaluate((node) => getComputedStyle(node).scrollSnapType);
    // Chromium serializes `y proximity` as `y` (proximity is the default).
    expect(snap).toMatch(/^y(?: proximity)?$/);
  } else {
    await expect(featured).toBeVisible();
    const bounds = await featured.boundingBox();
    expect(bounds).not.toBeNull();
    expect((bounds?.y ?? 0) + (bounds?.height ?? 0)).toBeLessThanOrEqual(800);
    const meta = await featured.locator(".card-meta").boundingBox();
    expect(meta).not.toBeNull();
    expect((meta?.y ?? 0) + (meta?.height ?? 0)).toBeLessThanOrEqual((bounds?.y ?? 0) + (bounds?.height ?? 0));
    const description = await featured.locator(".card-description").boundingBox();
    const actions = await featured.locator(".feature-actions").boundingBox();
    expect(actions).not.toBeNull();
    if (description) {
      expect(description.y).toBeGreaterThan((meta?.y ?? 0) + (meta?.height ?? 0));
      expect(actions?.y ?? 0).toBeGreaterThan(description.y + description.height);
    }
    expect((actions?.y ?? 0) + (actions?.height ?? 0)).toBeLessThanOrEqual((bounds?.y ?? 0) + (bounds?.height ?? 0));
    const yes = featured.getByRole("link", { name: "F*ck Yeah!" });
    const firstHref = await yes.getAttribute("href");
    await featured.getByRole("button", { name: "F*ck No!" }).click();
    await expect(yes).not.toHaveAttribute("href", firstHref ?? "");
    await expect(featured.getByRole("button", { name: "F*ck No!" })).toBeEnabled();
  }
});
