'use server';

import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';

export async function saveRecipe(recipe: Recipe) {
    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    await db.collection('recipes').insertOne(recipe);
}
