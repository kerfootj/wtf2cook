'use client';
import { SessionProvider } from 'next-auth/react';

type NextAuthProviderProps = {
    children?: React.ReactNode;
};

export const NextAuthProvider = (props: NextAuthProviderProps) => {
    const { children } = props;
    return <SessionProvider>{children}</SessionProvider>;
};
