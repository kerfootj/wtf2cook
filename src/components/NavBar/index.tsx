import { AppBar, Box, Toolbar } from '@mui/material';

export default function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>WTF 2 Cook</Toolbar>
            </AppBar>
            <Box sx={{ height: 64 }}></Box>
        </Box>
    );
}
