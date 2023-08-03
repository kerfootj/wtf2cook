import { RecipeGrid } from '@/components/organisms/RecipeGrid';
import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';
import { Filter } from 'mongodb';

export const metadata = {
    metadataBase: new URL('https://www.wtf2cook.ca'),
    title: 'WTF 2 Cook',
    description: 'Visit wtf2cook.ca for the best no bs recipes.',
    openGraph: {
        title: 'WTF 2 Cook',
        description: 'Visit wtf2cook.ca for the best no bs recipes.',
        type: 'website',
        siteName: 'wtf2cook.ca',
        images: '/images/burger.jpg',
    },
};

export default async function HomePage(props: {
    searchParams: { [key: string]: string };
}) {
    const { search } = props.searchParams;

    const find: Filter<Recipe> = {};

    if (search && typeof search === 'string') {
        find.name = { $regex: new RegExp(search.trim(), 'i') };
    }

    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipes = await db
        .collection<Recipe>('recipes')
        .find(find)
        .limit(40)
        .toArray();

    return (
        <RecipeGrid
            recipes={JSON.parse(
                JSON.stringify(recipes.sort(() => Math.random() - 0.5)),
            )}
        />
    );
}
