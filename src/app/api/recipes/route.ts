import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createRecipe, recipeUrl } from "@/lib/recipes";
import { errorResponse } from "@/lib/http";

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
