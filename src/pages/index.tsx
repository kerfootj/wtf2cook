import RecipeCard from '@/components/RecipeCard';
import { Box, Grid } from '@mui/material';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
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
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                            <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                                <RecipeCard key={i} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </main>
        </>
    );
}
