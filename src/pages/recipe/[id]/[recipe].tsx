import { Page } from '@/components/molecules';
import { Recipe as RecipeDetails } from '@/components/organisms';
import clientPromise, { MONGO_DB } from '@/lib/mongodb';
import { Recipe } from '@/types';
import { Box } from '@mui/material';
import {
    GetStaticPathsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';
import { useRouter } from 'next/router';

type RecipePageParams = Pick<Recipe, 'id' | 'name'>;

type RecipePageProps = {
    recipe: Recipe;
};

/**
 * Get a list of recipes from the database to generate static pages for.
 */
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    const recipes = await db
        .collection<RecipePageParams>('recipes')
        .find()
        .project({ id: 1, name: 1 })
        .toArray();

    const paths = recipes.map((recipe) => ({
        params: {
            id: recipe.id,
            recipe: recipe.name.toLowerCase().replace(/ +/g, '-'),
        },
    }));

    return {
        paths,
        fallback: true,
    };
}

/**
 * Generate a static page for a recipe.
 */
export async function getStaticProps({
    params,
}: GetStaticPropsContext<RecipePageParams>): Promise<
    GetStaticPropsResult<RecipePageProps>
> {
    const client = await clientPromise;
    const db = client.db(MONGO_DB);

    if (!params) {
        return { notFound: true };
    }

    const { id } = params;

    const data = await db.collection<Recipe>('recipes').findOne({ id });

    if (!data) {
        return { notFound: true };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...recipe } = data;

    return {
        props: {
            // next can only serialize scalar values, this converts date objects to strings
            recipe: JSON.parse(JSON.stringify(recipe)),
        },
        revalidate: 1,
    };
}

export default function RecipePage(props: RecipePageProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <Page>Loading...</Page>;
    }

    const { recipe } = props;

    return (
        <Page
            title={recipe.name}
            description={recipe.description}
            image={recipe.photo_url}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    my: 2,
                }}
            >
                <RecipeDetails recipe={recipe} />
            </Box>
        </Page>
    );
}
