import { EXACT_REGEX, REGEX } from "./constant";

/**
 * Checks if a given string contains any variation of the name Chris/Kris.
 *
 * @param input - The string to check
 * @returns "is" if the input contains any variation of Chris/Kris, "isn't" otherwise
 *
 * @example
 * ```typescript
 * isKris('Chris'); // "is"
 * isKris('Kris'); // "is"
 * isKris('Christopher'); // "is"
 * isKris('My name is Chris'); // "is"
 * isKris('John'); // "isn't"
 * isKris(''); // "isn't"
 * ```
 */
export function isKris(input: string): "is" | "isn't" {
  if (typeof input !== "string") {
    return "isn't";
  }

  return REGEX.test(input) ? "is" : "isn't";
}

/**
 * Checks if a given string is exactly a variation of the name Chris/Kris.
 * Unlike isKris(), this requires the entire string to be the name (case-insensitive).
 *
 * @param input - The string to check
 * @returns "is" if the input is exactly a variation of Chris/Kris, "isn't" otherwise
 *
 * @example
 * ```typescript
 * isExactlyKris('Chris'); // "is"
 * isExactlyKris('christopher'); // "is"
 * isExactlyKris('My name is Chris'); // "isn't"
 * isExactlyKris('John'); // "isn't"
 * ```
 */
export function isExactlyKris(input: string): "is" | "isn't" {
  if (typeof input !== "string") {
    return "isn't";
  }

  return EXACT_REGEX.test(input) ? "is" : "isn't";
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
