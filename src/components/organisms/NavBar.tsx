'use client';
import { SearchBar, UserMenu } from '@/components/molecules';
import { Menu } from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { SignInMenu } from '../molecules/SignInMenu';

export function NavBar() {
    return (
        <Box sx={{ flex: '1' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <NavBarContent />
                </Toolbar>
            </AppBar>
            <Box sx={{ height: 64 }}></Box>
        </Box>
    );
}

function NavBarContent() {
    const theme = useTheme();
    const is_mobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                }}
            >
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
                        {!is_mobile && (
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: 'Indie Flower',
                                }}
                            >
                                WTF 2 Cook
                            </Typography>
                        )}
                    </Box>
                </Link>
            </Box>

            <Box
                sx={{
                    flex: { sm: 4, md: 1 },
                    display: 'flex',
                    justifyContent: 'center',
                    mx: 2,
                }}
            >
                <SearchBar />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flex: 1,
                }}
            >
                <AvatarWithUserMenu />
                <SignIn />
            </Box>
        </>
    );
}

/**
 * Renders the user avatar and the user menu when the avatar is clicked.
 * If the user is not logged in, this component returns null.
 */
function AvatarWithUserMenu(): ReactElement | null {
    const { data } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    if (!data) {
        return null;
    }

    return (
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
            />
            <UserMenu anchorEl={anchorEl} handleClose={handleMenuClose} />
        </>
    );
}

/**
 * Renders a sign in button if the user is not logged in.
 */
function SignIn(): ReactElement | null {
    const { data } = useSession();

    const theme = useTheme();
    const is_mobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (data) {
        return null;
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    if (is_mobile) {
        return (
            <>
                <IconButton onClick={handleMenuOpen}>
                    <Menu />
                </IconButton>
                <SignInMenu anchorEl={anchorEl} handleClose={handleMenuClose} />
            </>
        );
    }

    return (
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
    );
}
