import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, MessageSquare, CheckCircle2, AlertTriangle, RotateCw, Sparkles } from "lucide-react";
import { Card, Badge, Eyebrow } from "@/components/studymind/primitives";
import { timelineItems } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — StudyMind" },
      { name: "description", content: "Your chronological study activity: uploads, questions, mistakes, revisions." },
    ],
  }),
  component: TimelinePage,
});

const iconMap: Record<string, any> = { upload: Upload, message: MessageSquare, check: CheckCircle2, alert: AlertTriangle };

function TimelinePage() {
  const [range, setRange] = useState("All Time");

  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-8 py-10 md:py-14">
      <header className="mb-8">
        <Eyebrow>Timeline</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Your study story</h1>
        <p className="text-[color:var(--link)] mt-2 text-[14px]">A chronological feed of everything you've studied, asked, and reviewed.</p>
      </header>

      <div className="flex gap-2 mb-8 flex-wrap">
        {["Today", "This Week", "This Month", "All Time"].map((r) => (
          <button key={r} onClick={() => setRange(r)} className={cn("px-4 py-2 rounded-full text-[12px] border transition", range === r ? "bg-primary text-white border-primary" : "border-white/10 text-[color:var(--link)] hover:border-white/25 hover:text-foreground")}>{r}</button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10" />
        {timelineItems.map((group) => (
          <div key={group.date} className="mb-10 last:mb-0">
            <div className="pl-12 mb-4 eyebrow">{group.date}</div>
            <div className="space-y-3">
              {group.items.map((it, idx) => {
                const Icon = iconMap[it.icon] || Sparkles;
                return (
                  <div key={idx} className="relative pl-12">
                    <div className="absolute left-1 top-3 w-6 h-6 rounded-full bg-background border-2 border-primary grid place-items-center">
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <Card className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="text-[13px] font-medium">{it.title}</span>
                            {"consistency" in it && it.consistency === "same" && <Badge variant="muted"><RotateCw className="w-3 h-3" /> Same as before</Badge>}
                            {"consistency" in it && it.consistency === "new" && <Badge variant="primary"><Sparkles className="w-3 h-3" /> New</Badge>}
                          </div>
                          <div className="text-[12px] text-[color:var(--link)]">{it.desc}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="default">{it.subject}</Badge>
                            <span className="text-[11px] text-[color:var(--link)]">{it.time}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
