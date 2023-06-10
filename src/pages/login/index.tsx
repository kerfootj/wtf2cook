import { GoogleButton, Logo, RedditButton } from '@/components/atoms';
import { Page } from '@/components/molecules';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import background from '../../../public/images/background.png';

export default function Login() {
    const { data } = useSession();
    const { push } = useRouter();
    const theme = useTheme();

    // redirect to home if already logged in
    if (data) {
        push('/');
    }

    return (
        <Page
            navbar={{ hidden: true }}
            style={{
                backgroundImage: `url(${background.src})`,
                backgroundRepeat: 'repeat',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Paper
                    sx={{
                        width: 'fit-content',
                        height: 'fit-content',
                        px: 2,
                        py: 4,
                        mb: 8,
                        background: theme.palette.grey['900'],
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Link href="/" passHref>
                            <Box sx={{ my: 4 }}>
                                <Logo
                                    size={69}
                                    fill={theme.palette.grey['50']}
                                />
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
                            <RedditButton />
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Page>
    );
}
