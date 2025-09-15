import { EXACT_REGEX, REGEX } from "./constant";

/**
 * Checks if a given string contains any variation of the name Chris/Kris.
 *
 * @param input - The string to check
 * @returns true if the input contains any variation of Chris/Kris, false otherwise
 *
 * @example
 * ```typescript
 * isKris('Chris'); // true
 * isKris('Kris'); // true
 * isKris('Christopher'); // true
 * isKris('My name is Chris'); // true
 * isKris('John'); // false
 * isKris(''); // false
 * ```
 */
export function isKris(input: string): boolean {
  if (typeof input !== "string") {
    return false;
  }

  return REGEX.test(input);
}

/**
 * Checks if a given string is exactly a variation of the name Chris/Kris.
 * Unlike isKris(), this requires the entire string to be the name (case-insensitive).
 *
 * @param input - The string to check
 * @returns true if the input is exactly a variation of Chris/Kris, false otherwise
 *
 * @example
 * ```typescript
 * isExactlyKris('Chris'); // true
 * isExactlyKris('christopher'); // true
 * isExactlyKris('My name is Chris'); // false
 * isExactlyKris('John'); // false
 * ```
 */
export function isExactlyKris(input: string): boolean {
  if (typeof input !== "string") {
    return false;
  }

  return EXACT_REGEX.test(input);
}

/**
 * Finds all variations of Chris/Kris in a given string.
 *
 * @param input - The string to search in
 * @returns An array of all found matches
 *
 * @example
 * ```typescript
 * findKris('Chris and Kris are friends'); // ['Chris', 'Kris']
 * findKris('Christopher knows Kristopher'); // ['Christopher', 'Kristopher']
 * findKris('No matches here'); // []
 * ```
 */
export function findKris(input: string): string[] {
  if (typeof input !== "string") {
    return [];
  }

  const globalRegex = new RegExp(REGEX.source, "gi");
  return input.match(globalRegex) || [];
}

/**
 * Counts how many variations of Chris/Kris appear in a given string.
 *
 * @param input - The string to count in
 * @returns The number of matches found
 *
 * @example
 * ```typescript
 * countKris('Chris and Kris are friends'); // 2
 * countKris('Christopher'); // 1
 * countKris('No matches here'); // 0
 * ```
 */
export function countKris(input: string): number {
  return findKris(input).length;
}
