import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import {
    llmFlashcardsResponseSchema,
    llmGenerationInputSchema,
    type LLMError,
    type LLMFlashcardsResponse,
    type LLMGenerationInput
} from "../schemas/llm.js";

export class FlashcardGenerationService {
  private llm: ChatGroq;
  private promptTemplate: PromptTemplate;
  private outputParser: StructuredOutputParser<z.ZodTypeAny>;
  private chain: RunnableSequence;

  constructor() {
    this.initializeLLM();
    this.initializePromptTemplate();
    this.initializeOutputParser();
    this.initializeChain();
  }

  private initializeLLM() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is required");
    }

    this.llm = new ChatGroq({
      apiKey,
      model: process.env.GROQ_MODEL || "llama-3.1-70b-versatile",
      temperature: 0.7, // Balance creativity with consistency
      maxTokens: 2048,
    });
  }

  private initializePromptTemplate() {
    const template = `You are an expert educator creating flashcards for students. Your task is to generate high-quality, educational flashcards on the given topic.

TOPIC: {topic}
DIFFICULTY: {difficulty}
NUMBER OF CARDS: {count}

REQUIREMENTS:
1. Create exactly {count} flashcards
2. Questions should be clear, specific, and at {difficulty} difficulty level
3. Answers should be concise but complete
4. For "easy" level: focus on basic definitions and fundamental concepts
5. For "medium" level: include application and understanding questions
6. For "hard" level: include analysis, synthesis, and complex problem-solving
7. Include diverse question types: definitions, examples, comparisons, applications
8. Ensure questions are pedagogically sound and promote learning

DIFFICULTY GUIDELINES:
- Easy: Basic recall, definitions, simple facts
- Medium: Understanding, application, simple analysis
- Hard: Synthesis, evaluation, complex analysis, critical thinking

OUTPUT FORMAT:
{format_instructions}

Generate flashcards that are educationally valuable and appropriate for the specified difficulty level.`;

    this.promptTemplate = PromptTemplate.fromTemplate(template);
  }

  private initializeOutputParser() {
    // Define the schema for individual flashcards
    const flashcardSchema = z.object({
      question: z.string().describe("A clear, specific question appropriate for the difficulty level"),
      answer: z.string().describe("A concise but complete answer to the question"),
      explanation: z.string().optional().describe("Optional additional explanation or context"),
      tags: z.array(z.string()).describe("Relevant tags for categorization"),
      difficulty: z.enum(["easy", "medium", "hard"]).describe("The difficulty level of this specific card"),
    });

    // Define the complete response schema
    const responseSchema = z.object({
      topic: z.string().describe("The topic these flashcards cover"),
      difficulty: z.enum(["easy", "medium", "hard"]).describe("The overall difficulty level requested"),
      cards: z.array(flashcardSchema).describe("Array of generated flashcards"),
    });

    this.outputParser = StructuredOutputParser.fromZodSchema(responseSchema);
  }

  private initializeChain() {
    this.chain = RunnableSequence.from([
      {
        topic: (input: LLMGenerationInput) => input.topic,
        difficulty: (input: LLMGenerationInput) => input.difficulty,
        count: (input: LLMGenerationInput) => input.count.toString(),
        format_instructions: () => this.outputParser.getFormatInstructions(),
      },
      this.promptTemplate,
      this.llm,
      this.outputParser,
    ]);
  }

  async generateFlashcards(input: LLMGenerationInput): Promise<LLMFlashcardsResponse> {
    try {
      // Validate input
      const validatedInput = llmGenerationInputSchema.parse(input);

      // Generate flashcards using the chain
      const result = await this.chain.invoke(validatedInput);

      // Add metadata
      const responseWithMetadata: LLMFlashcardsResponse = {
        ...result,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: process.env.GROQ_MODEL || "llama-3.1-70b-versatile",
          promptVersion: "1.0",
        },
      };

      // Validate output
      return llmFlashcardsResponseSchema.parse(responseWithMetadata);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      
      // Create structured error
      const llmError: LLMError = {
        type: this.classifyError(error),
        message: error instanceof Error ? error.message : "Unknown error occurred",
        details: { originalError: error },
        retryable: this.isRetryableError(error),
      };

      throw llmError;
    }
  }

  private classifyError(error: any): LLMError["type"] {
    if (error?.name === "ZodError") return "validation";
    if (error?.status === 429) return "rate_limit";
    if (error?.message?.includes("parse") || error?.message?.includes("format")) return "parsing_error";
    if (error?.status >= 400 && error?.status < 500) return "api_error";
    return "unknown";
  }

  private isRetryableError(error: any): boolean {
    // Rate limits and temporary server errors are retryable
    return error?.status === 429 || (error?.status >= 500 && error?.status < 600);
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const testInput: LLMGenerationInput = {
        topic: "test",
        count: 1,
        difficulty: "easy",
      };

      // Simple test to ensure the chain works
      await this.chain.invoke(testInput);
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let flashcardService: FlashcardGenerationService | null = null;

export function getFlashcardService(): FlashcardGenerationService {
  if (!flashcardService) {
    flashcardService = new FlashcardGenerationService();
  }
  return flashcardService;
}