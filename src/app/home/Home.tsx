'use client';
import { getMoreRecipes } from '@/app/actions/getMoreRecipes';
import { FeaturedRecipe, RecipeGrid } from '@/components/organisms';
import { Recipe } from '@/types';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type HomeProps = {
    initialRecipes: Recipe[];
    hasMore: boolean;
    search?: string;
};

export function Home(props: HomeProps) {
    const { initialRecipes, hasMore: initialHasMore, search } = props;
    const [recipes, setRecipes] = useState(initialRecipes);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [loading, setLoading] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        const loadMore = async () => {
            if (inView && hasMore && !loading) {
                setLoading(true);
                const nextPage = page + 1;
                const newRecipes = await getMoreRecipes(nextPage, search);

                if (newRecipes.length > 0) {
                    setRecipes((prev) => [...prev, ...newRecipes]);
                    setPage(nextPage);
                } else {
                    setHasMore(false);
                }
                setLoading(false);
            }
        };

        loadMore();
    }, [inView, hasMore, loading, page, search]);

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
            <RecipeGrid recipes={recipes} loadingRef={ref} loading={loading} />
        </Box>
    );
}
