'use client';
import { Recipe } from '@/types';
import { CircularProgress, Grid } from '@mui/material';
import { RecipeCard } from '../molecules';

interface RecipeGridProps {
    recipes: Recipe[];
    loadingRef?: (node?: Element | null) => void;
    loading?: boolean;
}

export function RecipeGrid(props: RecipeGridProps) {
    const { recipes, loadingRef, loading } = props;

    return (
        <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{
                height: {
                    xs: 'calc(100vh - 64px)',
                    md: 'unset',
                },
                paddingLeft: {
                    xs: 1,
                    md: 0,
                },
                padding: {
                    md: 2,
                },
                overflowY: {
                    xs: 'scroll',
                    md: 'auto',
                },
                scrollSnapType: {
                    xs: 'y mandatory',
                    md: 'none',
                },
                maxWidth: {
                    md: 850,
                    lg: 1270,
                    xl: 1700,
                },
            }}
        >
            {recipes.map((recipe) => (
                <Grid
                    key={recipe.id}
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    xl={3}
                    sx={{ scrollSnapAlign: 'start' }}
                >
                    <RecipeCard key={recipe.id} recipe={recipe} />
                </Grid>
            ))}

            {loadingRef && (
                <Grid
                    item
                    xs={12}
                    ref={loadingRef}
                    sx={{ textAlign: 'center', py: 2 }}
                >
                    {loading && <CircularProgress />}
                </Grid>
            )}
        </Grid>
    );
}
