import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Upload,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { Card, Badge, Eyebrow, Button } from "@/components/studymind/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — Memoria" },
      {
        name: "description",
        content:
          "Your chronological study activity: uploads, questions, mistakes, revisions.",
      },
    ],
  }),
  component: TimelinePage,
});

const iconMap: Record<string, any> = {
  upload: Upload,
  message: MessageSquare,
  check: CheckCircle2,
  alert: AlertTriangle,
};

function TimelinePage() {
  const [range, setRange] = useState("All Time");
  const [timelineGroups, setTimelineGroups] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedThreads = localStorage.getItem("studymind_chat_threads");
      const localGroups: any[] = [];
      const rawItems: any[] = [];

      if (savedThreads) {
        const threads = JSON.parse(savedThreads);
        if (Array.isArray(threads)) {
          threads.forEach((t: any) => {
            const threadDate = new Date(t.updatedAt || Date.now());
            const dateStr = threadDate.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = threadDate.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Create a message item for each user message in the thread
            t.messages.forEach((msg: any, i: number) => {
              if (msg.role === "user") {
                const nextMsg = t.messages[i + 1];
                rawItems.push({
                  date: dateStr,
                  time: timeStr,
                  icon: "message",
                  title: `Asked: "${msg.text.length > 50 ? msg.text.slice(0, 50) + "..." : msg.text}"`,
                  desc: nextMsg ? (nextMsg.summary || nextMsg.text.slice(0, 80) + "...") : "Waiting for response",
                  subject: t.datasetName || "General",
                  consistency: nextMsg?.verified ? "same" : "new",
                  timestamp: threadDate.getTime(),
                });
              }
            });
          });
        }
      }

      // Sort raw items by timestamp descending
      rawItems.sort((a, b) => b.timestamp - a.timestamp);

      // Group by date
      const groupsMap: Record<string, any[]> = {};
      rawItems.forEach((item) => {
        if (!groupsMap[item.date]) {
          groupsMap[item.date] = [];
        }
        groupsMap[item.date].push(item);
      });

      const formattedGroups = Object.keys(groupsMap).map((date) => ({
        date,
        items: groupsMap[date],
      }));

      setTimelineGroups(formattedGroups);
    } catch (e) {
      console.error("Failed to build timeline activity:", e);
    }
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-8 py-10 md:py-14">
      <header className="mb-8">
        <Eyebrow>Timeline</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Your study story
        </h1>
        <p className="text-[color:var(--link)] mt-2 text-[14px]">
          A chronological feed of everything you've studied, asked, and
          reviewed.
        </p>
      </header>

      {timelineGroups.length === 0 ? (
        <Card className="text-center py-20 max-w-2xl mx-auto border border-dashed border-border rounded-[2.5rem] bg-white">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 grid place-items-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No study history yet</h2>
          <p className="text-[color:var(--link)] text-[13px] mb-8 max-w-sm mx-auto leading-relaxed">
            Upload notes and chat with Memoria in the Workspace. Every study question, upload, and revision will be logged here chronologically.
          </p>
          <Link to="/memo">
            <Button size="lg" className="rounded-full">Go to Study Workspace</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 mb-8 flex-wrap">
            {["Today", "This Week", "This Month", "All Time"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-4 py-2 rounded-full text-[12px] border transition cursor-pointer",
                  range === r
                    ? "bg-primary text-white border-primary"
                    : "border-border text-[color:var(--link)] hover:border-foreground/20 bg-white hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
            {timelineGroups.map((group) => (
              <div key={group.date} className="mb-10 last:mb-0">
                <div className="pl-12 mb-4 eyebrow">{group.date}</div>
                <div className="space-y-3">
                  {group.items.map((it: any, idx: number) => {
                    const Icon = iconMap[it.icon] || Sparkles;
                    return (
                      <div key={idx} className="relative pl-12">
                        <div className="absolute left-1 top-3 w-6 h-6 rounded-full bg-white border-2 border-primary grid place-items-center">
                          <Icon className="w-3 h-3 text-primary animate-pulse" />
                        </div>
                        <Card className="p-4 bg-white border border-border">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <span className="text-[13px] font-semibold text-foreground">
                                  {it.title}
                                </span>
                                {it.consistency === "same" && (
                                  <Badge variant="muted">
                                    <RotateCw className="w-3 h-3 mr-1" /> Same as
                                    before
                                  </Badge>
                                )}
                                {it.consistency === "new" && (
                                  <Badge variant="primary">
                                    <Sparkles className="w-3 h-3 mr-1" /> New
                                  </Badge>
                                )}
                              </div>
                              <div className="text-[12.5px] text-muted-foreground leading-relaxed">
                                {it.desc}
                              </div>
                              <div className="mt-2.5 flex items-center gap-2">
                                <Badge variant="default" className="capitalize">{it.subject}</Badge>
                                <span className="text-[11px] text-muted-foreground font-semibold">
                                  {it.time}
                                </span>
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
        </>
      )}
    </main>
  );
}
