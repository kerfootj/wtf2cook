import { UserMenu } from '@/components/molecules/UserMenu';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Toolbar,
    Typography,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
    const { data } = useSession();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex' }}>
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
                    <Box sx={{ flexGrow: 1 }} />
                    {data ? (
                        <>
                            <Avatar
                                src={data?.user?.image || ''}
                                alt={data?.user?.name || 'user avatar'}
                                imgProps={{ referrerPolicy: 'no-referrer' }}
                                onClick={handleMenuOpen}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer',
                                }}
                            >
                                J
                            </Avatar>
                            <UserMenu
                                anchorEl={anchorEl}
                                handleClose={handleMenuClose}
                            />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            passHref
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <Button variant="contained">Sign in</Button>
                        </Link>
                    )}
                </Toolbar>
            </AppBar>
            <Box sx={{ height: 64 }}></Box>
        </Box>
    );
}
