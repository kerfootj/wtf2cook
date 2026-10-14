import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { RecipeEditor } from "@/components/recipe-editor";

export default async function NewRecipePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return <main className="page-shell editor-shell"><RecipeEditor /></main>;
}
