/**
 * Validated versions of the core functions that use LLM validation
 */

import { isKrisRegex as originalIsKris, isExactlyKrisRegex as originalIsExactlyKris, findKrisRegex as originalFindKris, countKrisRegex as originalCountKris } from './index.js';
import { LLMValidator, ValidatorConfig, ValidationResult } from './validator.js';

export interface ValidatedResult<T> {
  result: T;
  validation: ValidationResult;
  originalResult: T;
}

export class ValidatedNameDetector {
  private validator: LLMValidator;

  constructor(config?: ValidatorConfig) {
    this.validator = new LLMValidator(config);
  }

  /**
   * Validated version of isKris that includes LLM validation
   */
  async isKris(input: string): Promise<ValidatedResult<boolean>> {
    const originalResult = originalIsKris(input);
    const validation = await this.validator.validateBoolean(input, originalResult, 'isKris');

    let finalResult = originalResult;
    if (!validation.isValid && validation.correctedResult !== null) {
      // If LLM suggests correction, use it
      finalResult = Array.isArray(validation.correctedResult) && validation.correctedResult.length > 0;
    }

    return {
      result: finalResult,
      validation,
      originalResult
    };
  }

  /**
   * Validated version of isExactlyKris that includes LLM validation
   */
  async isExactlyKris(input: string): Promise<ValidatedResult<boolean>> {
    const originalResult = originalIsExactlyKris(input);
    const validation = await this.validator.validateBoolean(input, originalResult, 'isExactlyKris');

    let finalResult = originalResult;
    if (!validation.isValid && validation.correctedResult !== null) {
      // For exact matches, check if the corrected result contains exactly one item that matches the input
      if (Array.isArray(validation.correctedResult)) {
        finalResult = validation.correctedResult.length === 1 &&
                     validation.correctedResult[0].toLowerCase().trim() === input.toLowerCase().trim();
      }
    }

    return {
      result: finalResult,
      validation,
      originalResult
    };
  }

  /**
   * Validated version of findKris that includes LLM validation
   */
  async findKris(input: string): Promise<ValidatedResult<string[]>> {
    const originalResult = originalFindKris(input);
    const validation = await this.validator.validateNameDetection(input, originalResult, 'findKris');

    let finalResult = originalResult;
    if (!validation.isValid && validation.correctedResult !== null && Array.isArray(validation.correctedResult)) {
      finalResult = validation.correctedResult;
    }

    return {
      result: finalResult,
      validation,
      originalResult
    };
  }

  /**
   * Validated version of countKris that includes LLM validation
   */
  async countKris(input: string): Promise<ValidatedResult<number>> {
    const findResult = await this.findKris(input);
    const originalResult = originalCountKris(input);

    return {
      result: findResult.result.length,
      validation: findResult.validation,
      originalResult
    };
  }
}

/**
 * Creates a new validated name detector with the given configuration
 */
export function createValidatedDetector(config?: ValidatorConfig): ValidatedNameDetector {
  return new ValidatedNameDetector(config);
}

/**
 * Convenience functions for validated detection
 */

let defaultDetector: ValidatedNameDetector | null = null;

function getDefaultDetector(): ValidatedNameDetector {
  if (!defaultDetector) {
    defaultDetector = new ValidatedNameDetector();
  }
  return defaultDetector;
}

/**
 * Validated version of isKris using default configuration
 */
export async function isKrisValidated(input: string): Promise<ValidatedResult<boolean>> {
  return getDefaultDetector().isKris(input);
}

/**
 * Validated version of isExactlyKris using default configuration
 */
export async function isExactlyKrisValidated(input: string): Promise<ValidatedResult<boolean>> {
  return getDefaultDetector().isExactlyKris(input);
}

/**
 * Validated version of findKris using default configuration
 */
export async function findKrisValidated(input: string): Promise<ValidatedResult<string[]>> {
  return getDefaultDetector().findKris(input);
}

/**
 * Validated version of countKris using default configuration
 */
export async function countKrisValidated(input: string): Promise<ValidatedResult<number>> {
  return getDefaultDetector().countKris(input);
}