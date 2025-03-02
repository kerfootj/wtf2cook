'use server';

import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';
import { Filter } from 'mongodb';

const ITEMS_PER_PAGE = 30;

export async function getMoreRecipes(page: number, search?: string) {
    const find: Filter<Recipe> = {};

    if (search) {
        find.name = { $regex: new RegExp(search.trim(), 'i') };
    }

    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipes = await db
        .collection<Recipe>('recipes')
        .find(find)
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .toArray();

    // If we got fewer items than the page size, there are no more results
    const hasMore = recipes.length === ITEMS_PER_PAGE;

    return {
        recipes: JSON.parse(JSON.stringify(recipes)),
        hasMore,
    };
}
