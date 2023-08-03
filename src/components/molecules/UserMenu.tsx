'use client';
import { Menu, MenuItem } from '@mui/material';
import { signOut } from 'next-auth/react';

type UserMenuProps = {
    anchorEl: HTMLElement | null;
    handleClose: () => void;
};

export function UserMenu(props: UserMenuProps) {
    const { anchorEl, handleClose } = props;

    return (
        <Menu
            id="user-menu"
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
            <MenuItem
                onClick={() => {
                    signOut();
                    handleClose();
                }}
            >
                Logout
            </MenuItem>
        </Menu>
    );
}
