import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, ChevronDown, CheckCircle2, RotateCw } from "lucide-react";
import { Card, Badge, Button, Eyebrow } from "@/components/studymind/primitives";
import { questions, subjects } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/question-bank")({
  head: () => ({
    meta: [
      { title: "Question Bank — StudyMind" },
      { name: "description", content: "Every question you've asked or generated, cited and reusable." },
    ],
  }),
  component: QuestionBankPage,
});

function QuestionBankPage() {
  const [subject, setSubject] = useState("All");
  const [source, setSource] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (subject !== "All" && q.subject !== subject) return false;
      if (source !== "All" && q.source !== source) return false;
      if (verifiedOnly && !q.verified) return false;
      if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [subject, source, verifiedOnly, search]);

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 md:py-14">
      <header className="mb-8">
        <Eyebrow>Question Bank</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Your library of questions</h1>
        <p className="text-[color:var(--link)] mt-2 text-[14px] max-w-xl">Everything you've ever asked, generated, or pulled from past papers — cited and searchable.</p>
      </header>

      <div className="soft-card p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <Search className="w-4 h-4 text-[color:var(--link)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="bg-transparent w-full text-[13px] focus:outline-none placeholder:text-[color:var(--link)]" />
        </div>
        <SelectPill label="Subject" value={subject} onChange={setSubject} options={["All", ...subjects.map((s) => s.name)]} />
        <SelectPill label="Source" value={source} onChange={setSource} options={["All", "Past Paper", "AI Generated", "Notes Upload"]} />
        <button onClick={() => setVerifiedOnly(!verifiedOnly)} className={cn("px-4 py-2 rounded-xl text-[13px] border transition flex items-center gap-2", verifiedOnly ? "bg-primary/20 border-primary/50" : "border-white/10 hover:border-white/25")}>
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified only
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((q) => <QCard key={q.id} q={q} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[color:var(--link)]">No questions match your filters.</div>
      )}

      <div className="mt-10 text-center">
        <Button variant="outline">Load more</Button>
      </div>
    </main>
  );
}

function SelectPill({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none pl-3 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 text-[13px] focus:outline-none focus:border-primary/50">
        {options.map((o) => <option key={o} value={o}>{label === "Subject" || label === "Source" ? o : `${label}: ${o}`}</option>)}
      </select>
      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--link)]" />
    </div>
  );
}

function QCard({ q }: { q: typeof questions[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="hover:border-white/15 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="muted">{q.subject}</Badge>
          <Badge>{q.chapter}</Badge>
          <Badge variant="default">{q.source}</Badge>
          {q.verified && <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Verified</Badge>}
        </div>
        <span className="text-[11px] text-[color:var(--link)] flex items-center gap-1 shrink-0"><RotateCw className="w-3 h-3" /> {q.reused}×</span>
      </div>
      <div className="text-[14px] font-medium leading-relaxed mb-3">{q.question}</div>
      <button onClick={() => setOpen(!open)} className="text-[12px] text-primary hover:underline self-start">
        {open ? "Hide answer" : "Show answer"} {open ? "↑" : "↓"}
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-white/5 text-[13px] text-[color:var(--link)] leading-relaxed whitespace-pre-wrap">{q.answer}</div>
      )}
    </Card>
  );
}
