import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getRecipe } from "@/lib/recipes";
import { RecipeEditor } from "@/components/recipe-editor";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe || recipe.user_id !== session.user.id) notFound();
  return <main className="page-shell editor-shell"><RecipeEditor recipe={recipe} /></main>;
}
