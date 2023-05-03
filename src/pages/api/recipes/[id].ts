import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe, Response } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response<Recipe>>,
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Missing recipe id' });
    }

    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipe = await db.collection<Recipe>('recipes').findOne({ id });

    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
}
