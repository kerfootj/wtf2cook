import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/types';
import { Box, Grid } from '@mui/material';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

interface HomeProps {
    recipes: Recipe[];
}

export default function Home(props: HomeProps) {
    const { recipes } = props;

    return (
        <>
            <Head>
                <title>WTF 2 Cook</title>
                <meta
                    property="og:description"
                    content="Visit wtf2cook.ca for the best no bs recipes"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ my: 1, mx: 0 }}
                >
                    <Grid container item xs={11} lg={10} xl={8} spacing={1}>
                        {recipes.map((recipe) => (
                            <Grid
                                key={recipe.id}
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                            >
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </main>
        </>
    );
}

export async function getServerSideProps() {
    const response = await fetch('http://localhost:3000/api/recipes');

    const result = await response.json();

    return { props: { recipes: result } };
}
