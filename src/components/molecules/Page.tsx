import { NavBar } from '@/components/organisms';
import Head from 'next/head';
import { PropsWithChildren } from 'react';

export type PageProps = PropsWithChildren<{
    title?: string;
    description?: string;
    image?: string;
    navbar?: {
        hidden?: boolean;
    };
}>;

const DEFAULT_TITLE = 'WTF 2 Cook';
const DEFAULT_DESCRIPTION = 'Visit wtf2cook.ca for the best no bs recipes.';
const DEFAULT_IMAGE = '/images/burger.jpg';

/**
 * Page component
 * - sets the page metadata
 * - wraps the children in a main tag
 */
export function Page(props: PageProps) {
    const { title, description, image, navbar, children } = props;

    return (
        <>
            <Head>
                {/* title */}
                <title>{title || DEFAULT_TITLE}</title>
                <meta property="og:title" content={title || DEFAULT_TITLE} />

                {/* description */}
                <meta
                    property="description"
                    content={description || DEFAULT_DESCRIPTION}
                />
                <meta
                    property="og:description"
                    content={description || DEFAULT_DESCRIPTION}
                />

                {/* image */}
                <meta property="og:image" content={image || DEFAULT_IMAGE} />

                {/* misc */}
                <link rel="icon" href="/favicon.ico" />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                <meta property="og:type" content="website" />
            </Head>
            {navbar?.hidden ? null : <NavBar />}
            <main style={{ height: '100%' }}>{children}</main>
        </>
    );
}
