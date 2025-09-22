import { useState } from "react";
import { useDecks } from "@/lib/store.tsx";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import { Link } from "react-router-dom";

export default function DecksPage() {
  const { decks, removeDeck, renameDeck } = useDecks();
  const [q, setQ] = useState("");

  const filtered = decks.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()) || d.topic.toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="container-page py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Your Decks</h1>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search decks" className="w-64 rounded-md border px-3 py-2" />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No decks yet" subtitle="Generate your first deck from the Home page." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <li key={d.id} className="card-surface p-4">
              <Link to={`/decks/${d.id}`} className="font-medium hover:underline">{d.title}</Link>
              <p className="mt-1 text-sm text-foreground/70">{d.topic} • {formatDate(d.createdAt)} • {d.cards.length} cards</p>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" variant="outline"><Link to={`/decks/${d.id}`}>Open</Link></Button>
                <Button size="sm" variant="outline" onClick={() => { const t = prompt("Rename deck", d.title); if (t) renameDeck(d.id, t); }}>Rename</Button>
                <Button size="sm" variant="destructive" onClick={() => { if (confirm("Delete deck?")) removeDeck(d.id); }}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
