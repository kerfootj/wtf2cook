import NavBar from '@/components/NavBar';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: ['Inter', 'Arial', 'sans-serif'].join(),
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
        <ThemeProvider theme={theme}>
            <style jsx global>{`
                html {
                    font-family: ${inter.style.fontFamily};
                }
            `}</style>
            <CssBaseline />
            <NavBar />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
