'use client';
import { Content } from '@/components/atoms';
import { AddRecipe } from '@/components/molecules';
import { FeaturedRecipe, RecipeGrid } from '@/components/organisms';
import { Recipe } from '@/types';
import { Grid } from '@mui/material';

type HomeProps = {
    recipes: Recipe[];
};

export function Home(props: HomeProps) {
    const { recipes } = props;

    return (
        <Content>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                gap={2}
                sx={{ my: 2 }}
            >
                <Grid container item xs={12} lg={10} xl={8}>
                    <FeaturedRecipe />
                </Grid>

                <Grid container item xs={12} lg={10} xl={8}>
                    <AddRecipe />
                </Grid>

                <Grid container item xs={12} lg={10} xl={8} spacing={1}>
                    <RecipeGrid recipes={recipes} />
                </Grid>
            </Grid>
        </Content>
    );
}
