import { Format, Seasons } from '../types/types.js';

/**
 * Converts any season string to a valid Seasons value for jikan
 */
export function normalizeLowerCaseSeason(input: string): string {
  const upperInput = input.toUpperCase(); // Convert to lowercase

  if (!(upperInput in Seasons)) {
    throw new Error(`Invalid season: "${input}". Expected one of: ${Object.keys(Seasons).join(', ')}`);
  }

  return upperInput.toLowerCase(); // Convert to lowercase before returning
}

/**
 * Converts any format string to a valid format value for jikan
 */
export function normalizeLowerCaseFormat(input: string): string {
  const upperInput = input.toUpperCase(); // Convert to lowercase

  if (!(upperInput in Format)) {
    throw new Error(`Invalid season: "${input}". Expected one of: ${Object.keys(Seasons).join(', ')}`);
  }

  return upperInput.toLowerCase(); // Convert to lowercase before returning
}
