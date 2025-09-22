export type Difficulty = "easy" | "medium" | "hard";

export interface Card {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  difficulty: Difficulty;
  known: boolean;
  dueAt?: string;
  ease?: number;
  interval?: number;
}

export interface Deck {
  id: string;
  title: string;
  topic: string;
  tags: string[];
  createdAt: string; // ISO
  cards: Card[];
}
