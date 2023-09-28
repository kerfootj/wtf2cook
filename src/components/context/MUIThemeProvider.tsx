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
                        background: '#272727',
                    },
                    '*::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        background: '#696969',
                        minHeight: 24,
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
