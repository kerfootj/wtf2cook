import { MUIThemeProvider } from '@/components/context/MUIThemeProvider';
import { NextAuthProvider } from '@/components/context/NextAuthProvider';
import { NavBar } from '@/components/organisms';
import { ReactNode } from 'react';

export default function RootLayout(props: { children: ReactNode }) {
    const { children } = props;
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;600&family=Indie+Flower&family=Inter:wght@400;600&display=swap"
                    rel="stylesheet"
                />

                <link rel="icon" href="/favicon.ico" />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </head>
            <body>
                <NextAuthProvider>
                    <MUIThemeProvider>
                        <NavBar />
                        {children}
                    </MUIThemeProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
