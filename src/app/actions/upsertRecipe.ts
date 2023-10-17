'use server';

import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';

export async function upsertRecipe(recipe: Recipe & { _id?: string }) {
    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    // remove to avoid converting ObjectId to string
    delete recipe._id;

    // TODO: when creating a new recipe, check if the id already exists

    await db
        .collection('recipes')
        .updateOne(
            { id: recipe.id },
            { $set: recipe as Recipe },
            { upsert: true },
        );
}
