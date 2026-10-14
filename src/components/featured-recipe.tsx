"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Recipe } from "@/lib/recipes";
import { recipeUrl, safePhotoUrl } from "@/lib/recipe-links";
import { featuredLabelForHour } from "@/lib/featured-label";
import { formatDuration } from "@/lib/duration";
import { BurgerLoader } from "@/components/burger-loader";

export function FeaturedRecipe({ initialRecipe, canShuffle }: { initialRecipe: Recipe; canShuffle: boolean }) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [featuredLabel, setFeaturedLabel] = useState("Today’s pick");
  const photo = safePhotoUrl(recipe.photo_url);

  useEffect(() => {
    const updateLabel = () => setFeaturedLabel(featuredLabelForHour(new Date().getHours()));
    updateLabel();
    const interval = window.setInterval(updateLabel, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  async function shuffle() {
    setLoading(true);
    setError("");
    const minimumDisplay = new Promise<void>((resolve) => window.setTimeout(resolve, 1600));
    try {
      const response = await fetch(`/api/recipes/random?exclude=${encodeURIComponent(recipe.id)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Couldn’t find another recipe. Try again.");
      setRecipe((await response.json()) as Recipe);
    } catch {
      setError("Couldn’t find another recipe. Try again.");
    } finally {
      await minimumDisplay;
      setLoading(false);
    }
  }

  return (
    <article className="recipe-card recipe-card-featured" aria-busy={loading}>
      <div className="featured-layout">
        <div className="card-image">
          {photo ? <img src={photo} alt="" /> : <span className="image-placeholder">✳</span>}
          <span className="card-image-sheen" />
        </div>
        <div className="card-content">
          <div className="card-eyebrow"><span className="eyebrow-dot" /> {featuredLabel}</div>
          <h2>{recipe.name}</h2>
          <div className="card-meta"><span>{formatDuration(recipe.time_total || recipe.time_prep || 0)}</span><span>{recipe.servings} servings</span></div>
          {recipe.description && <p className="card-description">{recipe.description}</p>}
          <div className="feature-actions">
            <Link className="button feature-yes" href={recipeUrl(recipe)}>F*ck Yeah!</Link>
            <button className="button feature-no" type="button" onClick={shuffle} disabled={loading || !canShuffle}>{loading ? "Finding another…" : "F*ck No!"}</button>
          </div>
          <p className="feature-error" role="status" aria-live="polite">{error}</p>
        </div>
      </div>
      {loading && <div className="feature-loading-overlay"><BurgerLoader label="Finding another recipe" size={7} /></div>}
    </article>
  );
}
