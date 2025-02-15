'use client';
import { Menu, MenuItem, useTheme } from '@mui/material';
import Link from 'next/link';

type SignInMenuProps = {
    anchorEl: HTMLElement | null;
    handleClose: () => void;
};

export function SignInMenu(props: SignInMenuProps) {
    const { anchorEl, handleClose } = props;
    const theme = useTheme();

    return (
        <Menu
            id="sign-in-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 1 }}
        >
            <MenuItem onClick={handleClose}>
                <Link
                    href="/login"
                    passHref
                    style={{
                        textDecoration: 'none',
                        color: theme.palette.common.white,
                    }}
                >
                    Sign In
                </Link>
            </MenuItem>
        </Menu>
    );
}
