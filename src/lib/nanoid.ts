import { customAlphabet } from 'nanoid';

/**
 * Generate a random string
 * @param {number} size The length of the string to generate - defaults to 12
 * @returns {string} A random string of 12 characters
 */
export const nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyz0123456789',
    12,
);
