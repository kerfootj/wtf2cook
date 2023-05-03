type Environment = typeof process.env.NODE_ENV;

const DOMAINS: Record<Environment, string> = {
    development: 'http://localhost:3000',
    production: 'https://wtf2cook.vercel.app',
    test: 'https://wtf2cook.vercel.app',
};

/**
 * Generate an API URL for the given path based on the current environment.
 */
export function api(path: string) {
    const domain = DOMAINS[process.env.NODE_ENV];

    return `${domain}/api/${path}`;
}
