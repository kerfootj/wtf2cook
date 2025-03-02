'use client';
import { getMoreRecipes } from '@/app/actions/getMoreRecipes';
import { FeaturedRecipe, RecipeGrid } from '@/components/organisms';
import { Recipe } from '@/types';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type HomeProps = {
    search?: string;
};

export function Home(props: HomeProps) {
    const { search } = props;
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    // Load initial recipes
    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            const { recipes: initialRecipes, hasMore: initialHasMore } =
                await getMoreRecipes(1, search);
            setRecipes(initialRecipes);
            setHasMore(initialHasMore);
            setPage(1);
            setLoading(false);
        };

        loadInitial();
    }, [search]);

    // Load more recipes when scrolling
    useEffect(() => {
        const loadMore = async () => {
            if (inView && hasMore && !loading) {
                setLoading(true);
                const nextPage = page + 1;
                const { recipes: newRecipes, hasMore: moreAvailable } =
                    await getMoreRecipes(nextPage, search);

                if (newRecipes.length > 0) {
                    setRecipes((prev) => [...prev, ...newRecipes]);
                    setPage(nextPage);
                    setHasMore(moreAvailable);
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
