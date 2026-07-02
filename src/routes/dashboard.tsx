import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, MessageSquare, BookOpen, AlertTriangle, Upload, ChevronDown, ChevronRight, ArrowRight, Sparkles, CheckCircle2, MessageCircle } from "lucide-react";
import { Card, Badge, Button, Eyebrow } from "@/components/studymind/primitives";
import { student, dashboardStats, syllabusCoverage, weakConcepts, recentActivity } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyMind" },
      { name: "description", content: "Track your streak, syllabus coverage, and weak concepts at a glance." },
    ],
  }),
  component: Dashboard,
});

const icons: Record<string, any> = { flame: Flame, message: MessageSquare, book: BookOpen, alert: AlertTriangle, upload: Upload, check: CheckCircle2 };

function Dashboard() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 md:py-14">
      <header className="mb-10">
        <Eyebrow>Dashboard</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Welcome back, {student.name} 👋</h1>
        <p className="text-[color:var(--link)] mt-2 text-[14px]">{today}</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardStats.map((s) => {
          const Icon = icons[s.icon] || Sparkles;
          return (
            <Card key={s.label} className="hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-semibold">{s.value}</div>
              <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)] mt-1">{s.label}</div>
              <div className="text-[11px] text-[color:var(--link)] mt-0.5">{s.suffix}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Eyebrow>Syllabus Coverage</Eyebrow>
              <h2 className="text-xl font-semibold">Where you stand</h2>
            </div>
            <Badge variant="muted">Updated today</Badge>
          </div>
          <div className="space-y-4">
            {syllabusCoverage.map((s) => (
              <SyllabusRow key={s.subject} row={s} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <Eyebrow>Weak Concepts</Eyebrow>
            <h2 className="text-xl font-semibold">Focus here</h2>
          </div>
          <div className="space-y-3">
            {weakConcepts.map((w) => (
              <div key={w.concept} className="p-3 rounded-xl border border-white/8 hover:border-white/15 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-[13px] font-medium">{w.concept}</div>
                  <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", w.severity === "high" ? "bg-red-400" : w.severity === "medium" ? "bg-amber-400" : "bg-emerald-400")} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[color:var(--link)]">{w.subject}</span>
                  <Link to="/revise" className="text-[11px] text-primary hover:underline">Practice this →</Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <Eyebrow>Recent Activity</Eyebrow>
            <h2 className="text-xl font-semibold">Your last few sessions</h2>
          </div>
          <div className="space-y-1">
            {recentActivity.map((a, i) => {
              const Icon = icons[a.icon] || Sparkles;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 grid place-items-center shrink-0">
                    <Icon className="w-4 h-4 text-[color:var(--link)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate">{a.title}</div>
                  </div>
                  <span className="text-[11px] text-[color:var(--link)] shrink-0">{a.time}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Eyebrow>Quick Actions</Eyebrow>
          {[
            { icon: MessageCircle, label: "Go to Memo", to: "/memo", desc: "Ask a question" },
            { icon: Upload, label: "Upload Notes", to: "/memo", desc: "Add material" },
            { icon: Sparkles, label: "Start Revision", to: "/revise", desc: "Review flashcards" },
          ].map((a) => (
            <Link key={a.label} to={a.to} className="block">
              <Card className="hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center">
                    <a.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-medium">{a.label}</div>
                    <div className="text-[11px] text-[color:var(--link)]">{a.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[color:var(--link)]" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function SyllabusRow({ row }: { row: typeof syllabusCoverage[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      <button className="w-full p-4 hover:bg-white/[0.02]" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-4">
          {open ? <ChevronDown className="w-4 h-4 text-[color:var(--link)]" /> : <ChevronRight className="w-4 h-4 text-[color:var(--link)]" />}
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium">{row.subject}</span>
              <span className="text-[12px] text-[color:var(--link)]">{row.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.pct}%` }} />
            </div>
          </div>
        </div>
      </button>
      {open && (
        <div className="border-t border-white/5 p-4 space-y-2.5 bg-white/[0.02]">
          {row.chapters.map((c) => (
            <div key={c.name}>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-[color:var(--link)]">{c.name}</span>
                <span className="text-[color:var(--link)]">{c.pct}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/70 rounded-full" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
