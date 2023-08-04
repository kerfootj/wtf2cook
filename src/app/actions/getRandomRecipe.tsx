'use server';
import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';

/**
 * Get a random recipe from the database
 * @returns {Promise<Recipe>} A random recipe from the database
 */
export async function getRandomRecipe() {
    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const result = await db
        .collection<Recipe>('recipes')
        .aggregate([{ $sample: { size: 1 } }]);

    const [recipe] = await result.toArray();

    return JSON.parse(JSON.stringify(recipe)) as Recipe;
}
