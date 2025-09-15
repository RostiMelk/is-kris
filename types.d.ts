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
export declare function isKris(input: string): "is" | "isn't";

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
export declare function isExactlyKris(input: string): "is" | "isn't";

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
export declare function findKris(input: string): string[];

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
export declare function countKris(input: string): number;

/**
 * Regular expression to match various spellings of the name Chris/Christopher and its variants.
 *
 * Matches:
 * - Chris, Chriss
 * - Kris, Kriss, Khris
 * - Christopher, Christoph
 * - Kristopher, Kristoph
 * - Christofer, Cristofer
 * - Christoffer, Kristoffer
 */
export declare const REGEX: RegExp;
