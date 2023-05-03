import Page from '@/components/Page';
import RecipeCard from '@/components/RecipeCard';
import { api } from '@/lib/api';
import { Recipe } from '@/types';
import { Grid } from '@mui/material';
import axios from 'axios';

type HomeProps = {
    recipes: Recipe[];
};

export async function getServerSideProps() {
    const { data } = await axios<Recipe[]>(api('recipes'));

    return { props: { recipes: data } };
}

export default function Home(props: HomeProps) {
    const { recipes } = props;

    return (
        <Page>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ my: 1, mx: 0 }}
            >
                <Grid container item xs={11} lg={10} xl={8} spacing={1}>
                    {recipes.map((recipe) => (
                        <Grid key={recipe.id} item xs={12} sm={6} md={4} xl={3}>
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Page>
    );
}
