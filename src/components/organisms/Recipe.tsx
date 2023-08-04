'use client';
import { Recipe } from '@/types';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import {
    Ingredients,
    Instructions,
    RecipeServingsAndTimings,
} from '../molecules';

type RecipeProps = {
    recipe: Recipe;
};

export function Recipe(props: RecipeProps) {
    const { recipe } = props;
    const { name, description, photo_url } = recipe;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 2,
            }}
        >
            <Paper sx={{ p: 3, width: { xs: '100vw', md: 860 } }}>
                <Grid
                    container
                    spacing={2}
                    flexDirection={{ xs: 'column-reverse', md: 'row' }}
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                    <Grid item xs={12} md={9}>
                        <Typography
                            variant="h3"
                            sx={{ fontWeight: 600, mb: 2 }}
                        >
                            {name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {description}
                        </Typography>

                        <RecipeServingsAndTimings recipe={recipe} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        {photo_url && (
                            <Image
                                src={photo_url}
                                alt={name}
                                width={180}
                                height={180}
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                        )}
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        background: (theme) => theme.palette.grey['700'],
                        width: '100%',
                        height: '1px',
                        mt: 2,
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        mt: 3,
                    }}
                >
                    <Ingredients recipe={recipe} />

                    <Instructions recipe={recipe} />
                </Box>
            </Paper>
        </Box>
    );
}
