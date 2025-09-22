import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function Flashcard({ question, answer, onFlip }: { question: string; answer: string; onFlip?: (flipped: boolean) => void }) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onFlip?.(flipped);
  }, [flipped, onFlip]);

  function toggle() { setFlipped((f) => !f); }

  return (
    <div className="relative h-64 w-full [perspective:1000px]">
      <div
        ref={cardRef}
        className={cn(
          "card-surface absolute inset-0 grid cursor-pointer place-content-center rounded-xl p-6 text-center [transform-style:preserve-3d]",
          "transition-transform duration-500 [transform:rotateY(var(--rot))]",
          "motion-reduce:transition-none motion-reduce:[transform:none]",
        )}
        style={{
          // custom property to avoid layout thrash
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          "--rot": flipped ? "180deg" : "0deg",
        }}
        role="button"
        aria-pressed={flipped}
        aria-controls="flashcard-back"
        onClick={toggle}
      >
        <div className="absolute inset-0 grid place-content-center px-6 [backface-visibility:hidden]">
          <p className="text-lg font-medium">{question}</p>
          <p className="mt-2 text-sm text-foreground/70">Click or press Space to reveal</p>
        </div>
        <div id="flashcard-back" className="absolute inset-0 grid place-content-center px-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-lg font-medium">{answer}</p>
          <p className="mt-2 text-sm text-foreground/70">Click or press Space to hide</p>
        </div>
      </div>
    </div>
  );
}
