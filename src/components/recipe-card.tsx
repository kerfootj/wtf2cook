import Link from "next/link";
import type { Recipe } from "@/lib/recipes";
import { recipeUrl, safePhotoUrl } from "@/lib/recipes";
import { formatDuration } from "@/lib/duration";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const photo = safePhotoUrl(recipe.photo_url);
  return (
    <article className="recipe-card">
      <Link href={recipeUrl(recipe)} className="card-link" aria-label={`View ${recipe.name}`}>
        <div className="card-image">
          {photo ? <img src={photo} alt="" loading="lazy" /> : <span className="image-placeholder">✳</span>}
          <span className="card-image-sheen" />
        </div>
        <div className="card-content">
          <h2>{recipe.name}</h2>
          {recipe.description && <p className="card-description">{recipe.description}</p>}
          <div className="card-meta"><span>{formatDuration(recipe.time_total || recipe.time_prep || 0)}</span><span>{recipe.servings} servings</span></div>
        </div>
      </Link>
    </article>
  );
}
