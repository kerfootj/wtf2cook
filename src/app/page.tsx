import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';
import { Filter } from 'mongodb';
import { Home } from './home/Home';

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
    const { search, page = '1' } = props.searchParams;
    const ITEMS_PER_PAGE = 30;
    const currentPage = parseInt(page);

    const find: Filter<Recipe> = {};

    if (search && typeof search === 'string') {
        find.name = { $regex: new RegExp(search.trim(), 'i') };
    }

    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipes = await db
        .collection<Recipe>('recipes')
        .find(find)
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .toArray();

    const totalRecipes = await db
        .collection<Recipe>('recipes')
        .countDocuments(find);
    const hasMore = totalRecipes > currentPage * ITEMS_PER_PAGE;

    return (
        <Home
            initialRecipes={JSON.parse(JSON.stringify(recipes))}
            hasMore={hasMore}
            search={search}
        />
    );
}
