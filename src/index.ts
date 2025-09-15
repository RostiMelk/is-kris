import { EXACT_REGEX, REGEX } from "./constant.js";
import { isKrisAI, isExactlyKrisAI, findKrisAI, countKrisAI } from "./ai-detector.js";

/**
 * Checks if a given string contains any variation of the name Chris/Kris using AI detection.
 * This is now the primary method using LLM instead of regex.
 *
 * @param input - The string to check
 * @returns Promise that resolves to true if the input contains any variation of Chris/Kris, false otherwise
 *
 * @example
 * ```typescript
 * await isKris('Chris'); // true
 * await isKris('Kris'); // true
 * await isKris('Christopher'); // true
 * await isKris('My name is Chris'); // true
 * await isKris('John'); // false
 * await isKris(''); // false
 * ```
 */
export async function isKris(input: string): Promise<boolean> {
  if (typeof input !== "string") {
    return false;
  }

  const result = await isKrisAI(input);
  return result.result;
}

/**
 * Legacy regex-based version of isKris for backward compatibility.
 * @deprecated Use isKris() instead, which now uses AI detection as the primary method.
 */
export function isKrisRegex(input: string): boolean {
  if (typeof input !== "string") {
    return false;
  }

  return REGEX.test(input);
}

/**
 * Checks if a given string is exactly a variation of the name Chris/Kris using AI detection.
 * Unlike isKris(), this requires the entire string to be the name (case-insensitive).
 *
 * @param input - The string to check
 * @returns Promise that resolves to true if the input is exactly a variation of Chris/Kris, false otherwise
 *
 * @example
 * ```typescript
 * await isExactlyKris('Chris'); // true
 * await isExactlyKris('christopher'); // true
 * await isExactlyKris('My name is Chris'); // false
 * await isExactlyKris('John'); // false
 * ```
 */
export async function isExactlyKris(input: string): Promise<boolean> {
  if (typeof input !== "string") {
    return false;
  }

  const result = await isExactlyKrisAI(input);
  return result.result;
}

/**
 * Legacy regex-based version of isExactlyKris for backward compatibility.
 * @deprecated Use isExactlyKris() instead, which now uses AI detection as the primary method.
 */
export function isExactlyKrisRegex(input: string): boolean {
  if (typeof input !== "string") {
    return false;
  }

  return EXACT_REGEX.test(input);
}

/**
 * Finds all variations of Chris/Kris in a given string using AI detection.
 *
 * @param input - The string to search in
 * @returns Promise that resolves to an array of all found matches
 *
 * @example
 * ```typescript
 * await findKris('Chris and Kris are friends'); // ['Chris', 'Kris']
 * await findKris('Christopher knows Kristopher'); // ['Christopher', 'Kristopher']
 * await findKris('No matches here'); // []
 * ```
 */
export async function findKris(input: string): Promise<string[]> {
  if (typeof input !== "string") {
    return [];
  }

  const result = await findKrisAI(input);
  return result.result;
}

/**
 * Legacy regex-based version of findKris for backward compatibility.
 * @deprecated Use findKris() instead, which now uses AI detection as the primary method.
 */
export function findKrisRegex(input: string): string[] {
  if (typeof input !== "string") {
    return [];
  }

  const globalRegex = new RegExp(REGEX.source, "gi");
  return input.match(globalRegex) || [];
}

/**
 * Counts how many variations of Chris/Kris appear in a given string using AI detection.
 *
 * @param input - The string to count in
 * @returns Promise that resolves to the number of matches found
 *
 * @example
 * ```typescript
 * await countKris('Chris and Kris are friends'); // 2
 * await countKris('Christopher'); // 1
 * await countKris('No matches here'); // 0
 * ```
 */
export async function countKris(input: string): Promise<number> {
  const result = await countKrisAI(input);
  return result.result;
}

/**
 * Legacy regex-based version of countKris for backward compatibility.
 * @deprecated Use countKris() instead, which now uses AI detection as the primary method.
 */
export function countKrisRegex(input: string): number {
  const result = findKrisRegex(input);
  return result.length;
}
