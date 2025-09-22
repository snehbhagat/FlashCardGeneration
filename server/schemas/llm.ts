import { z } from "zod";

// LLM Input Schema
export const llmGenerationInputSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  count: z.number().int().min(1).max(50),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

// LLM Output Schema (for what we expect from the LLM)
export const llmFlashcardSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  answer: z.string().min(1, "Answer cannot be empty"),
  explanation: z.string().optional(), // Optional detailed explanation
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const llmFlashcardsResponseSchema = z.object({
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  cards: z.array(llmFlashcardSchema),
  metadata: z.object({
    generatedAt: z.string(),
    model: z.string(),
    promptVersion: z.string().default("1.0"),
  }).optional(),
});

// Types derived from schemas
export type LLMGenerationInput = z.infer<typeof llmGenerationInputSchema>;
export type LLMFlashcard = z.infer<typeof llmFlashcardSchema>;
export type LLMFlashcardsResponse = z.infer<typeof llmFlashcardsResponseSchema>;

// Error handling schemas
export const llmErrorSchema = z.object({
  type: z.enum(["validation", "rate_limit", "api_error", "parsing_error", "unknown"]),
  message: z.string(),
  details: z.record(z.any()).optional(),
  retryable: z.boolean().default(false),
});

export type LLMError = z.infer<typeof llmErrorSchema>;

// Rate limiting schema
export const rateLimitSchema = z.object({
  requests: z.number(),
  windowMs: z.number(),
  resetTime: z.string(),
});

export type RateLimit = z.infer<typeof rateLimitSchema>;