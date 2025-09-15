/**
 * LLM-based validator for name detection results
 */

export interface ValidatorConfig {
  apiKey?: string;
  model?: string;
  endpoint?: string;
  temperature?: number;
  timeout?: number;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  reasoning?: string;
  correctedResult?: any;
}

export interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class LLMValidator {
  private config: Required<ValidatorConfig>;

  constructor(config: ValidatorConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.OPENAI_API_KEY || '',
      model: config.model || 'gpt-4o-mini',
      endpoint: config.endpoint || 'https://api.openai.com/v1/chat/completions',
      temperature: config.temperature ?? 0.1,
      timeout: config.timeout || 30000,
    };
  }

  /**
   * Validates if a name detection result is correct using LLM
   */
  async validateNameDetection(
    input: string,
    detectedNames: string[],
    functionUsed: 'isKris' | 'isExactlyKris' | 'findKris' | 'countKris'
  ): Promise<ValidationResult> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for LLM validation');
    }

    const prompt = this.buildValidationPrompt(input, detectedNames, functionUsed);

    try {
      const response = await this.makeAPICall(prompt);
      return this.parseValidationResponse(response, detectedNames);
    } catch (error) {
      throw new Error(`LLM validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates a boolean result from isKris or isExactlyKris
   */
  async validateBoolean(
    input: string,
    result: boolean,
    functionUsed: 'isKris' | 'isExactlyKris'
  ): Promise<ValidationResult> {
    const detectedNames = result ? [input] : [];
    return this.validateNameDetection(input, detectedNames, functionUsed);
  }

  private buildValidationPrompt(
    input: string,
    detectedNames: string[],
    functionUsed: string
  ): string {
    const functionDescription = this.getFunctionDescription(functionUsed);

    return `You are validating the results of a name detection function that identifies variations of "Chris" or "Kris" names.

Function: ${functionUsed}
Description: ${functionDescription}

Input text: "${input}"
Detected names: ${JSON.stringify(detectedNames)}

Your task is to determine if the detection result is correct. Consider these variations as valid Chris/Kris names:
- Chris, Chriss, Kris, Kriss, Khris
- Christopher, Christoph, Kristopher, Kristoph
- Christofer, Cristofer, Christoffer, Kristoffer

Invalid matches should NOT include:
- Christian, Christina, Christmas, Christ
- Kristen, Kristin, Christine, Christen
- Partial matches within other words

Respond with a JSON object containing:
{
  "isValid": boolean,
  "confidence": number (0-1),
  "reasoning": "brief explanation",
  "correctedResult": [array of correct names if isValid is false, otherwise null]
}`;
  }

  private getFunctionDescription(functionUsed: string): string {
    const descriptions = {
      'isKris': 'Checks if input contains ANY variation of Chris/Kris names',
      'isExactlyKris': 'Checks if input is EXACTLY a Chris/Kris name (no extra text)',
      'findKris': 'Finds ALL Chris/Kris names in the input text',
      'countKris': 'Counts how many Chris/Kris names appear in the input'
    };
    return descriptions[functionUsed as keyof typeof descriptions] || 'Unknown function';
  }

  async makeAPICall(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.config.temperature,
          max_tokens: 500
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: LLMResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private parseValidationResponse(response: string, originalResult: string[]): ValidationResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        isValid: Boolean(parsed.isValid),
        confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0)),
        reasoning: parsed.reasoning || 'No reasoning provided',
        correctedResult: parsed.correctedResult || null
      };
    } catch (error) {
      // Fallback: assume valid if we can't parse
      return {
        isValid: true,
        confidence: 0.5,
        reasoning: `Could not parse LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        correctedResult: null
      };
    }
  }
}

/**
 * Creates a new LLM validator instance with the given configuration
 */
export function createValidator(config?: ValidatorConfig): LLMValidator {
  return new LLMValidator(config);
}
