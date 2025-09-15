# is-kris

A lightweight, zero-dependency TypeScript utility for detecting variations of the name Chris/Kris in strings.

[![npm version](https://badge.fury.io/js/is-kris.svg)](https://badge.fury.io/js/is-kris)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Supported Name Variations

Recognizes these patterns (case-insensitive):

- **Chris**: Chris, Chriss
- **Kris**: Kris, Kriss, Khris
- **Christopher**: Christopher, Christoph
- **Kristopher**: Kristopher, Kristoph
- **Other variants**: Christofer, Cristofer, Christoffer, Kristoffer

## Installation

```bash
npm install is-kris
```

## Usage

```typescript
import { isKris, isExactlyKris, findKris, countKris, REGEX } from "is-kris";

// Check if string contains any Chris/Kris variation
isKris("Hello Chris"); // "is"
isKris("John"); // "isn't"

// Check if string is exactly a Chris/Kris variation
isExactlyKris("Chris"); // "is"
isExactlyKris("Hello Chris"); // "isn't"

// Find all variations in a string
findKris("Chris and Kris are friends"); // ['Chris', 'Kris']

// Count variations in a string
countKris("Chris, Kris, and Christopher"); // 3

// Access the underlying regex
console.log(REGEX); // /\b(?:c|ch|k|kh)ri(?:s|ss|st(?:o(?:ph(?:er)?|fer|ffer)))\b/i

// You can also use Chris aliases
import { isChris, findChris, countChris, isExactlyChris } from "is-kris";

isChris("Hello Christopher"); // "is"
findChris("Chris and Kris"); // ['Chris', 'Kris']
```

## API Reference

### `isKris(input: string): "is" | "isn't"`

Checks if a string contains any variation of Chris/Kris and returns a human-readable string.

### `isExactlyKris(input: string): "is" | "isn't"`

Checks if a string is exactly a variation of Chris/Kris and returns a human-readable string.

### `findKris(input: string): string[]`

Returns array of all Chris/Kris variations found in the string.

### `countKris(input: string): number`

Returns the number of Chris/Kris variations found.

### `REGEX: RegExp`

The underlying regular expression pattern.

## Error Handling

All functions handle invalid inputs gracefully:

```typescript
isKris(null as any); // "isn't"
findKris(undefined as any); // []
countKris(123 as any); // 0
```

## Performance & Compatibility

- Optimized regex for fast matching
- Lightweight bundle (~2KB)
- Works in Node.js 18+, all modern browsers, Bun, and Deno

## Development

```bash
git clone https://github.com/RostiMelk/is-kris.git
cd is-kris
bun install
bun test
bun run build
```
