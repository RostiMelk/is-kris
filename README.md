# is-kris 🎯

A lightweight, zero-dependency TypeScript utility for detecting variations of the name Chris/Kris in strings.

[![npm version](https://badge.fury.io/js/is-kris.svg)](https://badge.fury.io/js/is-kris)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Supported Name Variations

The package recognizes these name patterns:

- **Chris**: Chris, Chriss
- **Kris**: Kris, Kriss, Khris
- **Christopher**: Christopher, Christoph
- **Kristopher**: Kristopher, Kristoph
- **Other variants**: Christofer, Cristofer, Christoffer, Kristoffer

All matches are case-insensitive.

## Installation

```bash
# Using npm
npm install is-kris

# Using yarn
yarn add is-kris

# Using pnpm
pnpm add is-kris

# Using bun
bun add is-kris
```

## Usage

### Basic Usage

```typescript
import { isKris } from "is-kris";

// Basic detection
isKris("Chris"); // true
isKris("Kris"); // true
isKris("Christopher"); // true
isKris("John"); // false

// Case insensitive
isKris("CHRIS"); // true
isKris("kris"); // true

// Works in longer strings
isKris("Hello Chris, how are you?"); // true
isKris("My friend Christopher is coming"); // true
```

### All Available Functions

```typescript
import { isKris, isExactlyKris, findKris, countKris, REGEX } from "is-kris";

// Check if string contains any Chris/Kris variation
isKris("Hello Chris"); // true

// Check if string is exactly a Chris/Kris variation
isExactlyKris("Chris"); // true
isExactlyKris("Hello Chris"); // false

// Find all Chris/Kris variations in a string
findKris("Chris and Kris are friends"); // ['Chris', 'Kris']

// Count Chris/Kris variations in a string
countKris("Chris, Kris, and Christopher"); // 3

// Access the underlying regex pattern
console.log(REGEX); // /\b(?:c|ch|k|kh)ri(?:s|ss|st(?:o(?:ph(?:er)?|fer|ffer)))\b/i
```

### Real-world Examples

```typescript
import { isKris, findKris, countKris } from "is-kris";

// User validation
function validateUser(name: string) {
  if (isKris(name)) {
    return `Welcome ${name}! You have a great name! 🎉`;
  }
  return `Hello ${name}!`;
}

// Content filtering
function highlightChrisNames(text: string) {
  const names = findKris(text);
  let highlightedText = text;

  names.forEach((name) => {
    highlightedText = highlightedText.replace(name, `<mark>${name}</mark>`);
  });

  return highlightedText;
}

// Analytics
function analyzeGuestList(guests: string[]) {
  const chrisCount = guests.reduce(
    (count, guest) => count + countKris(guest),
    0,
  );

  return {
    totalGuests: guests.length,
    chrisVariations: chrisCount,
    percentage: (chrisCount / guests.length) * 100,
  };
}
```

## API Reference

### `isKris(input: string): boolean`

Checks if a string contains any variation of Chris/Kris.

**Parameters:**

- `input` (string): The string to check

**Returns:** `boolean` - `true` if any variation is found, `false` otherwise

**Example:**

```typescript
isKris("Christopher"); // true
isKris("Hello Kris"); // true
isKris("John"); // false
```

### `isExactlyKris(input: string): boolean`

Checks if a string is exactly a variation of Chris/Kris (case-insensitive).

**Parameters:**

- `input` (string): The string to check

**Returns:** `boolean` - `true` if the entire string is a Chris/Kris variation, `false` otherwise

**Example:**

```typescript
isExactlyKris("Chris"); // true
isExactlyKris("Hello Chris"); // false
```

### `findKris(input: string): string[]`

Finds all Chris/Kris variations in a string.

**Parameters:**

- `input` (string): The string to search

**Returns:** `string[]` - Array of all found matches

**Example:**

```typescript
findKris("Chris and Kris"); // ['Chris', 'Kris']
findKris("No matches"); // []
```

### `countKris(input: string): number`

Counts Chris/Kris variations in a string.

**Parameters:**

- `input` (string): The string to count in

**Returns:** `number` - Number of matches found

**Example:**

```typescript
countKris("Chris and Kris"); // 2
countKris("Christopher"); // 1
```

### `REGEX: RegExp`

The underlying regular expression used for matching.

**Value:** `/\b(?:c|ch|k|kh)ri(?:s|ss|st(?:o(?:ph(?:er)?|fer|ffer)))\b/i`

## Error Handling

All functions gracefully handle invalid inputs:

```typescript
isKris(null); // false
isKris(undefined); // false
isKris(123); // false
findKris(null); // []
countKris(undefined); // 0
```

## Performance

- ⚡ Optimized regex pattern for fast matching
- 📦 Lightweight bundle size (~2KB)
- 🔄 Efficient string processing
- ✅ Handles large strings gracefully

## Browser Support

Works in all modern browsers and Node.js environments:

- Node.js 18+
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Bun runtime
- Deno (with npm specifier)

## Development

```bash
# Clone the repository
git clone https://github.com/RostiMelk/is-kris.git
cd is-kris

# Install dependencies
bun install

# Run tests
bun test

# Run tests in watch mode
bun run test:watch

# Build the package
bun run build

# Run tests with coverage
bun run test:coverage
```
