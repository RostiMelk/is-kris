import { test, expect, describe } from "bun:test";
import { isKris, isExactlyKris, findKris, countKris, REGEX } from "../index";

describe("isKris", () => {
  test("should return true for basic Chris variations", () => {
    expect(isKris("Chris")).toBe(true);
    expect(isKris("Chriss")).toBe(true);
    expect(isKris("chris")).toBe(true);
    expect(isKris("CHRIS")).toBe(true);
  });

  test("should return true for basic Kris variations", () => {
    expect(isKris("Kris")).toBe(true);
    expect(isKris("Kriss")).toBe(true);
    expect(isKris("Khris")).toBe(true);
    expect(isKris("kris")).toBe(true);
    expect(isKris("KRIS")).toBe(true);
  });

  test("should return true for Christopher variations", () => {
    expect(isKris("Christopher")).toBe(true);
    expect(isKris("Christoph")).toBe(true);
    expect(isKris("christopher")).toBe(true);
    expect(isKris("CHRISTOPHER")).toBe(true);
  });

  test("should return true for Kristopher variations", () => {
    expect(isKris("Kristopher")).toBe(true);
    expect(isKris("Kristoph")).toBe(true);
    expect(isKris("kristopher")).toBe(true);
    expect(isKris("KRISTOPHER")).toBe(true);
  });

  test("should return true for other valid variations", () => {
    expect(isKris("Christofer")).toBe(true);
    expect(isKris("Cristofer")).toBe(true);
    expect(isKris("Christoffer")).toBe(true);
    expect(isKris("Kristoffer")).toBe(true);
  });

  test("should return true when name appears in longer strings", () => {
    expect(isKris("Hello Chris")).toBe(true);
    expect(isKris("My name is Christopher")).toBe(true);
    expect(isKris("Chris is here")).toBe(true);
    expect(isKris("I know Kris")).toBe(true);
  });

  test("should return false for invalid names", () => {
    expect(isKris("John")).toBe(false);
    expect(isKris("Mike")).toBe(false);
    expect(isKris("Christian")).toBe(false);
    expect(isKris("Christina")).toBe(false);
    expect(isKris("Christmas")).toBe(false);
  });

  test("should return false for edge cases", () => {
    expect(isKris("")).toBe(false);
    expect(isKris(" ")).toBe(false);
    expect(isKris("K")).toBe(false);
    expect(isKris("Kr")).toBe(false);
    expect(isKris("Kri")).toBe(false);
  });

  test("should handle non-string inputs", () => {
    expect(isKris(null as any)).toBe(false);
    expect(isKris(undefined as any)).toBe(false);
    expect(isKris(123 as any)).toBe(false);
    expect(isKris({} as any)).toBe(false);
    expect(isKris([] as any)).toBe(false);
  });
});

describe("isExactlyKris", () => {
  test("should return true for exact matches", () => {
    expect(isExactlyKris("Chris")).toBe(true);
    expect(isExactlyKris("Kris")).toBe(true);
    expect(isExactlyKris("Christopher")).toBe(true);
    expect(isExactlyKris("Kristopher")).toBe(true);
    expect(isExactlyKris("chris")).toBe(true);
    expect(isExactlyKris("KRIS")).toBe(true);
  });

  test("should return false for partial matches", () => {
    expect(isExactlyKris("Hello Chris")).toBe(false);
    expect(isExactlyKris("Chris is here")).toBe(false);
    expect(isExactlyKris("My name is Christopher")).toBe(false);
    expect(isExactlyKris("I know Kris")).toBe(false);
  });

  test("should return false for non-Chris names", () => {
    expect(isExactlyKris("John")).toBe(false);
    expect(isExactlyKris("Christian")).toBe(false);
    expect(isExactlyKris("Christmas")).toBe(false);
  });

  test("should handle edge cases", () => {
    expect(isExactlyKris("")).toBe(false);
    expect(isExactlyKris(" Chris ")).toBe(false);
    expect(isExactlyKris("Chris\n")).toBe(false);
  });

  test("should handle non-string inputs", () => {
    expect(isExactlyKris(null as any)).toBe(false);
    expect(isExactlyKris(undefined as any)).toBe(false);
    expect(isExactlyKris(123 as any)).toBe(false);
  });
});

describe("findKris", () => {
  test("should find single matches", () => {
    expect(findKris("Chris")).toEqual(["Chris"]);
    expect(findKris("Hello Kris")).toEqual(["Kris"]);
    expect(findKris("Christopher is here")).toEqual(["Christopher"]);
  });

  test("should find multiple matches", () => {
    expect(findKris("Chris and Kris")).toEqual(["Chris", "Kris"]);
    expect(findKris("Christopher knows Kristopher")).toEqual([
      "Christopher",
      "Kristopher",
    ]);
    expect(findKris("Chris, Chriss, and Kris")).toEqual([
      "Chris",
      "Chriss",
      "Kris",
    ]);
  });

  test("should preserve case in results", () => {
    expect(findKris("CHRIS and kris")).toEqual(["CHRIS", "kris"]);
    expect(findKris("Christopher and kristopher")).toEqual([
      "Christopher",
      "kristopher",
    ]);
  });

  test("should return empty array for no matches", () => {
    expect(findKris("John and Mike")).toEqual([]);
    expect(findKris("")).toEqual([]);
    expect(findKris("Christmas party")).toEqual([]);
  });

  test("should handle non-string inputs", () => {
    expect(findKris(null as any)).toEqual([]);
    expect(findKris(undefined as any)).toEqual([]);
    expect(findKris(123 as any)).toEqual([]);
  });

  test("should handle complex strings", () => {
    const text =
      "In the office, Chris talked to Kris about Christopher's project. Kristopher was also there.";
    const result = findKris(text);
    expect(result).toEqual(["Chris", "Kris", "Christopher", "Kristopher"]);
  });
});

describe("countKris", () => {
  test("should count single matches", () => {
    expect(countKris("Chris")).toBe(1);
    expect(countKris("Hello Kris")).toBe(1);
    expect(countKris("Christopher is here")).toBe(1);
  });

  test("should count multiple matches", () => {
    expect(countKris("Chris and Kris")).toBe(2);
    expect(countKris("Christopher knows Kristopher")).toBe(2);
    expect(countKris("Chris, Chriss, and Kris")).toBe(3);
  });

  test("should return 0 for no matches", () => {
    expect(countKris("John and Mike")).toBe(0);
    expect(countKris("")).toBe(0);
    expect(countKris("Christmas party")).toBe(0);
  });

  test("should handle non-string inputs", () => {
    expect(countKris(null as any)).toBe(0);
    expect(countKris(undefined as any)).toBe(0);
    expect(countKris(123 as any)).toBe(0);
  });

  test("should handle complex strings", () => {
    const text =
      "Chris, Kris, Christopher, Kristopher, and Christoffer went to the party.";
    expect(countKris(text)).toBe(5);
  });
});

describe("REGEX constant", () => {
  test("should be accessible and be a RegExp", () => {
    expect(REGEX).toBeInstanceOf(RegExp);
  });

  test("should match all expected variations", () => {
    const testCases = [
      "Chris",
      "Chriss",
      "chris",
      "CHRIS",
      "Kris",
      "Kriss",
      "Khris",
      "kris",
      "KRIS",
      "Christopher",
      "Christoph",
      "christopher",
      "CHRISTOPHER",
      "Kristopher",
      "Kristoph",
      "kristopher",
      "KRISTOPHER",
      "Christofer",
      "Cristofer",
      "Christoffer",
      "Kristoffer",
    ];

    testCases.forEach((name) => {
      expect(REGEX.test(name)).toBe(true);
    });
  });

  test("should not match invalid names", () => {
    const invalidCases = [
      "John",
      "Mike",
      "Christian",
      "Christina",
      "Christmas",
      "Christ",
      "Krist",
      "K",
      "Kr",
      "Kri",
      "",
      " ",
    ];

    invalidCases.forEach((name) => {
      expect(REGEX.test(name)).toBe(false);
    });
  });
});

describe("Performance tests", () => {
  test("should handle large strings efficiently", () => {
    const largeString =
      "Hello ".repeat(10000) + "Chris " + "world ".repeat(10000) + "Kris";

    const startTime = performance.now();
    const result = countKris(largeString);
    const endTime = performance.now();

    expect(result).toBe(2);
    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
  });

  test("should handle many repetitions", () => {
    const manyChris = "Chris ".repeat(1000);
    expect(countKris(manyChris)).toBe(1000);
  });
});

describe("Edge cases and special characters", () => {
  test("should handle strings with numbers", () => {
    expect(isKris("Chris 123")).toBe(true); // Space creates word boundary
    expect(isKris("123 Chris")).toBe(true); // Space creates word boundary
    expect(isKris("Chris123")).toBe(false); // No word boundary between s and 1
    expect(isKris("123Chris")).toBe(false); // No word boundary between 3 and C
    expect(isKris("Chr1s")).toBe(false);
  });

  test("should handle strings with special characters", () => {
    expect(isKris("Chris!")).toBe(true);
    expect(isKris("@Chris")).toBe(true);
    expect(isKris("Chris-Smith")).toBe(true);
    expect(isKris("Chris.Johnson")).toBe(true);
  });

  test("should handle unicode characters", () => {
    expect(isKris("Hello Chris 👋")).toBe(true);
    expect(isKris("Chris 🎉")).toBe(true);
  });

  test("should respect word boundaries", () => {
    expect(isKris("Christen")).toBe(false);
    expect(isKris("Kristin")).toBe(false);
    expect(isKris("Christmas")).toBe(false);
    expect(isKris("Kristen")).toBe(false);
  });
});
