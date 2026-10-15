import Link from "next/link";
import { getServerSession } from "next-auth";
import { FeaturedRecipe } from "@/components/featured-recipe";
import { InfiniteRecipes } from "@/components/infinite-recipes";
import { ActionIcon } from "@/components/action-icon";
import { authOptions } from "@/lib/auth";
import { getRandomRecipe, listRecipes } from "@/lib/recipes";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; loading?: string }> }) {
  const params = await searchParams;
  if (params.loading === "1") return <Loading />;
  const search = (params.q ?? "").slice(0, 80);
  let result: Awaited<ReturnType<typeof listRecipes>>;
  let featured: Awaited<ReturnType<typeof getRandomRecipe>> = null;
  let canAddRecipe = false;
  try {
    const [listed, sampled, session] = await Promise.all([
      listRecipes(search),
      !search ? getRandomRecipe() : Promise.resolve(null),
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
        {result.recipes.length ? <InfiniteRecipes key={search} initialRecipes={result.recipes} initialPages={result.pages} search={search} /> : <div className="empty-state"><span>✳</span><h3>No recipes found</h3><p>Try a different search, or add the first recipe to this kitchen.</p></div>}
      </section>
    </main>
  );
}
