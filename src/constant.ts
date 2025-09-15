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
export const REGEX: RegExp =
  /\b(?:c|ch|k|kh)ri(?:s|ss|st(?:o(?:ph(?:er)?|fer|ffer)))\b/i;

/**
 * Regular expression to match strings that are exactly a variation of Chris/Kris.
 * Uses start (^) and end ($) anchors to ensure the entire string matches.
 */
export const EXACT_REGEX: RegExp =
  /^(?:c|ch|k|kh)ri(?:s|ss|st(?:o(?:ph(?:er)?|fer|ffer)))$/i;
