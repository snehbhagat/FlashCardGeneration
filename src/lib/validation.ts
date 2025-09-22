import { z } from "zod";

export const difficultySchema = z.enum(["easy", "medium", "hard"]);

export const flashcardSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  answer: z.string().min(1),
  tags: z.array(z.string()),
  difficulty: difficultySchema,
  known: z.boolean(),
  dueAt: z.string().optional(),
  ease: z.number().optional(),
  interval: z.number().optional(),
});

export const deckSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  cards: z.array(flashcardSchema),
});

export const generateInputSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  count: z.union([z.literal(5), z.literal(10), z.literal(20)]),
  difficulty: difficultySchema,
});

export type GenerateInput = z.infer<typeof generateInputSchema>;
