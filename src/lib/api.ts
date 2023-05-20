type Environment = typeof process.env.NODE_ENV;

const DOMAINS: Record<Environment, string> = {
    development: 'http://localhost:3000',
    production: 'https://www.wtf2cook.ca',
    test: 'https://www.wtf2cook.ca',
};

/**
 * Generate an API URL for the given path based on the current environment.
 * - conditionally append search parameters
 */
export function api(path: string, params?: Record<string, string>): string {
    const domain = DOMAINS[process.env.NODE_ENV];

    const url = new URL(`${domain}/api/${path}`);

    Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    return url.toString();
}
