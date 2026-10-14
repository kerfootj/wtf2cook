import { getRandomRecipe } from "@/lib/recipes";

export async function GET(request: Request) {
  const exclude = new URL(request.url).searchParams.get("exclude") ?? undefined;
  if (exclude && !/^[a-zA-Z0-9_-]{4,64}$/.test(exclude)) {
    return Response.json({ error: "Invalid recipe ID" }, { status: 400 });
  }
  try {
    const recipe = await getRandomRecipe(exclude);
    if (!recipe) return Response.json({ error: "No other recipe found" }, { status: 404 });
    return Response.json(recipe, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not load a recipe" }, { status: 503 });
  }
}
