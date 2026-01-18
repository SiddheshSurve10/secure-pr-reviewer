/**
 * LLM Integration Utilities
 * 
 * This module provides interfaces and helpers for integrating with LLMs
 * Currently stubbed, ready for: 
 * - OpenAI API
 * - Google Gemini API
 * - Anthropic Claude API
 */

export interface LLMConfig {
  provider: "openai" | "gemini" | "anthropic";
  apiKey: string;
  model?:  string;
}

export interface LLMPrompt {
  system: string;
  user: string;
  temperature?:  number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  tokensUsed: number;
}

/**
 * TODO: Implement LLM call wrapper
 * Example usage for security review:
 * 
 * const prompt:  LLMPrompt = {
 *   system: "You are a security expert code reviewer.",
 *   user: `Review this code diff for security vulnerabilities:\n${diff}`,
 *   temperature: 0.2,
 *   maxTokens: 500
 * };
 * 
 * const response = await callLLM(prompt, config);
 * const securityIssues = parseSecurityResponse(response. content);
 */

export async function callLLM(
  prompt: LLMPrompt,
  config: LLMConfig
): Promise<LLMResponse> {
  // Stub implementation
  console.warn(
    "LLM integration not configured.  Returning stub response."
  );

  return {
    content: "LLM integration not yet configured",
    tokensUsed:  0,
  };
}

/**
 * Helper to parse security issues from LLM response
 */
export function parseSecurityResponse(content: string) {
  // TODO: Parse LLM response and extract structured security issues
  return [];
}

/**
 * Helper to parse behavior issues from LLM response
 */
export function parseBehaviorResponse(content: string) {
  // TODO: Parse LLM response and extract structured behavior issues
  return [];
}