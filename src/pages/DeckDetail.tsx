import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Flashcard from "@/components/Flashcard";
import { getDeck, markCardKnown } from "@/lib/store.tsx";
import type { Deck } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function DeckDetailPage() {
  const { id } = useParams();
  const [deck, setDeck] = useState<Deck | undefined>();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dueOnly, setDueOnly] = useState(false);

  useEffect(() => {
    if (id) setDeck(getDeck(id));
  }, [id]);

  const cards = useMemo(() => {
    if (!deck) return [] as Deck["cards"];
    const all = deck.cards;
    if (!dueOnly) return all;
    const now = Date.now();
    return all.filter((c) => !c.known || (c.dueAt ? new Date(c.dueAt).getTime() <= now : true));
  }, [deck, dueOnly]);

  useEffect(() => { setIdx(0); }, [dueOnly]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " ) { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "j") next();
      if (e.key === "ArrowLeft"  || e.key.toLowerCase() === "k") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cards.length]);

  if (!deck) return (
    <main className="container-page py-10"><p>Deck not found. <Link to="/">Go home</Link></p></main>
  );

  const card = cards[idx];
  const total = cards.length;
  const progress = total ? Math.round(((idx + 1) / total) * 100) : 0;

  function next() { setIdx((i) => Math.min(i + 1, Math.max(total - 1, 0))); setFlipped(false); }
  function prev() { setIdx((i) => Math.max(i - 1, 0)); setFlipped(false); }

  function setKnown(k: boolean) {
    if (!card) return;
    markCardKnown(deck.id, card.id, k);
    setDeck(getDeck(deck.id));
  }

  return (
    <main className="container-page py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{deck.title}</h1>
          <p className="text-sm text-foreground/70">{deck.topic} • {new Date(deck.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} /> Due today</label>
          <div className="min-w-32 rounded-md border px-3 py-1 text-sm">{idx + 1} / {total} ({progress}%)</div>
        </div>
      </div>

      {card ? (
        <div className="grid gap-6">
          <Flashcard question={card.question} answer={card.answer} onFlip={setFlipped} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button variant="outline" onClick={prev} aria-label="Previous (Left or K)">Prev</Button>
              <Button variant="outline" onClick={() => setFlipped((f) => !f)} aria-label="Flip (Space)">Flip</Button>
              <Button variant="outline" onClick={next} aria-label="Next (Right or J)">Next</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setKnown(false)}>Unknown</Button>
              <Button onClick={() => setKnown(true)}>Known</Button>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="card-surface p-10 text-center">No cards to study.</div>
      )}
    </main>
  );
}
