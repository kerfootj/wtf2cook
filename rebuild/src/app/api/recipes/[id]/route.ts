import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { getRecipe, recipeUrl, updateRecipe } from "@/lib/recipes";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await context.params;
  const existing = await getRecipe(id);
  if (!existing) return Response.json({ error: "Recipe not found" }, { status: 404 });
  if (existing.user_id !== session.user.id) return Response.json({ error: "Not your recipe" }, { status: 403 });
  try {
    const recipe = await updateRecipe(id, await request.json(), session.user.id);
    if (!recipe) return Response.json({ error: "Recipe not found" }, { status: 404 });
    return Response.json({ recipe, url: recipeUrl(recipe) });
  } catch (error) {
    return errorResponse(error);
  }
}
