"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Recipe, RecipeInput } from "@/lib/recipes";
import { recipeUrl } from "@/lib/recipe-links";
import { ActionIcon } from "@/components/action-icon";
import { upload } from "@vercel/blob/client";
import { recipeImagePath } from "@/lib/image-upload";

type Group = { id: string; title: string | null; lines: string };

const defaultInput: RecipeInput = {
  name: "", description: "", photo_url: "", servings: 2,
  time_prep: 10, time_cook: 0, time_chill: 0,
  ingredients: [{ title: null, ingredients: [""] }],
  instructions: [{ title: null, instructions: [""] }], notes: "",
};

export function RecipeEditor({ recipe }: { recipe?: Recipe }) {
  const router = useRouter();
  const initial = recipe ?? defaultInput;
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial.photo_url ?? "");
  const [servings, setServings] = useState(initial.servings);
  const [prep, setPrep] = useState(initial.time_prep);
  const [cook, setCook] = useState(initial.time_cook ?? 0);
  const [chill, setChill] = useState(initial.time_chill ?? 0);
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [ingredients, setIngredients] = useState<Group[]>(initial.ingredients.map((group, index) => ({ id: `ingredient-${index}`, title: group.title, lines: group.ingredients.join("\n") })));
  const [instructions, setInstructions] = useState<Group[]>(initial.instructions.map((group, index) => ({ id: `instruction-${index}`, title: group.title, lines: group.instructions.join("\n") })));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const cancelUrl = recipe ? recipeUrl(recipe) : "/";

  function updateGroup(groups: Group[], setGroups: (groups: Group[]) => void, index: number, patch: Partial<Group>) {
    setGroups(groups.map((group, current) => current === index ? { ...group, ...patch } : group));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const input = {
      name, description, photo_url: photoUrl, servings: Number(servings),
      time_prep: Number(prep), time_cook: Number(cook), time_chill: Number(chill), notes,
      ingredients: ingredients.map((group) => ({ title: group.title || null, ingredients: group.lines.split("\n").map((line) => line.trim()).filter(Boolean) })),
      instructions: instructions.map((group) => ({ title: group.title || null, instructions: group.lines.split("\n").map((line) => line.trim()).filter(Boolean) })),
    };
    try {
      const response = await fetch(recipe ? `/api/recipes/${recipe.id}` : "/api/recipes", {
        method: recipe ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save recipe");
      router.push(result.url);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save recipe");
      setSaving(false);
    }
  }

  async function uploadPhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const pathname = recipeImagePath(file);
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/images",
      });
      setPhotoUrl(blob.url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not upload photo"); }
    setUploading(false);
  }

  return (
    <form className="editor-card" onSubmit={save}>
      <div className="editor-heading"><div><p className="kicker">Make it delicious</p><h1>{recipe ? "Edit recipe" : "New recipe"}</h1></div><div className="editor-actions"><Link className="button editor-action" href={cancelUrl}>Cancel</Link><button className="button button-primary editor-action" disabled={saving || uploading} type="submit"><ActionIcon kind="save" />{saving ? "Saving…" : "Save recipe"}</button></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="field-grid">
        <label className="field full">Recipe name<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={140} placeholder="The one everyone asks you to make" /></label>
        <label className="field full">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} maxLength={3000} placeholder="What makes it good?" /></label>
        <label className="field full">Photo URL<input value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} type="url" placeholder="https://…" /></label>
        <label className="field full">Or upload a photo <span className="field-help">JPEG, PNG or WebP, up to 5 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => uploadPhoto(event.target.files?.[0])} />{uploading && <span role="status">Uploading photo…</span>}</label>
        <label className="field">Servings<input value={servings} onChange={(event) => setServings(Number(event.target.value))} type="number" min={1} max={100} required /></label>
        <label className="field">Prep (min)<input value={prep} onChange={(event) => setPrep(Number(event.target.value))} type="number" min={0} required /></label>
        <label className="field">Cook (min)<input value={cook} onChange={(event) => setCook(Number(event.target.value))} type="number" min={0} required /></label>
        <label className="field">Chill (min)<input value={chill} onChange={(event) => setChill(Number(event.target.value))} type="number" min={0} required /></label>
      </div>
      <EditorGroups title="Ingredients" hint="One ingredient per line" groups={ingredients} setGroups={setIngredients} updateGroup={updateGroup} />
      <EditorGroups title="Instructions" hint="One step per line" groups={instructions} setGroups={setInstructions} updateGroup={updateGroup} />
      <label className="field full">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} maxLength={5000} placeholder="Tips, substitutions, or things to remember next time" /></label>
      <div className="editor-footer editor-actions"><Link className="button editor-action" href={cancelUrl}>Cancel</Link><button className="button button-primary editor-action" disabled={saving || uploading} type="submit"><ActionIcon kind="save" />{saving ? "Saving…" : "Save recipe"}</button></div>
    </form>
  );
}

function EditorGroups({ title, hint, groups, setGroups, updateGroup }: {
  title: string; hint: string; groups: Group[]; setGroups: (groups: Group[]) => void;
  updateGroup: (groups: Group[], setGroups: (groups: Group[]) => void, index: number, patch: Partial<Group>) => void;
}) {
  return <section className="editor-groups"><div className="editor-section-title"><h2>{title}</h2><button type="button" className="text-button" onClick={() => setGroups([...groups, { id: crypto.randomUUID(), title: null, lines: "" }])}>+ Add section</button></div>
    {groups.map((group, index) => <div className="editor-group" key={group.id}>
      <div className="group-heading"><span>Section {index + 1}</span>{groups.length > 1 && <button type="button" className="text-button remove" onClick={() => setGroups(groups.filter((_, current) => current !== index))}>Remove</button>}</div>
      <label className="field">Section title (optional)<input value={group.title ?? ""} onChange={(event) => updateGroup(groups, setGroups, index, { title: event.target.value })} placeholder="For the sauce, for serving…" /></label>
      <label className="field">{hint}<textarea value={group.lines} onChange={(event) => updateGroup(groups, setGroups, index, { lines: event.target.value })} rows={6} required placeholder={title === "Ingredients" ? "2 tbsp olive oil\n1 onion\n…" : "Heat the pan.\nAdd the onion.\n…"} /></label>
    </div>)}
  </section>;
}
