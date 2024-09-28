'use client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ReactNode } from 'react';

type MUIThemeProviderProps = {
    children?: ReactNode;
};

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00bcd4',
        },
        secondary: {
            main: '#ffea00',
        },
    },
    typography: {
        fontFamily: ['Inter', 'Arial', 'sans-serif'].join(),
        body1: {
            fontFamily: ['Bitter', 'serif'].join(),
            fontSize: '1.1rem',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    '*::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '*::-webkit-scrollbar-track': {
                        background: '#121212',
                    },
                    '*::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        background: '#404040',
                        minHeight: 24,
                        filter: 'drop-shadow(0 -6mm 4mm rgb(160, 0, 210))',
                    },
                },
            },
        },
    },
});

export const MUIThemeProvider = (props: MUIThemeProviderProps) => {
    const { children } = props;
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};
