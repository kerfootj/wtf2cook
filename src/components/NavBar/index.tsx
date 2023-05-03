import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Link
                        href="/"
                        passHref
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            <Image
                                src="/images/logo.svg"
                                alt="logo"
                                width={42}
                                height={42}
                                style={{
                                    border: '1px solid white',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                }}
                            />
                            <Typography
                                variant="h4"
                                style={{ fontFamily: 'Indie Flower' }}
                            >
                                WTF 2 Cook
                            </Typography>
                        </Box>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: 64 }}></Box>
        </Box>
    );
}
