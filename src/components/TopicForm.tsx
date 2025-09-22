import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TopicFormValues {
  topic: string;
  count: 5 | 10 | 20;
  difficulty: "easy" | "medium" | "hard";
}

export default function TopicForm({ onSubmit, busy = false }: { onSubmit: (v: TopicFormValues) => void; busy?: boolean }) {
  const [values, setValues] = useState<TopicFormValues>({ topic: "", count: 10, difficulty: "medium" });
  const topicId = useId();
  const countId = useId();
  const diffId = useId();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.topic.trim()) return;
    onSubmit(values);
  }

  return (
    <div className="relative">
      {/* light overlay behind form to separate from animated background */}
      <div aria-hidden className="pointer-events-none absolute -inset-2 rounded-2xl bg-white/15 backdrop-blur-md" />
      <form
        onSubmit={submit}
        className="glass-card relative p-6 text-white"
        aria-labelledby="topicFormHeading"
      >
        <div className="mb-4">
          <h2 id="topicFormHeading" className="text-lg font-semibold">Generate flashcards</h2>
          <p className="text-sm text-white/80">Enter a topic, choose how many cards and a difficulty level.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={topicId} className="block text-sm font-semibold text-white">Topic</label>
            <input
              id={topicId}
              value={values.topic}
              onChange={(e) => setValues({ ...values, topic: e.target.value })}
              className={cn(
                "mt-1 w-full rounded-md border border-slate-500 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm outline-none focus:border-slate-600 focus:ring-2 focus:ring-indigo-600",
                !values.topic.trim() && "ring-1 ring-destructive/50",
              )}
              placeholder="e.g., Photosynthesis, World War II, React Hooks"
              required
            />
          </div>
          <div>
            <label htmlFor={countId} className="block text-sm font-semibold text-white">Number of cards</label>
            <select
              id={countId}
              value={values.count}
              onChange={(e) => setValues({ ...values, count: Number(e.target.value) as 5 | 10 | 20 })}
              className="mt-1 w-full rounded-md border border-slate-500 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-slate-600 focus:ring-2 focus:ring-indigo-600"
              aria-describedby="countHelp"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <p id="countHelp" className="mt-1 text-xs text-white/80">Choose smaller sets for quick practice.</p>
          </div>
          <fieldset>
            <legend id={diffId} className="block text-sm font-semibold text-white">Difficulty</legend>
            <div className="mt-2 flex gap-2" role="radiogroup" aria-labelledby={diffId}>
              {["easy","medium","hard"].map((d) => (
                <label
                  key={d}
                  className={cn(
                    "flex-1 cursor-pointer select-none rounded-md border border-slate-500 px-3 py-2 text-center text-sm capitalize shadow-sm",
                    values.difficulty===d ? "bg-white text-gray-900" : "bg-white text-gray-800 hover:bg-slate-50",
                  )}
                >
                  <input type="radio" name="difficulty" value={d} className="sr-only" checked={values.difficulty===d} onChange={() => setValues({ ...values, difficulty: d as any })} />
                  {d}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="submit"
            disabled={busy || !values.topic.trim()}
            aria-busy={busy}
            aria-disabled={busy}
            className="shadow-md hover:shadow-lg"
          >
            {busy ? "Generating…" : "Generate"}
          </Button>
        </div>
      </form>
    </div>
  );
}
