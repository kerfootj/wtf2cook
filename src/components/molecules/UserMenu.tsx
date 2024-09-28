'use client';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

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
            <MenuItem>
                <ListItemIcon>
                    <AddCircleOutlineOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <Link
                    href="/recipes/new"
                    passHref
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    <ListItemText>Add recipe</ListItemText>
                </Link>
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={() => {
                    signOut();
                    handleClose();
                }}
            >
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Menu>
    );
}
