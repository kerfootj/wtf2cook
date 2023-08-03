import { Recipe as RecipeDetails } from '@/components/organisms';
import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';

type RecipePageParams = Pick<Recipe, 'id' | 'name'>;

type RecipePageProps = {
    params: RecipePageParams;
};

export async function generateStaticParams() {
    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipes = await db
        .collection<RecipePageParams>('recipes')
        .find()
        .project({ id: 1, name: 1 })
        .toArray();

    return recipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name.toLowerCase().replace(/ +/g, '-'),
    }));
}

export default async function RecipePage(props: RecipePageProps) {
    const { id } = props.params;

    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipe = await db.collection<Recipe>('recipes').findOne({ id });

    if (!recipe) {
        return { notFound: true };
    }

    return <RecipeDetails recipe={JSON.parse(JSON.stringify(recipe))} />;
}
