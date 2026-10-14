import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createRecipe, listRecipes, recipeUrl } from "@/lib/recipes";
import { errorResponse } from "@/lib/http";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const rawPage = params.get("page") ?? "1";
  if (!/^[1-9]\d{0,3}$/.test(rawPage) || Number(rawPage) > 1000) {
    return Response.json({ error: "Invalid page" }, { status: 400 });
  }
  try {
    return Response.json(await listRecipes((params.get("q") ?? "").slice(0, 80), Number(rawPage)));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in required" }, { status: 401 });
  try {
    const recipe = await createRecipe(await request.json(), session.user.id);
    return Response.json({ recipe, url: recipeUrl(recipe) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
