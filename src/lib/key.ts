/**
 * Generates a key for an item in the instructions or ingredients list.
 */
export function generateListKey(input: string): string {
    return input.substring(0, 32).trim().toLowerCase().replace(/ +/g, '-');
}
