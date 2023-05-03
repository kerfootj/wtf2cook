import Page from '@/components/Page';
import { Recipe as RecipeDetails } from '@/components/Recipe';
import { api } from '@/lib/api';
import { Recipe } from '@/types';
import { Box } from '@mui/material';
import axios from 'axios';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type RecipePageParams = {
    id: string;
};

type RecipePageProps = {
    recipe: Recipe;
};

export async function getServerSideProps(
    context: GetServerSidePropsContext<RecipePageParams>,
): Promise<GetServerSidePropsResult<RecipePageProps>> {
    // handle invalid or missing id in url
    if (!context.params) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { id } = context.params;

    const { data } = await axios<Recipe>(api(`recipes/${id}`));

    return {
        props: {
            recipe: data,
        },
    };
}

export default function RecipePage(props: RecipePageProps) {
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
