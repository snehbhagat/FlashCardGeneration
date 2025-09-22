import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Card, Deck } from "./types";
import { uid } from "./utils";

const LS_KEYS = {
  decks: "flashforge:decks",
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function listDecks(): Deck[] {
  return readJSON<Deck[]>(LS_KEYS.decks, []);
}

export function saveDeck(deck: Deck) {
  const decks = listDecks();
  const idx = decks.findIndex((d) => d.id === deck.id);
  if (idx >= 0) decks[idx] = deck; else decks.unshift(deck);
  writeJSON(LS_KEYS.decks, decks);
}

export function deleteDeck(id: string) {
  const decks = listDecks().filter((d) => d.id !== id);
  writeJSON(LS_KEYS.decks, decks);
}

export function getDeck(id: string) {
  return listDecks().find((d) => d.id === id);
}

export function renameDeck(id: string, title: string) {
  const d = getDeck(id);
  if (!d) return;
  d.title = title;
  saveDeck(d);
}

export function markCardKnown(deckId: string, cardId: string, known: boolean) {
  const d = getDeck(deckId);
  if (!d) return;
  d.cards = d.cards.map((c) => (c.id === cardId ? { ...c, known } : c));
  saveDeck(d);
}

export function createDeckFromCards(topic: string, difficulty: Deck["tags"][number], cards: Card): Deck;
export function createDeckFromCards(topic: string, difficulty: string, cards: Card[]): Deck;
export function createDeckFromCards(topic: string, difficulty: string, cards: Card[] | Card): Deck {
  const list = Array.isArray(cards) ? cards : [cards];
  return {
    id: uid("deck"),
    title: `${topic} • ${new Date().toLocaleDateString()}`,
    topic,
    tags: [difficulty],
    createdAt: new Date().toISOString(),
    cards: list,
  };
}

// React context for simple state management
interface DeckContextValue {
  decks: Deck[];
  refresh: () => void;
  addDeck: (d: Deck) => void;
  removeDeck: (id: string) => void;
  renameDeck: (id: string, title: string) => void;
}

const DeckContext = createContext<DeckContextValue | null>(null);

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    setDecks(listDecks());
  }, []);

  const api = useMemo<DeckContextValue>(() => ({
    decks,
    refresh: () => setDecks(listDecks()),
    addDeck: (d: Deck) => {
      saveDeck(d);
      setDecks((prev) => [d, ...prev.filter((p) => p.id !== d.id)]);
    },
    removeDeck: (id: string) => {
      deleteDeck(id);
      setDecks((prev) => prev.filter((d) => d.id !== id));
    },
    renameDeck: (id: string, title: string) => {
      const d = getDeck(id);
      if (!d) return;
      d.title = title;
      saveDeck(d);
      setDecks((prev) => prev.map((x) => (x.id === id ? d : x)));
    },
  }), [decks]);

  return <DeckContext.Provider value={api}>{children}</DeckContext.Provider>;
}

export function useDecks() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDecks must be used within DeckProvider");
  return ctx;
}