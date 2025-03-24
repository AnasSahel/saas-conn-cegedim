/**
 * Generates a random salt string of specified length.
 *
 * @param length The length of the salt to generate. Defaults to 4.
 * @returns A random salt string.
 */

export function generateSalt(length: number = 4): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let salt = '';
    for (let i = 0; i < length; i++) {
        salt += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return salt;
}

/**
 * Generates a UTC timestamp string in the format 'yyyyMMddHHmmss'.
 *
 * @returns A UTC timestamp string.
 */
export function generateUtcNow(): string {
    const now = new Date();

    const year = now.getUTCFullYear().toString().padStart(4, '0');
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = now.getUTCDate().toString().padStart(2, '0');
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
