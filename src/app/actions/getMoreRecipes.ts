'use server';

import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';
import { Filter } from 'mongodb';

export async function getMoreRecipes(page: number, search?: string) {
    const ITEMS_PER_PAGE = 12;
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

    return JSON.parse(JSON.stringify(recipes));
}
