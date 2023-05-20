import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe, Response } from '@/types';
import { Filter } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response<Recipe>>,
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const find: Filter<Recipe> = {};

    if (req.query.search && typeof req.query.search === 'string') {
        find.name = { $regex: new RegExp(req.query.search, 'i') };
    }

    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipes = await db
        .collection<Recipe>('recipes')
        .find(find)
        .limit(40)
        .toArray();

    res.json(recipes);
}
