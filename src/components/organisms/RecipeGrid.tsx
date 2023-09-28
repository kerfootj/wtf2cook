'use client';
import { Recipe } from '@/types';
import { Grid } from '@mui/material';
import { RecipeCard } from '../molecules';

interface RecipeGridProps {
    recipes: Recipe[];
}

export function RecipeGrid(props: RecipeGridProps) {
    const { recipes } = props;

    return (
        <>
            {recipes.map((recipe) => (
                <Grid key={recipe.id} item xs={12} sm={6} md={4} xl={3}>
                    <RecipeCard key={recipe.id} recipe={recipe} />
                </Grid>
            ))}
        </>
    );
}
