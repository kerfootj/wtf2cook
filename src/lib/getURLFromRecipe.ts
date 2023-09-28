import { Recipe } from '@/types';

export function getURLFromRecipe(recipe: Recipe): string {
    const { id, name } = recipe;

    return `/recipes/${id}/${name.toLowerCase().replace(/ +/g, '-')}`;
}
