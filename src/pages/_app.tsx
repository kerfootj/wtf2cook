import { SearchContextProvider } from '@/components/context';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1585FD',
        },
        secondary: {
            main: '#FFC107',
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

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ThemeProvider theme={theme}>
                <SearchContextProvider>
                    <CssBaseline />
                    <Component {...pageProps} />
                </SearchContextProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
