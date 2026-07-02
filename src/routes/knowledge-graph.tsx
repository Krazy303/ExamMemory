import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, ChevronDown } from "lucide-react";
import { Card, Badge, Eyebrow, SectionHeading } from "@/components/studymind/primitives";
import { graphNodes, graphEdges, type GraphNode } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge-graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph — StudyMind" },
      { name: "description", content: "See how every concept, chapter and mistake connects in your personal knowledge graph." },
    ],
  }),
  component: KGPage,
});

const typeStyle: Record<GraphNode["type"], { fill: string; stroke: string; label: string; r: number }> = {
  student: { fill: "#0000EE", stroke: "#ffffff", label: "You", r: 28 },
  subject: { fill: "#0000EE", stroke: "#0000EE", label: "Subject", r: 22 },
  chapter: { fill: "#1a1a3a", stroke: "#0000EE", label: "Chapter", r: 18 },
  concept: { fill: "#0a0a1a", stroke: "#9BA9C4", label: "Concept", r: 14 },
  mistake: { fill: "#3a0a0a", stroke: "#ef4444", label: "Mistake", r: 14 },
};

function KGPage() {
  const [selected, setSelected] = useState<GraphNode>(graphNodes.find((n) => n.id === "entropy")!);
  const [subject, setSubject] = useState("All");

  const related = graphEdges
    .filter(([a, b]) => a === selected.id || b === selected.id)
    .map(([a, b]) => graphNodes.find((n) => n.id === (a === selected.id ? b : a))!)
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 md:py-14">
      <header className="mb-8">
        <Eyebrow>Knowledge Graph</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Your mind, mapped</h1>
        <p className="text-[color:var(--link)] mt-2 text-[14px] max-w-xl">Every concept you study becomes a node. Watch chapters link and mistakes cluster.</p>
      </header>

      <div className="soft-card p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-white/5 border border-white/10 text-[13px] focus:outline-none">
            <option>All</option><option>Physics</option><option>Chemistry</option><option>Biology</option><option>Mathematics</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--link)]" />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-white/10 hover:border-white/25"><ZoomIn className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg border border-white/10 hover:border-white/25"><ZoomOut className="w-4 h-4" /></button>
          <button className="px-3 py-2 rounded-lg border border-white/10 text-[12px] hover:border-white/25 flex items-center gap-1.5"><RotateCw className="w-3.5 h-3.5" /> Reset View</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <Card className="p-0 overflow-hidden">
          <svg viewBox="0 0 800 550" className="w-full h-[500px] md:h-[600px]">
            <defs>
              <radialGradient id="bgGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#0000EE" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0000EE" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="550" fill="url(#bgGlow)" />
            {graphEdges.map(([a, b], i) => {
              const na = graphNodes.find((n) => n.id === a)!;
              const nb = graphNodes.find((n) => n.id === b)!;
              const active = a === selected.id || b === selected.id;
              return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={active ? "#0000EE" : "rgba(255,255,255,0.12)"} strokeWidth={active ? 1.5 : 1} />;
            })}
            {graphNodes.map((n) => {
              const st = typeStyle[n.type];
              const isSel = n.id === selected.id;
              return (
                <g key={n.id} onClick={() => setSelected(n)} className="cursor-pointer">
                  <circle cx={n.x} cy={n.y} r={st.r + (isSel ? 4 : 0)} fill={st.fill} stroke={st.stroke} strokeWidth={isSel ? 3 : 1.5} opacity={isSel ? 1 : 0.9} className="transition-all" />
                  <text x={n.x} y={n.y + st.r + 14} textAnchor="middle" fontSize="10" fill="#ffffff" opacity="0.85">{n.label}</text>
                </g>
              );
            })}
          </svg>
        </Card>

        <div className="space-y-4">
          <Card>
            <Eyebrow>Legend</Eyebrow>
            <div className="space-y-2.5 mt-3">
              {Object.entries(typeStyle).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full border-2 shrink-0" style={{ background: v.fill, borderColor: v.stroke }} />
                  <span className="text-[12px] capitalize">{k}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Eyebrow>Selected Node</Eyebrow>
            <div className="mt-3">
              <div className="text-lg font-semibold mb-1">{selected.label}</div>
              <Badge variant="muted" className="capitalize">{selected.type}</Badge>
              <div className="mt-4 text-[11px] uppercase tracking-widest text-[color:var(--link)] mb-2">Connected to</div>
              <div className="flex flex-wrap gap-1.5">
                {related.map((n) => (
                  <button key={n.id} onClick={() => setSelected(n)} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] hover:border-white/25">{n.label}</button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <Card className="text-center max-w-2xl mx-auto">
          <Eyebrow>What am I looking at?</Eyebrow>
          <h3 className="text-2xl font-semibold mb-3">The graph is your memory, made visible</h3>
          <p className="text-[13px] text-[color:var(--link)] leading-relaxed">Every subject, chapter, concept, and mistake you've encountered becomes a node. Edges show how ideas connect across your studies — so you can spot gaps and clusters at a glance.</p>
        </Card>
      </div>
    </main>
  );
}
