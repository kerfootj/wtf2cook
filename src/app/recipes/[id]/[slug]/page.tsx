import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getRecipe, recipeUrl, safePhotoUrl } from "@/lib/recipes";
import { formatCompactDuration } from "@/lib/duration";
import { ActionIcon } from "@/components/action-icon";

export const dynamic = "force-dynamic";

export default async function RecipePage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();
  const canonical = recipeUrl(recipe);
  const photo = safePhotoUrl(recipe.photo_url);
  if (!canonical.endsWith(`/${slug}`)) redirect(canonical);
  const session = await getServerSession(authOptions);
  const editable = Boolean(session?.user?.id && session.user.id === recipe.user_id);
  const totalMinutes = recipe.time_total || (recipe.time_prep ?? 0) + (recipe.time_cook ?? 0) + (recipe.time_chill ?? 0);
  return (
    <main className="page-shell detail-shell">
      <div className="detail-toolbar">
        <Link className="back-link" href="/">← Back to recipes</Link>
        {editable && <Link className="button button-primary" href={`/recipes/${recipe.id}/edit`}><ActionIcon kind="edit" />Edit recipe</Link>}
      </div>
      <article className="detail-card">
        <div className="detail-hero">
          <div className="detail-intro"><h1>{recipe.name}</h1>{recipe.description && <p className="detail-description">{recipe.description}</p>}
            <dl className="detail-stats">
              {recipe.time_prep > 0 && <DurationStat label="Prep" minutes={recipe.time_prep} />}
              {recipe.time_cook > 0 && <DurationStat label="Cook" minutes={recipe.time_cook} />}
              {recipe.time_chill > 0 && <DurationStat label="Chill" minutes={recipe.time_chill} />}
              {totalMinutes > 0 && <DurationStat label="Total" minutes={totalMinutes} total />}
              <div><dt>Serves</dt><dd><strong>{recipe.servings}</strong></dd></div>
            </dl>
          </div>
          <div className="detail-image">{photo ? <img src={photo} alt={recipe.name} /> : <span className="image-placeholder">✳</span>}</div>
        </div>
        <div className="recipe-body">
          <section className="ingredients-panel"><p className="kicker">What you need</p><h2>Ingredients</h2>{recipe.ingredients.map((group, index) => <div className="recipe-section" key={index}>{group.title && <h3>{group.title}</h3>}<ul className="ingredient-list">{group.ingredients.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul></div>)}</section>
          <section className="instructions-panel"><p className="kicker">Don't F*ck it Up</p><h2>Method</h2>{recipe.instructions.map((group, index) => <div className="recipe-section" key={index}>{group.title && <h3>{group.title}</h3>}<ol className="instruction-list">{group.instructions.map((step, stepIndex) => <li key={stepIndex}><span className="step-number">{String(stepIndex + 1).padStart(2, "0")}</span><span>{step}</span></li>)}</ol></div>)}</section>
        </div>
        {recipe.notes && <section className="recipe-notes"><p className="kicker">A little extra</p><h2>Notes</h2><p>{recipe.notes}</p></section>}
      </article>
    </main>
  );
}

function DurationStat({ label, minutes, total = false }: { label: string; minutes: number; total?: boolean }) {
  return <div className={total ? "detail-stat-total" : undefined}><dt>{label}</dt><dd><strong>{formatCompactDuration(minutes)}</strong></dd></div>;
}
