'use client';
import { getRandomRecipe } from '@/app/actions/getRandomRecipe';
import { getURLFromRecipe } from '@/lib/getURLFromRecipe';
import { Recipe } from '@/types';
import {
    Box,
    Button,
    Paper,
    Skeleton,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingBurger } from '../atoms';
import {
    Ingredients,
    Instructions,
    RecipeServingsAndTimings,
} from '../molecules';
import { Recipe as RecipeDetails } from './Recipe';

type FeaturedRecipeProps = {
    recipe: Recipe | null;
    loading: boolean;
    onNext: () => void;
};

const FEATURED_RECIPE_BREAKPOINT = 1090;

export function FeaturedRecipe() {
    const theme = useTheme();
    const params = useSearchParams();

    const search = params.get('search');

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [next, setNext] = useState(false);

    useEffect(() => {
        if (next || !recipe) {
            setLoading(true);

            getRandomRecipe().then((result) => {
                setRecipe(result);
                setNext(false);
                setLoading(false);
            });
        }
    }, [next, recipe]);

    const is_small = useMediaQuery(
        theme.breakpoints.down(FEATURED_RECIPE_BREAKPOINT),
    );

    if (search) {
        return null;
    }

    return (
        <Paper sx={{ width: '100%' }}>
            {is_small ? (
                <FeaturedRecipeMobile
                    recipe={recipe}
                    loading={loading}
                    onNext={() => setNext(true)}
                />
            ) : (
                <FeaturedRecipeDesktop
                    recipe={recipe}
                    loading={loading}
                    onNext={() => setNext(true)}
                />
            )}
        </Paper>
    );
}

function FeaturedRecipeDesktop(props: FeaturedRecipeProps) {
    const { recipe, loading } = props;

    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
            }}
        >
            {recipe && !loading ? (
                <Image
                    src={recipe.photo_url as string}
                    alt={recipe.name}
                    width={500}
                    height={500}
                    style={{
                        borderRadius: '4px',
                        marginRight: '4px',
                        objectFit: 'cover',
                    }}
                />
            ) : (
                <Box
                    sx={{
                        width: 500,
                        height: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <LoadingBurger />
                </Box>
            )}

            <Box
                sx={{
                    m: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 472,
                }}
            >
                <WhatTheFuckToCook />

                <Box
                    sx={{
                        borderBottom: `1px solid ${theme.palette.grey['600']}`,
                        width: '100%',
                        mb: 2,
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        overflowY: 'scroll',
                        maxHeight: '350px',
                    }}
                >
                    {recipe && !loading ? (
                        <>
                            <Typography variant="h4">{recipe.name}</Typography>

                            <RecipeServingsAndTimings recipe={recipe} />

                            <Ingredients recipe={recipe} />

                            <Instructions recipe={recipe} />
                        </>
                    ) : (
                        <>
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                width="90%"
                                height={42}
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {Array(3)
                                    .fill(0)
                                    .map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            animation="wave"
                                            width="20%"
                                        />
                                    ))}
                            </Box>

                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                width="70%"
                                height={42}
                            />

                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        animation="wave"
                                        width={`${Math.floor(
                                            Math.random() * (80 - 40) + 40,
                                        )}%`}
                                    />
                                ))}
                        </>
                    )}
                </Box>

                <FuckItButtons {...props} />
            </Box>
        </Box>
    );
}

function FeaturedRecipeMobile(props: FeaturedRecipeProps) {
    const { recipe, loading } = props;

    const theme = useTheme();

    return (
        <Box>
            <Box sx={{ p: 2 }}>
                <WhatTheFuckToCook />
            </Box>

            <Box
                sx={{
                    borderBottom: `1px solid ${theme.palette.grey['600']}`,
                    width: '100%',
                    mb: 2,
                }}
            />

            <Box sx={{ maxHeight: 400, overflowY: 'scroll' }}>
                {recipe && !loading ? (
                    <RecipeDetails recipe={recipe} />
                ) : (
                    <LoadingBurger />
                )}
            </Box>

            <Box sx={{ m: 2 }}>
                <FuckItButtons {...props} />
            </Box>
        </Box>
    );
}

function WhatTheFuckToCook() {
    return (
        <Typography variant="h3" sx={{ fontFamily: 'Indie Flower', m: 1 }}>
            What the F*ck to Cook?
        </Typography>
    );
}

function FuckItButtons(props: FeaturedRecipeProps) {
    const { recipe, loading, onNext } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 1,
                mr: 2,
            }}
        >
            {recipe && !loading ? (
                <>
                    <Link
                        href={getURLFromRecipe(recipe)}
                        passHref
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                width: 140,
                                textTransform: 'none',
                                fontFamily: 'Indie Flower',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                lineHeight: '1.4rem',
                            }}
                        >
                            F*ck Yeah!
                        </Button>
                    </Link>
                    <Button
                        onClick={onNext}
                        color="secondary"
                        variant="contained"
                        sx={{
                            width: 140,
                            textTransform: 'none',
                            fontFamily: 'Indie Flower',
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            lineHeight: '1.4rem',
                        }}
                    >
                        F*ck No!
                    </Button>
                </>
            ) : null}
        </Box>
    );
}
