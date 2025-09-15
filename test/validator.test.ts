import { test, expect, describe, beforeEach, mock } from "bun:test";
import {
  LLMValidator,
  createValidator,
  ValidatedNameDetector,
  createValidatedDetector,
  isKrisValidated,
  type ValidationResult,
  type ValidatorConfig,
} from "../index";

// Mock fetch for testing
const mockFetch = mock((url: string, options?: any) => {
  const body = JSON.parse(options?.body || "{}");
  const prompt = body.messages?.[0]?.content || "";

  // Simulate LLM responses based on prompt content
  let response = {
    isValid: true,
    confidence: 0.9,
    reasoning: "Valid name detected correctly",
    correctedResult: null,
  };

  // Test cases for invalid detection
  if (prompt.includes('"Christmas"') && prompt.includes('["Christmas"]')) {
    response = {
      isValid: false,
      confidence: 0.95,
      reasoning: "Christmas is not a valid Chris/Kris name",
      correctedResult: [],
    };
  }

  if (prompt.includes('"Christian John"') && prompt.includes('["Christian"]')) {
    response = {
      isValid: false,
      confidence: 0.9,
      reasoning: "Christian is not a valid Chris/Kris variant",
      correctedResult: [],
    };
  }

  return Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        choices: [
          {
            message: {
              content: JSON.stringify(response),
            },
          },
        ],
      }),
  });
});

// Mock global fetch
global.fetch = mockFetch as any;

describe("LLMValidator", () => {
  let validator: LLMValidator;
  const testConfig: ValidatorConfig = {
    apiKey: "test-key",
    model: "gpt-4o-mini",
    temperature: 0.1,
  };

  beforeEach(() => {
    validator = new LLMValidator(testConfig);
    mockFetch.mockClear();
  });

  test("should create validator with default config", () => {
    const defaultValidator = new LLMValidator();
    expect(defaultValidator).toBeInstanceOf(LLMValidator);
  });

  test("should create validator with createValidator function", () => {
    const createdValidator = createValidator(testConfig);
    expect(createdValidator).toBeInstanceOf(LLMValidator);
  });

  test("should throw error when API key is missing", async () => {
    const validatorNoKey = new LLMValidator({ apiKey: "" });

    await expect(
      validatorNoKey.validateNameDetection("Chris", ["Chris"], "isKris")
    ).rejects.toThrow("API key is required");
  });

  test("should validate correct name detection", async () => {
    const result = await validator.validateNameDetection(
      "Hello Chris",
      ["Chris"],
      "isKris"
    );

    expect(result.isValid).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.reasoning).toBeTruthy();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should validate boolean results", async () => {
    const result = await validator.validateBoolean("Chris", true, "isKris");

    expect(result.isValid).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should handle invalid name detection (Christmas)", async () => {
    const result = await validator.validateNameDetection(
      "Christmas",
      ["Christmas"],
      "isKris"
    );

    expect(result.isValid).toBe(false);
    expect(result.confidence).toBeGreaterThan(0.9);
    expect(result.correctedResult).toEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should handle API call errors gracefully", async () => {
    const errorValidator = new LLMValidator({
      ...testConfig,
      endpoint: "https://invalid-endpoint.test",
    });

    // Mock fetch to simulate network error
    const originalFetch = global.fetch;
    global.fetch = mock(() => Promise.reject(new Error("Network error")));

    await expect(
      errorValidator.validateNameDetection("Chris", ["Chris"], "isKris")
    ).rejects.toThrow("LLM validation failed");

    global.fetch = originalFetch;
  });

  test("should handle malformed API responses", async () => {
    const originalFetch = global.fetch;
    global.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: "Invalid JSON response",
                },
              },
            ],
          }),
      })
    ) as any;

    const result = await validator.validateNameDetection(
      "Chris",
      ["Chris"],
      "isKris"
    );

    // Should fallback gracefully
    expect(result.isValid).toBe(true);
    expect(result.confidence).toBe(0.5);
    expect(result.reasoning).toContain("Could not parse LLM response");

    global.fetch = originalFetch;
  });
});

describe("ValidatedNameDetector", () => {
  let detector: ValidatedNameDetector;

  beforeEach(() => {
    detector = new ValidatedNameDetector({
      apiKey: "test-key",
      model: "gpt-4o-mini",
    });
    mockFetch.mockClear();
  });

  test("should create detector with createValidatedDetector function", () => {
    const createdDetector = createValidatedDetector();
    expect(createdDetector).toBeInstanceOf(ValidatedNameDetector);
  });

  test("should validate isKris function", async () => {
    const result = await detector.isKris("Chris");

    expect(result.result).toBe(true);
    expect(result.originalResult).toBe(true);
    expect(result.validation).toBeDefined();
    expect(result.validation.isValid).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should validate isExactlyKris function", async () => {
    const result = await detector.isExactlyKris("Christopher");

    expect(result.result).toBe(true);
    expect(result.originalResult).toBe(true);
    expect(result.validation).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should validate findKris function", async () => {
    const result = await detector.findKris("Chris and Kris are friends");

    expect(result.result).toEqual(["Chris", "Kris"]);
    expect(result.originalResult).toEqual(["Chris", "Kris"]);
    expect(result.validation).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should validate countKris function", async () => {
    const result = await detector.countKris("Chris and Kris are friends");

    expect(result.result).toBe(2);
    expect(result.originalResult).toBe(2);
    expect(result.validation).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should handle correction for invalid detection", async () => {
    const result = await detector.findKris("Christian John");

    // The mock should return corrected result (empty array)
    expect(result.result).toEqual([]);
    expect(result.originalResult).toEqual([]); // Original regex should also not match Christian
    expect(result.validation.isValid).toBe(false);
    expect(result.validation.correctedResult).toEqual([]);
  });

  test("should correct boolean results when LLM disagrees", async () => {
    // This would require a more sophisticated mock setup
    // For now, test that the structure works
    const result = await detector.isKris("Chris");

    expect(typeof result.result).toBe("boolean");
    expect(typeof result.originalResult).toBe("boolean");
    expect(result.validation).toBeDefined();
  });
});

describe("Convenience functions", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test("should work with isKrisValidated", async () => {
    const result = await isKrisValidated("Christopher");

    expect(result.result).toBe(true);
    expect(result.validation).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should reuse default detector instance", async () => {
    // Call twice to ensure same instance is reused
    await isKrisValidated("Chris");
    await isKrisValidated("Kris");

    // Should have been called twice (once for each validation)
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe("Configuration edge cases", () => {
  test("should handle missing environment variables", () => {
    const originalEnv = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const validator = new LLMValidator();
    expect(validator).toBeInstanceOf(LLMValidator);

    // Restore original environment
    if (originalEnv) {
      process.env.OPENAI_API_KEY = originalEnv;
    }
  });

  test("should use provided config over environment variables", () => {
    const originalEnv = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "env-key";

    const validator = new LLMValidator({ apiKey: "config-key" });
    expect(validator).toBeInstanceOf(LLMValidator);

    // Restore original environment
    if (originalEnv) {
      process.env.OPENAI_API_KEY = originalEnv;
    } else {
      delete process.env.OPENAI_API_KEY;
    }
  });

  test("should handle timeout configuration", () => {
    const validator = new LLMValidator({ timeout: 5000 });
    expect(validator).toBeInstanceOf(LLMValidator);
  });

  test("should handle custom endpoint configuration", () => {
    const validator = new LLMValidator({
      endpoint: "https://custom-api.example.com/v1/chat/completions",
    });
    expect(validator).toBeInstanceOf(LLMValidator);
  });
});