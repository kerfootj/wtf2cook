'use client';
import { FeaturedRecipe, RecipeGrid } from '@/components/organisms';
import { Recipe } from '@/types';
import { Box } from '@mui/material';

type HomeProps = {
    recipes: Recipe[];
};

export function Home(props: HomeProps) {
    const { recipes } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <FeaturedRecipe />
            <RecipeGrid recipes={recipes} />
        </Box>
    );
}
