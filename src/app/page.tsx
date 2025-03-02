import { Home } from './home/Home';

export const metadata = {
    metadataBase: new URL('https://www.wtf2cook.ca'),
    title: 'WTF 2 Cook',
    description: 'Visit wtf2cook.ca for the best no bs recipes.',
    openGraph: {
        title: 'WTF 2 Cook',
        description: 'Visit wtf2cook.ca for the best no bs recipes.',
        type: 'website',
        siteName: 'wtf2cook.ca',
        images: '/images/burger.jpg',
    },
};

export default function HomePage(props: {
    searchParams: { [key: string]: string };
}) {
    const { search } = props.searchParams;

    return <Home search={search} />;
}
