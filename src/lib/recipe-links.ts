export function slugify(name: string): string {
  return name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "recipe";
}

export function recipeUrl(recipe: { id: string; name: string }): string {
  return `/recipes/${encodeURIComponent(recipe.id)}/${slugify(recipe.name)}`;
}

export function safePhotoUrl(value: string | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/images/") && !value.includes("..")) return value;
  try { return new URL(value).protocol === "https:" ? value : null; } catch { return null; }
}
