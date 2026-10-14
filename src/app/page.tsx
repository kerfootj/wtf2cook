import Link from "next/link";
import { getServerSession } from "next-auth";
import { FeaturedRecipe } from "@/components/featured-recipe";
import { RecipeCard } from "@/components/recipe-card";
import { ActionIcon } from "@/components/action-icon";
import { authOptions } from "@/lib/auth";
import { getRandomRecipe, listRecipes } from "@/lib/recipes";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const search = (params.q ?? "").slice(0, 80);
  const page = Number(params.page ?? 1);
  let result: Awaited<ReturnType<typeof listRecipes>>;
  let featured: Awaited<ReturnType<typeof getRandomRecipe>> = null;
  let canAddRecipe = false;
  try {
    const [listed, sampled, session] = await Promise.all([
      listRecipes(search, page),
      !search && (!Number.isFinite(page) || page <= 1) ? getRandomRecipe() : Promise.resolve(null),
      getServerSession(authOptions),
    ]);
    result = listed;
    featured = sampled;
    canAddRecipe = Boolean(session?.user?.id);
  } catch {
    return <main className="page-shell"><div className="notice-panel"><h1>The kitchen is temporarily closed.</h1><p>We couldn’t reach the recipe database. Check the local MongoDB connection and try again.</p></div></main>;
  }
  return (
    <main className="page-shell">
      <section className="hero-intro">
        <h1>What the <em>F*ck</em> to Cook?</h1>
      </section>
      {featured && <div className="featured-wrap"><FeaturedRecipe initialRecipe={featured} canShuffle={result.count > 1} /></div>}
      <section className="browse-section" aria-labelledby="browse-title">
        <div className="section-heading"><div><p className="kicker">Explore the collection</p><h2 id="browse-title">All recipes <span className="count-pill">{result.count}</span></h2></div>{canAddRecipe && <Link className="button browse-add" href="/recipes/new"><ActionIcon kind="add" />Add recipe</Link>}</div>
        {result.recipes.length ? <div className="recipe-grid">{result.recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div> : <div className="empty-state"><span>✳</span><h3>No recipes found</h3><p>Try a different search, or add the first recipe to this kitchen.</p></div>}
        {result.pages > 1 && <nav className="pagination" aria-label="Recipe pages">
          {result.page > 1 && <Link href={`/?q=${encodeURIComponent(search)}&page=${result.page - 1}`}>← Previous</Link>}
          <span>Page {result.page} of {result.pages}</span>
          {result.page < result.pages && <Link href={`/?q=${encodeURIComponent(search)}&page=${result.page + 1}`}>Next →</Link>}
        </nav>}
      </section>
    </main>
  );
}
