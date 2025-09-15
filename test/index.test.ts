import { test, expect, describe } from "bun:test";
import { isKris, isExactlyKris, findKris, countKris, REGEX } from "../index";

describe("isKris", () => {
  test("should return 'is' for basic Chris variations", () => {
    expect(isKris("Chris")).toBe("is");
    expect(isKris("Chriss")).toBe("is");
    expect(isKris("chris")).toBe("is");
    expect(isKris("CHRIS")).toBe("is");
  });

  test("should return 'is' for basic Kris variations", () => {
    expect(isKris("Kris")).toBe("is");
    expect(isKris("Kriss")).toBe("is");
    expect(isKris("Khris")).toBe("is");
    expect(isKris("kris")).toBe("is");
    expect(isKris("KRIS")).toBe("is");
  });

  test("should return 'is' for Christopher variations", () => {
    expect(isKris("Christopher")).toBe("is");
    expect(isKris("Christoph")).toBe("is");
    expect(isKris("christopher")).toBe("is");
    expect(isKris("CHRISTOPHER")).toBe("is");
  });

  test("should return 'is' for Kristopher variations", () => {
    expect(isKris("Kristopher")).toBe("is");
    expect(isKris("Kristoph")).toBe("is");
    expect(isKris("kristopher")).toBe("is");
    expect(isKris("KRISTOPHER")).toBe("is");
  });

  test("should return 'is' for other valid variations", () => {
    expect(isKris("Christofer")).toBe("is");
    expect(isKris("Cristofer")).toBe("is");
    expect(isKris("Christoffer")).toBe("is");
    expect(isKris("Kristoffer")).toBe("is");
  });

  test("should return 'is' when name appears in longer strings", () => {
    expect(isKris("Hello Chris")).toBe("is");
    expect(isKris("My name is Christopher")).toBe("is");
    expect(isKris("Chris is here")).toBe("is");
    expect(isKris("I know Kris")).toBe("is");
  });

  test("should return 'isn't' for invalid names", () => {
    expect(isKris("John")).toBe("isn't");
    expect(isKris("Mike")).toBe("isn't");
    expect(isKris("Christian")).toBe("isn't");
    expect(isKris("Christina")).toBe("isn't");
    expect(isKris("Christmas")).toBe("isn't");
  });

  test("should return 'isn't' for edge cases", () => {
    expect(isKris("")).toBe("isn't");
    expect(isKris(" ")).toBe("isn't");
    expect(isKris("K")).toBe("isn't");
    expect(isKris("Kr")).toBe("isn't");
    expect(isKris("Kri")).toBe("isn't");
  });

  test("should handle non-string inputs", () => {
    expect(isKris(null as any)).toBe("isn't");
    expect(isKris(undefined as any)).toBe("isn't");
    expect(isKris(123 as any)).toBe("isn't");
    expect(isKris({} as any)).toBe("isn't");
    expect(isKris([] as any)).toBe("isn't");
  });
});

describe("isExactlyKris", () => {
  test("should return 'is' for exact matches", () => {
    expect(isExactlyKris("Chris")).toBe("is");
    expect(isExactlyKris("Kris")).toBe("is");
    expect(isExactlyKris("Christopher")).toBe("is");
    expect(isExactlyKris("Kristopher")).toBe("is");
    expect(isExactlyKris("chris")).toBe("is");
    expect(isExactlyKris("KRIS")).toBe("is");
  });

  test("should return 'isn't' for partial matches", () => {
    expect(isExactlyKris("Hello Chris")).toBe("isn't");
    expect(isExactlyKris("Chris is here")).toBe("isn't");
    expect(isExactlyKris("My name is Christopher")).toBe("isn't");
    expect(isExactlyKris("I know Kris")).toBe("isn't");
  });

  test("should return 'isn't' for non-Chris names", () => {
    expect(isExactlyKris("John")).toBe("isn't");
    expect(isExactlyKris("Christian")).toBe("isn't");
    expect(isExactlyKris("Christmas")).toBe("isn't");
  });

  test("should handle edge cases", () => {
    expect(isExactlyKris("")).toBe("isn't");
    expect(isExactlyKris(" Chris ")).toBe("isn't");
    expect(isExactlyKris("Chris\n")).toBe("isn't");
  });

  test("should handle non-string inputs", () => {
    expect(isExactlyKris(null as any)).toBe("isn't");
    expect(isExactlyKris(undefined as any)).toBe("isn't");
    expect(isExactlyKris(123 as any)).toBe("isn't");
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
    expect(isKris("Chris 123")).toBe("is"); // Space creates word boundary
    expect(isKris("123 Chris")).toBe("is"); // Space creates word boundary
    expect(isKris("Chris123")).toBe("isn't"); // No word boundary between s and 1
    expect(isKris("123Chris")).toBe("isn't"); // No word boundary between 3 and C
    expect(isKris("Chr1s")).toBe("isn't");
  });

  test("should handle strings with special characters", () => {
    expect(isKris("Chris!")).toBe("is");
    expect(isKris("@Chris")).toBe("is");
    expect(isKris("Chris-Smith")).toBe("is");
    expect(isKris("Chris.Johnson")).toBe("is");
  });

  test("should handle unicode characters", () => {
    expect(isKris("Hello Chris 👋")).toBe("is");
    expect(isKris("Chris 🎉")).toBe("is");
  });

  test("should respect word boundaries", () => {
    expect(isKris("Christen")).toBe("isn't");
    expect(isKris("Kristin")).toBe("isn't");
    expect(isKris("Christmas")).toBe("isn't");
    expect(isKris("Kristen")).toBe("isn't");
  });
});
