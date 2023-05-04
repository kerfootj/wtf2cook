import {
    FacebookButton,
    GoogleButton,
    RedditButton,
} from '@/components/AuthButtons.tsx';
import { Logo } from '@/components/Logo';
import Page from '@/components/Page';
import { Box, Typography, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
    const { data } = useSession();
    const { push } = useRouter();
    const theme = useTheme();

    // redirect to home if already logged in
    if (data) {
        push('/');
    }

    return (
        <Page navbar={{ hidden: true }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: { xs: '10%', md: '20%' },
                }}
            >
                <Link href="/" passHref>
                    <Box sx={{ my: 4 }}>
                        <Logo size={48} fill={theme.palette.grey['50']} />
                    </Box>
                </Link>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Sign in to WTF 2 Cook
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 320,
                        mt: 2,
                        gap: 2,
                    }}
                >
                    <GoogleButton />
                    <FacebookButton />
                    <RedditButton />
                </Box>
            </Box>
        </Page>
    );
}
