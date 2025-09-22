import { z } from "zod";
import type { Card } from "./types";
import { uid } from "./utils";
import { GenerateInput, flashcardSchema, generateInputSchema } from "./validation";

const cardsSchema = z.array(flashcardSchema);

// API Response types
interface FlashcardGenerationResponse {
  success: boolean;
  data?: {
    topic: string;
    difficulty: string;
    cards: Array<{
      question: string;
      answer: string;
      explanation?: string;
      tags: string[];
      difficulty: "easy" | "medium" | "hard";
    }>;
    metadata?: {
      generatedAt: string;
      model: string;
      promptVersion: string;
    };
  };
  error?: string;
  type?: string;
  retryable?: boolean;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

export async function generateFlashcards(input: GenerateInput): Promise<Card[]> {
  const parsed = generateInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
  }
  
  const { topic, count, difficulty } = parsed.data;

  try {
    const result = await generateFlashcardsWithRetry({
      topic,
      count,
      difficulty,
    });

    // Transform LLM response to our Card format
    const cards: Card[] = result.cards.map((llmCard) => ({
      id: uid("card"),
      question: llmCard.question,
      answer: llmCard.answer,
      tags: [...llmCard.tags, topic], // Include topic as a tag
      difficulty: llmCard.difficulty,
      known: false,
      dueAt: new Date().toISOString(),
      ease: 2.5,
      interval: 0,
    } satisfies Card));

    // Return the cards directly - they already match our Card type
    return cards;
  } catch (error) {
    console.error("Failed to generate flashcards:", error);
    
    // Fallback to template-based generation if API fails
    console.warn("Falling back to template-based generation");
    return generateFallbackFlashcards(input);
  }
}

async function generateFlashcardsWithRetry(
  input: { topic: string; count: number; difficulty: "easy" | "medium" | "hard" },
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<FlashcardGenerationResponse["data"]> {
  let lastError: Error | null = null;
  let delay = config.initialDelayMs;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result: FlashcardGenerationResponse = await response.json();

      if (!response.ok) {
        const error = new Error(result.error || "Failed to generate flashcards");
        
        // Don't retry on client errors (4xx) except rate limits
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw error;
        }
        
        // Check if error is retryable
        if (!result.retryable && attempt < config.maxRetries) {
          throw error;
        }
        
        lastError = error;
      } else if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      
      // Don't retry on the last attempt
      if (attempt === config.maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

// Fallback function using the original template approach
function generateFallbackFlashcards(input: GenerateInput): Card[] {
  const { topic, count, difficulty } = input;
  
  const templates = [
    { q: `Define the core concept of ${topic} in one sentence.`, a: `The core concept of ${topic} is ...` },
    { q: `Why is ${topic} important? Give a concise reason.`, a: `${topic} matters because ...` },
    { q: `Name a common misconception about ${topic}.`, a: `A common misconception is ...` },
    { q: `Provide a simple example illustrating ${topic}.`, a: `Example: ...` },
    { q: `List two key terms related to ${topic}.`, a: `Key terms include ...` },
    { q: `How does ${topic} relate to everyday life?`, a: `It relates by ...` },
    { q: `Contrast ${topic} with a closely related idea.`, a: `${topic} differs by ...` },
    { q: `What are the typical challenges when learning ${topic}?`, a: `Challenges include ...` },
    { q: `Summarize a practical tip for mastering ${topic}.`, a: `Tip: ...` },
    { q: `What would be a trick question about ${topic}?`, a: `Trick: ...` },
  ];

  const list: Card[] = Array.from({ length: count }, (_, i) => {
    const t = templates[i % templates.length];
    return {
      id: uid("card"),
      question: t.q,
      answer: t.a,
      tags: [topic, difficulty],
      difficulty,
      known: false,
      dueAt: new Date().toISOString(),
      ease: 2.5,
      interval: 0,
    } satisfies Card;
  });

  return list;
}

// Health check function
export async function checkAIServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch("/api/flashcards/health");
    const result = await response.json();
    return response.ok && result.status === "healthy";
  } catch {
    return false;
  }
}
