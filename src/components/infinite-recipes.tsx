"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RecipeCard } from "@/components/recipe-card";
import type { Recipe } from "@/lib/recipes";

type RecipePage = { recipes: Recipe[]; page: number; pages: number };

export function InfiniteRecipes({ initialRecipes, initialPages, search }: {
  initialRecipes: Recipe[];
  initialPages: number;
  search: string;
}) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(initialPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinel = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const hasMore = page < pages;

  const loadMore = useCallback(async () => {
    if (inFlight.current || !hasMore) return;
    inFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page + 1) });
      if (search) params.set("q", search);
      const response = await fetch(`/api/recipes?${params}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Couldn’t load more recipes.");
      const next = await response.json() as RecipePage;
      setRecipes((current) => {
        const seen = new Set(current.map((recipe) => recipe.id));
        return [...current, ...next.recipes.filter((recipe) => !seen.has(recipe.id))];
      });
      setPage(next.page);
      setPages(next.pages);
    } catch {
      setError("Couldn’t load more recipes. Try again.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [hasMore, page, search]);

  useEffect(() => {
    const target = sentinel.current;
    if (!target || !hasMore || error || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadMore();
    }, { rootMargin: "400px 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [error, hasMore, loadMore]);

  return <>
    <div className="recipe-grid">{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
    {hasMore && <div className="recipe-list-end" ref={sentinel}>
      {error && <p role="alert">{error}</p>}
      <button className="button" type="button" onClick={() => void loadMore()} disabled={loading}>
        {loading ? "Loading recipes…" : error ? "Try again" : "Load more recipes"}
      </button>
    </div>}
    {!hasMore && <p className="recipe-list-end" role="status">That’s the whole menu.</p>}
  </>;
}
