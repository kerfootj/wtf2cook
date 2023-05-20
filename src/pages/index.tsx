import { useSearch } from '@/components/context/SearchContext';
import Page from '@/components/molecules/Page';
import RecipeCard from '@/components/organisms/RecipeCard';
import { api } from '@/lib/api';
import { Recipe } from '@/types';
import { Grid } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const { search } = useSearch();

    useEffect(() => {
        axios
            .get<Recipe[]>(api('recipes', { search }))
            .then((res) => {
                setRecipes(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [search]);

    if (loading) {
        return <Page>Loading...</Page>;
    }

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
