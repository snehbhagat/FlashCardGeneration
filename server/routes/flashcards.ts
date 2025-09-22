import { Request, Response } from "express";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { llmGenerationInputSchema, type LLMError } from "../schemas/llm.js";
import { getFlashcardService } from "../services/flashcardGeneration.js";

// In-memory rate limiting (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function generateFlashcardsHandler(req: Request, res: Response) {
  try {
    // Apply rate limiting
    const clientId = req.ip || 'unknown';
    const rateLimitResult = rateLimiter(clientId);
    
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        retryAfter: rateLimitResult.retryAfter,
        limit: rateLimitResult.limit
      });
    }

    // Validate input
    const validationResult = llmGenerationInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: validationResult.error.errors
      });
    }

    const input = validationResult.data;
    
    // Get flashcard service and generate
    const flashcardService = getFlashcardService();
    const result = await flashcardService.generateFlashcards(input);

    // Return successful response
    res.json({
      success: true,
      data: result,
      rateLimitInfo: {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime
      }
    });

  } catch (error) {
    console.error("Flashcard generation error:", error);

    // Handle LLM-specific errors
    if (isLLMError(error)) {
      const statusCode = getStatusCodeForLLMError(error);
      return res.status(statusCode).json({
        error: error.message,
        type: error.type,
        retryable: error.retryable,
        details: error.details
      });
    }

    // Handle unexpected errors
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while generating flashcards"
    });
  }
}

export async function healthCheckHandler(req: Request, res: Response) {
  try {
    const flashcardService = getFlashcardService();
    const isHealthy = await flashcardService.healthCheck();
    
    if (isHealthy) {
      res.json({ status: "healthy", timestamp: new Date().toISOString() });
    } else {
      res.status(503).json({ status: "unhealthy", timestamp: new Date().toISOString() });
    }
  } catch (error) {
    res.status(503).json({ 
      status: "unhealthy", 
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString() 
    });
  }
}

// Helper functions
function isLLMError(error: any): error is LLMError {
  return error && typeof error === 'object' && 'type' in error && 'message' in error;
}

function getStatusCodeForLLMError(error: LLMError): number {
  switch (error.type) {
    case "validation":
      return 400;
    case "rate_limit":
      return 429;
    case "api_error":
      return 502;
    case "parsing_error":
      return 422;
    default:
      return 500;
  }
}