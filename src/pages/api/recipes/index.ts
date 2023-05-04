import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe, Response } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response<Recipe>>,
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipes = await db
        .collection<Recipe>('recipes')
        .find({})
        .limit(20)
        .toArray();

    res.json(recipes);
}
