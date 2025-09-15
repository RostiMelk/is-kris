/**
 * AI-first name detection that uses LLM as the primary method
 */

import { LLMValidator, ValidatorConfig } from './validator.js';

export interface AIDetectionResult<T> {
  result: T;
  confidence: number;
  reasoning?: string;
}

export class AINameDetector {
  private validator: LLMValidator;

  constructor(config?: ValidatorConfig) {
    this.validator = new LLMValidator(config);
  }

  /**
   * Uses AI to determine if input contains any variation of Chris/Kris
   */
  async isKris(input: string): Promise<AIDetectionResult<boolean>> {
    const result = await this.findKris(input);
    return {
      result: result.result.length > 0,
      confidence: result.confidence,
      reasoning: result.reasoning
    };
  }

  /**
   * Uses AI to determine if input is exactly a Chris/Kris name
   */
  async isExactlyKris(input: string): Promise<AIDetectionResult<boolean>> {
    const prompt = this.buildDetectionPrompt(input, 'isExactlyKris');

    try {
      const response = await this.validator.makeAPICall(prompt);
      const parsed = this.parseDetectionResponse(response);

      const isExact = Array.isArray(parsed.names) &&
                     parsed.names.length === 1 &&
                     parsed.names[0].toLowerCase().trim() === input.toLowerCase().trim();

      return {
        result: isExact,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning
      };
    } catch (error) {
      throw new Error(`AI detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Uses AI to find all Chris/Kris names in the input text
   */
  async findKris(input: string): Promise<AIDetectionResult<string[]>> {
    const prompt = this.buildDetectionPrompt(input, 'findKris');

    try {
      const response = await this.validator.makeAPICall(prompt);
      const parsed = this.parseDetectionResponse(response);

      return {
        result: Array.isArray(parsed.names) ? parsed.names : [],
        confidence: parsed.confidence,
        reasoning: parsed.reasoning
      };
    } catch (error) {
      throw new Error(`AI detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Uses AI to count Chris/Kris names in the input text
   */
  async countKris(input: string): Promise<AIDetectionResult<number>> {
    const result = await this.findKris(input);
    return {
      result: result.result.length,
      confidence: result.confidence,
      reasoning: result.reasoning
    };
  }

  private buildDetectionPrompt(input: string, functionType: string): string {
    const functionDescription = this.getFunctionDescription(functionType);

    return `You are a name detection AI that identifies variations of "Chris" or "Kris" names in text.

Function: ${functionType}
Description: ${functionDescription}

Input text: "${input}"

Valid Chris/Kris name variations include:
- Chris, Chriss, Kris, Kriss, Khris
- Christopher, Christoph, Kristopher, Kristoph
- Christofer, Cristofer, Christoffer, Kristoffer

Invalid matches (do NOT include):
- Christian, Christina, Christmas, Christ
- Kristen, Kristin, Christine, Christen
- Partial matches within other words (like "Christmas" containing "Chris")

Respond with a JSON object containing:
{
  "names": [array of detected Chris/Kris names],
  "confidence": number (0-1),
  "reasoning": "brief explanation of your detection"
}`;
  }

  private getFunctionDescription(functionType: string): string {
    const descriptions = {
      'isKris': 'Detect if input contains ANY variation of Chris/Kris names',
      'isExactlyKris': 'Detect if input is EXACTLY a Chris/Kris name (no extra text)',
      'findKris': 'Find ALL Chris/Kris names in the input text',
      'countKris': 'Count how many Chris/Kris names appear in the input'
    };
    return descriptions[functionType as keyof typeof descriptions] || 'Unknown function';
  }

  private parseDetectionResponse(response: string): { names: string[], confidence: number, reasoning: string } {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        names: Array.isArray(parsed.names) ? parsed.names : [],
        confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0)),
        reasoning: parsed.reasoning || 'No reasoning provided'
      };
    } catch (error) {
      // Fallback: return empty result
      return {
        names: [],
        confidence: 0.5,
        reasoning: `Could not parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

/**
 * Creates a new AI name detector with the given configuration
 */
export function createAIDetector(config?: ValidatorConfig): AINameDetector {
  return new AINameDetector(config);
}

/**
 * Convenience functions using a default AI detector
 */

let defaultDetector: AINameDetector | null = null;

function getDefaultDetector(): AINameDetector {
  if (!defaultDetector) {
    defaultDetector = new AINameDetector();
  }
  return defaultDetector;
}

/**
 * AI-powered isKris using default configuration
 */
export async function isKrisAI(input: string): Promise<AIDetectionResult<boolean>> {
  return getDefaultDetector().isKris(input);
}

/**
 * AI-powered isExactlyKris using default configuration
 */
export async function isExactlyKrisAI(input: string): Promise<AIDetectionResult<boolean>> {
  return getDefaultDetector().isExactlyKris(input);
}

/**
 * AI-powered findKris using default configuration
 */
export async function findKrisAI(input: string): Promise<AIDetectionResult<string[]>> {
  return getDefaultDetector().findKris(input);
}

/**
 * AI-powered countKris using default configuration
 */
export async function countKrisAI(input: string): Promise<AIDetectionResult<number>> {
  return getDefaultDetector().countKris(input);
}