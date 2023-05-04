type LogoProps = {
    fill?: string;
    size?: number;
};

export function Logo(props: LogoProps) {
    const { size } = props;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 42}
            height={size || 42}
            viewBox="0 0 512 512"
            {...props}
        >
            <path d="M237.9.4c-.2.2-3.5.6-7.4.9-50.6 4.4-106 28.8-144.6 63.7-35.8 32.4-61.1 71.8-74.7 116.5C7 195 5.4 202.4 2.3 222c-1.8 11.3-2.4 45.3-1.1 59 2 20.7 8.5 47.6 16.3 67.6 12 30.7 29.1 57.8 52 82.3 8.8 9.3 16.8 16.8 28 26 27.8 22.7 69.6 42.2 106 49.6 22.4 4.5 56.7 6.5 75.5 4.4 10.4-1.2 16.9-2 19.4-2.5 1.2-.2 3.7-.7 5.6-1 35.4-6.3 74.6-23.7 105.1-46.6 41.8-31.4 72.1-73.1 89.2-122.8 4.7-13.7 8.6-29.1 10.3-41 .2-1.9.6-4.4.9-5.5 1.9-9.5 2.7-45.8 1.3-60.5-2.1-20.5-7.1-43-13.6-60.5-5.2-14.1-7.2-18.7-13.2-30.5-21.2-41.4-52.9-76-93-101.4C366.4 23.1 330.2 9 303.5 4.5c-1.6-.3-3.9-.7-5.1-.9-1.2-.2-4.5-.7-7.4-1.1-2.9-.4-6.2-.9-7.4-1.2-2.4-.5-45.2-1.4-45.7-.9zm44.1 20c1.4.2 4.7.7 7.3 1.1 2.6.3 7.1 1 10 1.6 2.9.6 6.3 1.3 7.7 1.5 7.3 1.4 25.9 6.9 31.5 9.3 1.1.5 6.1 2.6 11 4.6 42.2 17.5 82.5 52.1 107.3 92 20 32.4 30.8 64.3 35.1 104 .9 8 .7 42.8-.3 47.5-.3 1.4-1 5.9-1.5 10-.6 4.1-1.3 8.4-1.5 9.5-14.1 67.9-54.3 124.2-113.6 159.2-17.4 10.2-43.9 21.2-60.5 24.9-9.4 2.1-28.9 5.6-35.5 6.2-8.4.9-43.6.8-47.5-.1-1.1-.2-4.7-.8-8-1.2-6.2-.7-6.5-.8-15.5-2.6-43.8-8.6-87.5-32.4-119.7-65.1-28.8-29.1-47-59.8-59.4-99.8-1.7-5.2-3.2-11.1-3.5-13-.3-1.9-.8-3.8-1-4.1-.1-.3-.8-3.4-1.4-7-.5-3.5-1.2-7.5-1.5-8.9-1.2-6.9-1.6-12-1.9-29.5-.4-19.8.7-34.8 3.4-47 .5-2.2 1.2-5.6 1.5-7.5 1-5.8 5.3-21 8.4-29.5C57.5 108.4 111.5 55.2 180 31.7c10.2-3.5 26.7-7.8 36-9.2 2.5-.4 5.4-.9 6.5-1.1 1.1-.2 5.4-.7 9.5-1 4.1-.4 7.7-.8 7.9-1 .5-.5 39.2.4 42.1 1z" />
            <path d="M241.9 40.4c-.2.2-3.5.6-7.4 1-37.9 3.3-76.5 18.4-108.1 42.2-10.1 7.6-14.4 11.5-23.9 21-10.6 10.8-12.8 13.4-21.4 25.3C58 162 45 196.4 41.1 236c-.9 8.3-.7 39.4.2 42.5.3 1.1.8 4.6 1.2 7.9 1.6 15.1 7.7 37 15.1 54.4 20.3 47.4 57.9 86.8 104.2 109.1l8.2 4 .1-4.2c0-2.3.2-5.3.4-6.7.3-2.6 1.6-29.1 2-41.8.3-9.1-1-16.2-4-22.8-2.6-5.8-5-8.4-15.4-16.4-5.2-4.1-7.8-6.9-9.7-10.7l-2.6-5.3.2-43.7c.2-52.6.4-60 2.5-76.3.1-.8.5-4 .9-7.1.8-6.5.6-5.6 4-21.9 5.8-27.4 16.7-61.2 26.6-82.6 1.6-3.6 3-6.7 3-6.9 0-.2 1.5-3 3.4-6.3 3.6-6 10.3-13.6 14.6-16.3 2.7-1.8 6.3-1.1 7.2 1.3.3.8.7 26.8.8 57.8.6 184.1.9 245.5 1.4 257.8.4 7.5.9 18.6 1.1 24.7.3 6 .8 17.3 1 25 .3 7.6.9 14.2 1.3 14.6.6.7 3 1.2 11.7 2.5 1.7.3 3.6.7 4.3.9 6.6 2.3 55.6 2.5 57.7.3.2-.2.6-6.4.9-13.8.3-7.4.8-17.3 1.1-22 .3-4.7.7-12.8 1-18 .9-18.4 1.6-31.6 2-38 .5-8.1 1.8-36 1.9-41.9l.1-4.4-6.5-2.1c-9.8-3.2-17.6-8.2-26.7-17.2-10.8-10.8-11.6-13.3-11.7-37.4-.1-15.3.7-34.6 1.9-49 .2-2.5.7-7.7 1-11.5.3-3.9.7-8.4.9-10 .3-1.7.7-6.6 1.1-11 .4-4.4.9-8.7 1-9.5.1-.8.6-4.9 1-9s.9-8.2 1-9c.2-.8.6-4.9 1-9s.8-8.2 1-9c.2-.8.6-4.4 1-8 1-10.1.7-9.7 8-9.7 6.3 0 6.5 0 6.5 2.6 0 1.4.2 34.1.3 72.6l.2 70h5.5c3 .1 6-.1 6.5-.2.7-.2 1-24.7.9-71.6 0-39.1.2-71.7.4-72.4.2-.7 2.9-1.2 7.3-1.2h6.9l.2 72.7.3 72.7h6.3c6 .1 6.2 0 6.3-2.4.1-1.4.2-34.1.3-72.6l.1-70h15l.1 71c.1 39 .2 71.7.3 72.6.1 1.2 1.4 1.5 6.4 1.4h6.2l.2-69c.1-38 .2-70.6.2-72.6l.1-3.7 5 .1c5.5 0 5.2-.5 6.6 11.2.4 3.3.8 7.1 1 8.5.1 1.4.6 5.2.9 8.5.3 3.3.8 7.1 1 8.5.2 1.4.7 5.9 1.1 10 .3 4.1.8 8.2.9 9.1.2.9.6 5.4 1 10s.8 8.6 1 8.9c.1.3.6 4.8 1 10 .3 5.2.8 11.1 1 13 1.7 16.8 2.4 53.9 1.2 64-.9 7.8-2.7 11.6-9.1 18.6-7.8 8.7-17.3 14.9-28.6 19l-6.5 2.3.1 7.8c.1 6.9.8 22.9 1.9 42.3.2 3.6.6 11.7 1 18 .3 6.3.8 15.1 1 19.5.2 4.4.7 13.6 1.1 20.5.7 12.8 1.1 20.4 1.3 20.7.2.3 20-7.6 25.6-10.3 38.3-18.2 72.3-50 94.2-87.9 12.2-20.9 23.6-54.5 25.8-75.6.3-3 .8-6.5 1.1-7.9 1.7-7.5 1-43.4-1.1-55.5-4-23.5-9.5-41.1-19.5-62-14.1-29.3-38.6-59-64-77.5-4.1-3-7.7-5.7-8-6.1-1.3-1.5-22.4-13.6-30-17.2-14.1-6.5-36.9-14.2-48-16.1-1.9-.3-4.6-.8-6-1.1-1.4-.3-4.5-.8-7-1.1-2.5-.3-5.3-.8-6.3-1-2-.6-38.3-1.5-38.8-1z" />
        </svg>
    );
}
