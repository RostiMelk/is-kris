# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-20

### Added
- Initial release of `is-kris` package
- `isKris()` function to detect Chris/Kris variations in strings
- `isExactlyKris()` function for exact name matching
- `findKris()` function to find all Chris/Kris variations in a string
- `countKris()` function to count Chris/Kris variations
- `REGEX` constant for direct access to the matching pattern
- Comprehensive regex pattern supporting multiple name variations:
  - Chris, Chriss
  - Kris, Kriss, Khris
  - Christopher, Christoph
  - Kristopher, Kristoph
  - Christofer, Cristofer
  - Christoffer, Kristoffer
- Case-insensitive matching
- Word boundary detection to avoid false matches
- TypeScript support with full type definitions
- Zero dependencies
- Comprehensive test suite with 100% coverage
- Built with Bun runtime support
- Performance optimized for large strings
- Proper error handling for invalid inputs

### Features
- ✅ Detects various spellings of Chris/Kris and their longer forms
- ✅ Case-insensitive matching
- ✅ Word boundary detection (won't match "Christmas" or "Christian")
- ✅ TypeScript support with full type definitions
- ✅ Zero dependencies
- ✅ Lightweight (~2KB)
- ✅ Works with Node.js, Bun, and browsers
- ✅ Comprehensive test coverage

[1.0.0]: https://github.com/yourusername/is-kris/releases/tag/v1.0.0
