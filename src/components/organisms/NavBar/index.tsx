import { SearchBar } from '@/components/molecules/SearchBar';
import { UserMenu } from '@/components/molecules/UserMenu';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function NavBar() {
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
    const { data } = useSession();
    const theme = useTheme();
    const is_mobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
                        {is_mobile ? (
                            <SearchBar />
                        ) : (
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
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    justifyContent: 'center',
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
            </Box>
        </>
    );
}
