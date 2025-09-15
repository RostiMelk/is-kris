export { EXACT_REGEX, REGEX } from "./src/constant.js";
export {
  countKris,
  countKris as countChris,
  findKris,
  findKris as findChris,
  isExactlyKris,
  isExactlyKris as isExactlyChris,
  isKris,
  isKris as isChris,
  // Legacy regex versions
  countKrisRegex,
  countKrisRegex as countChrisRegex,
  findKrisRegex,
  findKrisRegex as findChrisRegex,
  isExactlyKrisRegex,
  isExactlyKrisRegex as isExactlyChrisRegex,
  isKrisRegex,
  isKrisRegex as isChrisRegex,
} from "./src/index.js";

// LLM Validator exports
export {
  LLMValidator,
  createValidator,
  type ValidatorConfig,
  type ValidationResult,
  type LLMResponse,
} from "./src/validator.js";

// AI Detector exports (primary AI methods)
export {
  AINameDetector,
  createAIDetector,
  isKrisAI,
  isExactlyKrisAI,
  findKrisAI,
  countKrisAI,
  type AIDetectionResult,
} from "./src/ai-detector.js";

// Validated functions exports (legacy validation approach)
export {
  ValidatedNameDetector,
  createValidatedDetector,
  isKrisValidated,
  isExactlyKrisValidated,
  findKrisValidated,
  countKrisValidated,
  type ValidatedResult,
} from "./src/validated.js";
