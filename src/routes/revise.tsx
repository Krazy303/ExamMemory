import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { RotateCw, ChevronRight, Flame, Brain } from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Eyebrow,
} from "@/components/studymind/primitives";
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
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [chapterFilter, setChapterFilter] = useState("All");
  
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ got: 0, almost: 0, learning: 0 });

  // Load chat histories to build dynamic flashcards deck
  useEffect(() => {
    try {
      const savedThreads = localStorage.getItem("studymind_chat_threads");
      const localQs: any[] = [];
      if (savedThreads) {
        const threads = JSON.parse(savedThreads);
        if (Array.isArray(threads)) {
          threads.forEach((t: any) => {
            for (let i = 0; i < t.messages.length; i++) {
              const msg = t.messages[i];
              if (msg.role === "user") {
                const nextMsg = t.messages[i + 1];
                if (nextMsg && nextMsg.role === "ai" && !nextMsg.text.startsWith("Error:")) {
                  localQs.push({
                    id: `${t.id}-${i}`,
                    q: msg.text,
                    a: nextMsg.summary || nextMsg.text,
                    subject: t.datasetName,
                    chapter: t.searchType.toLowerCase().replace(/_/g, " "),
                  });
                }
              }
            }
          });
        }
      }
      setQuestionsList(localQs);
    } catch (e) {
      console.error("Failed to load questions for revision:", e);
    }
  }, []);

  // Extract unique subjects
  const subjects = useMemo(() => {
    const list = Array.from(new Set(questionsList.map((q) => q.subject)));
    return ["All", ...list];
  }, [questionsList]);

  // Extract unique chapters/topics for selected subject
  const chapters = useMemo(() => {
    const filteredQs = subjectFilter === "All" 
      ? questionsList 
      : questionsList.filter((q) => q.subject === subjectFilter);
    const list = Array.from(new Set(filteredQs.map((q) => q.chapter)));
    return ["All", ...list];
  }, [questionsList, subjectFilter]);

  // Filter flashcards by selections
  const activeCards = useMemo(() => {
    return questionsList.filter((q) => {
      if (subjectFilter !== "All" && q.subject !== subjectFilter) return false;
      if (chapterFilter !== "All" && q.chapter !== chapterFilter) return false;
      return true;
    });
  }, [questionsList, subjectFilter, chapterFilter]);

  // Reset session whenever filters change
  useEffect(() => {
    setIdx(0);
    setRevealed(false);
    setStats({ got: 0, almost: 0, learning: 0 });
  }, [subjectFilter, chapterFilter]);

  const card = activeCards[idx];
  const done = idx >= activeCards.length;
  const total = activeCards.length;

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

      {questionsList.length === 0 ? (
        <Card className="text-center py-20 max-w-2xl mx-auto border border-dashed border-border rounded-[2.5rem]">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No flashcards available yet</h2>
          <p className="text-[color:var(--link)] text-[13px] mb-8 max-w-sm mx-auto leading-relaxed">
            Upload notes and chat with Memoria in the Workspace. Your study questions and AI answers will automatically show up here as a custom revision deck!
          </p>
          <Link to="/memo">
            <Button size="lg" className="rounded-full">Go to Study Workspace</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_260px] gap-6">
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="soft-card p-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold">
                  Subject
                </label>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-border border-border rounded-xl px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold">
                  Topic / Chapter
                </label>
                <select
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-border border-border rounded-xl px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  {chapters.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeCards.length === 0 ? (
              <Card className="text-center py-16 border border-dashed rounded-[2rem]">
                <h2 className="text-lg font-semibold mb-2">No cards matching filters</h2>
                <p className="text-[color:var(--link)] text-[13px]">
                  Try selecting a different subject or topic to practice.
                </p>
              </Card>
            ) : (
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
                  <Card className="text-center py-16 rounded-[2rem]">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 grid place-items-center mx-auto mb-4">
                      <Flame className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Session complete!</h2>
                    <p className="text-[color:var(--link)] text-[13px] mb-6">
                      You reviewed {total} cards with {accuracy}% accuracy.
                    </p>
                    <Button onClick={reset} className="rounded-full">
                      <RotateCw className="w-4 h-4" /> Start over
                    </Button>
                  </Card>
                ) : (
                  <Card className="min-h-[360px] flex flex-col justify-between rounded-[2rem]">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Badge variant="muted">Question</Badge>
                        <Badge variant="default" className="capitalize">{card.subject}</Badge>
                        <Badge variant="outline" className="capitalize">{card.chapter}</Badge>
                      </div>
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
                          className="w-full rounded-full"
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
            )}
          </div>

          <div className="space-y-4">
            <Eyebrow>Session</Eyebrow>
            {[
              { label: "Reviewed", value: reviewed },
              { label: "Accuracy", value: `${accuracy}%` },
              { label: "Streak", value: "0d" },
            ].map((s) => (
              <Card key={s.label} className="p-5 rounded-2xl">
                <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)]">
                  {s.label}
                </div>
                <div className="text-2xl font-semibold mt-1">{s.value}</div>
              </Card>
            ))}
            <Card className="p-5 rounded-2xl">
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
      )}
    </main>
  );
}
