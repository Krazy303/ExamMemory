import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCw, ChevronRight, Flame } from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Eyebrow,
} from "@/components/studymind/primitives";
import { flashcards } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/revise")({
  head: () => ({
    meta: [
      { title: "Revise — Memoria" },
      {
        name: "description",
        content:
          "Flashcard revision queue tuned to the concepts you actually miss.",
      },
    ],
  }),
  component: RevisePage,
});

function RevisePage() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ got: 0, almost: 0, learning: 0 });

  const card = flashcards[idx];
  const done = idx >= flashcards.length;

  const rate = (kind: "got" | "almost" | "learning") => {
    setStats((s) => ({ ...s, [kind]: s[kind] + 1 }));
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  const reset = () => {
    setIdx(0);
    setRevealed(false);
    setStats({ got: 0, almost: 0, learning: 0 });
  };
  const total = flashcards.length;
  const reviewed = stats.got + stats.almost + stats.learning;
  const accuracy = reviewed > 0 ? Math.round((stats.got / reviewed) * 100) : 0;

  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-8 py-10 md:py-14">
      <header className="mb-8">
        <Eyebrow>Revise</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Revision session
        </h1>
        <p className="text-[color:var(--link)] mt-2 text-[14px]">
          Focused flashcards drawn from your mistakes and weakest concepts.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        <div>
          <div className="mb-4 flex items-center justify-between text-[12px] text-[color:var(--link)]">
            <span>
              Card {Math.min(idx + 1, total)} of {total}
            </span>
            <span>
              {Math.round((Math.min(idx, total) / total) * 100)}% complete
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(Math.min(idx, total) / total) * 100}%` }}
            />
          </div>

          {done ? (
            <Card className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 grid place-items-center mx-auto mb-4">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Session complete!</h2>
              <p className="text-[color:var(--link)] text-[13px] mb-6">
                You reviewed {total} cards with {accuracy}% accuracy.
              </p>
              <Button onClick={reset}>
                <RotateCw className="w-4 h-4" /> Start over
              </Button>
            </Card>
          ) : (
            <Card className="min-h-[360px] flex flex-col justify-between">
              <div>
                <Badge variant="muted" className="mb-6">
                  Question
                </Badge>
                <div className="text-xl md:text-2xl font-medium leading-relaxed">
                  {card.q}
                </div>
                {revealed && (
                  <div className="mt-8 pt-8 border-t border-white/8">
                    <Badge variant="primary" className="mb-4">
                      Answer
                    </Badge>
                    <div className="text-[15px] text-[color:var(--link)] leading-relaxed whitespace-pre-wrap">
                      {card.a}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8">
                {!revealed ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setRevealed(true)}
                  >
                    Reveal Answer
                  </Button>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => rate("learning")}
                      className="rounded-full py-3 text-[13px] border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition"
                    >
                      Still Learning
                    </button>
                    <button
                      onClick={() => rate("almost")}
                      className="rounded-full py-3 text-[13px] border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 transition"
                    >
                      Almost There
                    </button>
                    <button
                      onClick={() => rate("got")}
                      className="rounded-full py-3 text-[13px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 transition"
                    >
                      Got It
                    </button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Eyebrow>Session</Eyebrow>
          {[
            { label: "Reviewed", value: reviewed },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "Streak", value: "14d" },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)]">
                {s.label}
              </div>
              <div className="text-2xl font-semibold mt-1">{s.value}</div>
            </Card>
          ))}
          <Card className="p-5">
            <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)] mb-3">
              Rating breakdown
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-emerald-300">Got It</span>
                <span>{stats.got}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-300">Almost</span>
                <span>{stats.almost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-300">Learning</span>
                <span>{stats.learning}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
