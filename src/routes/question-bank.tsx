import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Brain,
  ListFilter,
  Flame,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Eyebrow,
} from "@/components/studymind/primitives";
import { questions } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/studymind/Markdown";

export type GraphNode = {
  id: string;
  label: string;
  type: "student" | "subject" | "chapter" | "concept" | "mistake";
  x: number;
  y: number;
};

export const Route = createFileRoute("/question-bank")({
  head: () => ({
    meta: [
      { title: "Library — Memoria" },
      {
        name: "description",
        content:
          "Your consolidated questions library, interactive knowledge graph, and flashcard revision session.",
      },
    ],
  }),
  component: QuestionBankPage,
});

const typeStyle: Record<
  GraphNode["type"],
  { fill: string; stroke: string; label: string; r: number }
> = {
  student: { fill: "#FAF7F2", stroke: "#EA580C", label: "You", r: 28 },
  subject: { fill: "#EFF6FF", stroke: "#3B82F6", label: "Subject", r: 22 },
  chapter: { fill: "#F5F3FF", stroke: "#8B5CF6", label: "Chapter", r: 18 },
  concept: { fill: "#ECFDF5", stroke: "#10B981", label: "Concept", r: 14 },
  mistake: { fill: "#FEF2F2", stroke: "#EF4444", label: "Mistake", r: 14 },
};

interface ChatThread {
  id: string;
  title: string;
  datasetName: string;
  searchType: string;
  messages: any[];
  updatedAt: string;
}

// Helper function to wrap text in SVG to prevent overlapping
function renderWrappedText(label: string, x: number) {
  const words = label.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  
  words.forEach((word) => {
    if ((currentLine + " " + word).length > 14) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  });
  if (currentLine) {
    lines.push(currentLine.trim());
  }

  const displayLines = lines.slice(0, 3);
  return displayLines.map((line, idx) => (
    <tspan key={idx} x={x} dy={idx === 0 ? 0 : 12}>
      {line + (idx === 2 && lines.length > 3 ? "..." : "")}
    </tspan>
  ));
}

function QuestionBankPage() {
  const [activeTab, setActiveTab] = useState<"questions" | "graph" | "revise">("questions");

  // Sync tab with query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "graph" || tab === "questions" || tab === "revise") {
      setActiveTab(tab as any);
    }
  }, []);

  const handleTabChange = (tab: "questions" | "graph" | "revise") => {
    setActiveTab(tab);
    // Update URL query parameters without refreshing
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.toString());
  };

  // Shared Questions List State
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Questions library specific state
  const [subject, setSubject] = useState("All");
  const [source, setSource] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState("");

  // Knowledge Graph specific state
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<[string, string][]>([]);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [filterSelection, setFilterSelection] = useState("all");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Revision Deck specific state
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [chapterFilter, setChapterFilter] = useState("All");
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviseStats, setReviseStats] = useState({ got: 0, almost: 0, learning: 0 });

  // Load chat histories to dynamically build all three views
  useEffect(() => {
    setLoading(true);
    try {
      const savedThreads = localStorage.getItem("studymind_chat_threads");
      const localQs: any[] = [];
      const tempNodes: GraphNode[] = [];
      const tempEdges: [string, string][] = [];

      // Add "You" central node
      tempNodes.push({ id: "you", label: "You", type: "student", x: 400, y: 275 });

      if (savedThreads) {
        const threads: ChatThread[] = JSON.parse(savedThreads);
        
        // Build Questions List
        threads.forEach((t) => {
          for (let i = 0; i < t.messages.length; i++) {
            const msg = t.messages[i];
            if (msg.role === "user") {
              const nextMsg = t.messages[i + 1];
              if (nextMsg && nextMsg.role === "ai") {
                localQs.push({
                  id: `${t.id}-${i}`,
                  question: msg.text,
                  answer: nextMsg.summary || nextMsg.text,
                  subject: t.datasetName,
                  chapter: t.searchType.toLowerCase().replace(/_/g, " "),
                  source: "Study Workspace",
                  verified: !!nextMsg.verified,
                  reused: 1,
                });
              }
            }
          }
        });

        // Build Knowledge Graph
        if (Array.isArray(threads) && threads.length > 0) {
          const uniqueSubjects = Array.from(new Set(threads.map((t: any) => t.datasetName || "General")));
          
          uniqueSubjects.forEach((sub: any, sIdx) => {
            const subId = `sub-${sub.toLowerCase().replace(/\s+/g, "-")}`;
            const subAngle = uniqueSubjects.length === 1
              ? -Math.PI / 6
              : (sIdx / uniqueSubjects.length) * 2 * Math.PI;
              
            const subX = 400 + 130 * Math.cos(subAngle);
            const subY = 275 + 130 * Math.sin(subAngle);
            
            tempNodes.push({
              id: subId,
              label: sub,
              type: "subject",
              x: subX,
              y: subY
            });
            tempEdges.push(["you", subId]);

            const subThreads = threads.filter((t: any) => (t.datasetName || "General") === sub);
            
            subThreads.forEach((t: any, tIdx) => {
              const threadId = `thread-${t.id}`;
              const spreadRange = Math.PI / 2.5;
              
              const threadAngle = subThreads.length === 1
                ? subAngle + Math.PI / 6
                : subAngle + ((tIdx - (subThreads.length - 1) / 2) / (subThreads.length - 1)) * spreadRange;
                
              const threadX = subX + 90 * Math.cos(threadAngle);
              const threadY = subY + 90 * Math.sin(threadAngle);

              tempNodes.push({
                id: threadId,
                label: t.title || "Untitled Topic",
                type: "chapter",
                x: threadX,
                y: threadY
              });
              tempEdges.push([subId, threadId]);

              const Qs: any[] = [];
              for (let i = 0; i < t.messages.length; i++) {
                const msg = t.messages[i];
                if (msg.role === "user") {
                  const nextMsg = t.messages[i + 1];
                  if (nextMsg && nextMsg.role === "ai" && !nextMsg.text.startsWith("Error:")) {
                    Qs.push({
                      q: msg.text,
                      a: nextMsg.text
                    });
                  }
                }
              }

              Qs.forEach((qPair: any, qIdx) => {
                const conceptId = `concept-${t.id}-${qIdx}`;
                const conceptSpread = Math.PI / 3;
                
                const conceptAngle = Qs.length === 1
                  ? threadAngle - Math.PI / 5
                  : threadAngle + ((qIdx - (Qs.length - 1) / 2) / (Qs.length - 1)) * conceptSpread;
                  
                const conceptX = threadX + 65 * Math.cos(conceptAngle);
                const conceptY = threadY + 65 * Math.sin(conceptAngle);

                tempNodes.push({
                  id: conceptId,
                  label: qPair.q,
                  type: "concept",
                  x: conceptX,
                  y: conceptY
                });
                tempEdges.push([threadId, conceptId]);
              });
            });
          });
        }
      }

      setQuestionsList(localQs);
      setNodes(tempNodes);
      setEdges(tempEdges);
      if (tempNodes.length > 0) {
        setSelected(tempNodes[0]);
      }
    } catch (err) {
      console.error("Failed to load library resources:", err);
      setQuestionsList([]);
      setNodes([]);
      setEdges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter lists for questions library
  const subjectsOptions = useMemo(() => {
    const subs = Array.from(new Set(questionsList.map((q) => q.subject)));
    return ["All", ...subs];
  }, [questionsList]);

  const filteredQuestions = useMemo(() => {
    return questionsList.filter((q) => {
      if (subject !== "All" && q.subject !== subject) return false;
      if (source !== "All" && q.source !== source) return false;
      if (verifiedOnly && !q.verified) return false;
      if (search && !q.question.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [questionsList, subject, source, verifiedOnly, search]);

  // Knowledge Graph visible nodes/edges computation
  const visibleNodes = useMemo(() => {
    if (filterSelection === "all") return nodes;

    const selNode = nodes.find((n) => n.id === filterSelection);
    if (!selNode) return nodes;

    const idsToKeep = new Set<string>(["you", selNode.id]);

    if (selNode.type === "subject") {
      const chapterIds = edges
        .filter(([a, b]) => a === selNode.id || b === selNode.id)
        .map(([a, b]) => (a === selNode.id ? b : a));
      
      chapterIds.forEach((id) => idsToKeep.add(id));

      const conceptIds = edges
        .filter(([a, b]) => chapterIds.includes(a) || chapterIds.includes(b))
        .map(([a, b]) => (chapterIds.includes(a) ? b : a));

      conceptIds.forEach((id) => idsToKeep.add(id));
    } else if (selNode.type === "chapter") {
      const parentSubjectEdge = edges.find(
        ([a, b]) =>
          (a === selNode.id && nodes.find((n) => n.id === b)?.type === "subject") ||
          (b === selNode.id && nodes.find((n) => n.id === a)?.type === "subject")
      );
      if (parentSubjectEdge) {
        const parentId = parentSubjectEdge[0] === selNode.id ? parentSubjectEdge[1] : parentSubjectEdge[0];
        idsToKeep.add(parentId);
      }

      const conceptIds = edges
        .filter(([a, b]) => a === selNode.id || b === selNode.id)
        .map(([a, b]) => (a === selNode.id ? b : a));
      conceptIds.forEach((id) => idsToKeep.add(id));
    } else if (selNode.type === "concept") {
      const parentChapterEdge = edges.find(
        ([a, b]) =>
          (a === selNode.id && nodes.find((n) => n.id === b)?.type === "chapter") ||
          (b === selNode.id && nodes.find((n) => n.id === a)?.type === "chapter")
      );
      let parentChapterId = "";
      if (parentChapterEdge) {
        parentChapterId = parentChapterEdge[0] === selNode.id ? parentChapterEdge[1] : parentChapterEdge[0];
        idsToKeep.add(parentChapterId);
      }

      if (parentChapterId) {
        const grandparentEdge = edges.find(
          ([a, b]) =>
            (a === parentChapterId && nodes.find((n) => n.id === b)?.type === "subject") ||
            (b === parentChapterId && nodes.find((n) => n.id === a)?.type === "subject")
        );
        if (grandparentEdge) {
          const grandparentId = grandparentEdge[0] === parentChapterId ? grandparentEdge[1] : grandparentEdge[0];
          idsToKeep.add(grandparentId);
        }
      }
    }

    return nodes.filter((n) => idsToKeep.has(n.id));
  }, [nodes, edges, filterSelection]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return edges.filter(([a, b]) => visibleNodeIds.has(a) && visibleNodeIds.has(b));
  }, [edges, visibleNodeIds]);

  useEffect(() => {
    if (filterSelection !== "all") {
      const node = nodes.find((n) => n.id === filterSelection);
      if (node) {
        setSelected(node);
      }
    } else {
      if (nodes.length > 0) {
        setSelected(nodes[0]);
      }
    }
  }, [filterSelection, nodes]);

  const related = useMemo(() => {
    if (!selected) return [];
    return edges
      .filter(([a, b]) => a === selected.id || b === selected.id)
      .map(([a, b]) =>
        nodes.find((n) => n.id === (a === selected.id ? b : a))!,
      )
      .filter(Boolean);
  }, [edges, nodes, selected]);

  // Revision deck filtering & computed states
  const reviseQuestions = useMemo(() => {
    return questionsList.map((q) => ({
      id: q.id,
      q: q.question,
      a: q.answer,
      subject: q.subject,
      chapter: q.chapter,
    }));
  }, [questionsList]);

  const reviseSubjects = useMemo(() => {
    const list = Array.from(new Set(reviseQuestions.map((q) => q.subject)));
    return ["All", ...list];
  }, [reviseQuestions]);

  const reviseChapters = useMemo(() => {
    const filteredQs = subjectFilter === "All" 
      ? reviseQuestions 
      : reviseQuestions.filter((q) => q.subject === subjectFilter);
    const list = Array.from(new Set(filteredQs.map((q) => q.chapter)));
    return ["All", ...list];
  }, [reviseQuestions, subjectFilter]);

  const activeCards = useMemo(() => {
    return reviseQuestions.filter((q) => {
      if (subjectFilter !== "All" && q.subject !== subjectFilter) return false;
      if (chapterFilter !== "All" && q.chapter !== chapterFilter) return false;
      return true;
    });
  }, [reviseQuestions, subjectFilter, chapterFilter]);

  // Reset flashcards session when deck filters change
  useEffect(() => {
    setIdx(0);
    setRevealed(false);
    setReviseStats({ got: 0, almost: 0, learning: 0 });
  }, [subjectFilter, chapterFilter]);

  const card = activeCards[idx];
  const done = idx >= activeCards.length;
  const total = activeCards.length;

  const rate = (kind: "got" | "almost" | "learning") => {
    setReviseStats((s) => ({ ...s, [kind]: s[kind] + 1 }));
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  const resetRevise = () => {
    setIdx(0);
    setRevealed(false);
    setReviseStats({ got: 0, almost: 0, learning: 0 });
  };

  const reviewed = reviseStats.got + reviseStats.almost + reviseStats.learning;
  const accuracy = reviewed > 0 ? Math.round((reviseStats.got / reviewed) * 100) : 0;

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (
      (e.target as HTMLElement).tagName === "circle" ||
      (e.target as HTMLElement).tagName === "text" ||
      (e.target as HTMLElement).tagName === "tspan"
    ) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 md:py-14">
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <Eyebrow>Study Library</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mt-1">
          Your Knowledge & Questions
        </h1>
        <p className="text-[color:var(--link)] mt-2.5 text-[14.5px] leading-relaxed">
          Everything you've ever asked, generated, or structured — represented as a list, visualized inside your cognitive map, or reviewed in flashcard drills.
          {loading && (
            <span className="text-[10px] uppercase ml-2 text-primary animate-pulse font-semibold">
              (Syncing...)
            </span>
          )}
        </p>
      </header>

      {/* Modern sliding tab selector */}
      <div className="flex justify-center mb-10 overflow-x-auto max-w-full scrollbar-none pb-2">
        <div className="inline-flex p-1.5 rounded-full bg-white/50 backdrop-blur border border-[#E8E3DB] shadow-sm shrink-0">
          <button
            onClick={() => handleTabChange("questions")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] sm:text-[13.5px] font-semibold transition-all duration-300 cursor-pointer shrink-0",
              activeTab === "questions"
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                : "text-foreground/70 hover:text-foreground hover:bg-[#FAF7F2]/60"
            )}
          >
            <ListFilter className="w-4 h-4" />
            Questions Library
          </button>
          <button
            onClick={() => handleTabChange("graph")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] sm:text-[13.5px] font-semibold transition-all duration-300 cursor-pointer shrink-0",
              activeTab === "graph"
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                : "text-foreground/70 hover:text-foreground hover:bg-[#FAF7F2]/60"
            )}
          >
            <Brain className="w-4 h-4" />
            Knowledge Graph
          </button>
          <button
            onClick={() => handleTabChange("revise")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] sm:text-[13.5px] font-semibold transition-all duration-300 cursor-pointer shrink-0",
              activeTab === "revise"
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                : "text-foreground/70 hover:text-foreground hover:bg-[#FAF7F2]/60"
            )}
          >
            <RotateCw className="w-4 h-4" />
            Revision Deck
          </button>
        </div>
      </div>

      {/* QUESTIONS LIBRARY TAB */}
      {activeTab === "questions" && (
        <section className="animate-in fade-in duration-300">
          <div className="soft-card p-4 mb-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8E3DB]">
              <Search className="w-4 h-4 text-[color:var(--link)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="bg-transparent w-full text-[13px] focus:outline-none placeholder:text-[color:var(--link)]"
              />
            </div>
            <SelectPill
              label="Subject"
              value={subject}
              onChange={setSubject}
              options={subjectsOptions}
            />
            <SelectPill
              label="Source"
              value={source}
              onChange={setSource}
              options={["All", "Past Paper", "AI Generated", "Notes Upload", "Study Workspace"]}
            />
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={cn(
                "px-4 py-2 rounded-xl text-[13px] border transition flex items-center gap-2 cursor-pointer bg-white",
                verifiedOnly
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "border-[#E8E3DB] hover:border-foreground/20 text-foreground/80",
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified only
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <QCard key={q.id} q={q} />
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-20 text-[color:var(--link)]">
              No questions match your filters.
            </div>
          )}

          {filteredQuestions.length > 0 && (
            <div className="mt-10 text-center">
              <Button variant="outline">Load more</Button>
            </div>
          )}
        </section>
      )}

      {/* KNOWLEDGE GRAPH TAB */}
      {activeTab === "graph" && (
        <section className="animate-in fade-in duration-300">
          {nodes.length <= 1 ? (
            <Card className="text-center py-20 max-w-2xl mx-auto border border-dashed border-border rounded-[2.5rem] bg-white">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Knowledge Graph is empty</h2>
              <p className="text-[color:var(--link)] text-[13px] mb-8 max-w-sm mx-auto leading-relaxed">
                Upload notes and chat with Memoria in the Workspace. Your study concepts and files will automatically link together to build a visual knowledge graph!
              </p>
              <Link to="/memo">
                <Button size="lg" className="rounded-full">Go to Study Workspace</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="soft-card p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="relative">
                  <select
                    value={filterSelection}
                    onChange={(e) => setFilterSelection(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-border text-[13px] text-foreground focus:outline-none focus:border-primary/50 cursor-pointer shadow-sm hover:border-primary/30 hover:bg-[#FAF7F2] transition-all duration-300 font-medium"
                  >
                    <option value="all">All (Show Full Graph)</option>
                    {nodes.filter(n => n.type === "subject").length > 0 && (
                      <optgroup label="Subjects">
                        {nodes.filter(n => n.type === "subject").map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </optgroup>
                    )}
                    {nodes.filter(n => n.type === "chapter").length > 0 && (
                      <optgroup label="Topics & Chapters">
                        {nodes.filter(n => n.type === "chapter").map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </optgroup>
                    )}
                    {nodes.filter(n => n.type === "concept").length > 0 && (
                      <optgroup label="Concepts & Questions">
                        {nodes.filter(n => n.type === "concept").map(con => (
                          <option key={con.id} value={con.id}>{con.label}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))}
                    className="p-2 rounded-lg border border-border bg-white text-muted-foreground hover:text-foreground hover:border-primary/50 transition cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoom(z => Math.max(z - 0.15, 0.4))}
                    className="p-2 rounded-lg border border-border bg-white text-muted-foreground hover:text-foreground hover:border-primary/50 transition cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                      setFilterSelection("all");
                    }}
                    className="px-3 py-2 rounded-lg border border-border bg-white text-[12px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Reset View
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_320px] gap-4">
                <Card className="p-0 overflow-hidden bg-[#FAF7F2]/40 backdrop-blur-xl border border-border select-none relative">
                  <svg
                    viewBox="0 0 800 550"
                    className="w-full h-[500px] md:h-[600px] cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <defs>
                      <radialGradient id="bgGlow" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#EA580C" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="800" height="550" fill="url(#bgGlow)" />
                    
                    <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                      {visibleEdges.map(([a, b], i) => {
                        const na = nodes.find((n) => n.id === a)!;
                        const nb = nodes.find((n) => n.id === b)!;
                        const active = selected && (a === selected.id || b === selected.id);
                        return (
                          <line
                            key={i}
                            x1={na.x}
                            y1={na.y}
                            x2={nb.x}
                            y2={nb.y}
                            stroke={active ? "#EA580C" : "#E8E3DB"}
                            strokeWidth={active ? 1.5 : 1}
                          />
                        );
                      })}
                      {visibleNodes.map((n) => {
                        const st = typeStyle[n.type];
                        const isSel = selected && n.id === selected.id;
                        return (
                          <g
                            key={n.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(n);
                            }}
                            className="cursor-pointer"
                          >
                            <circle
                              cx={n.x}
                              cy={n.y}
                              r={st.r + (isSel ? 4 : 0)}
                              fill={st.fill}
                              stroke={st.stroke}
                              strokeWidth={isSel ? 3 : 1.5}
                              opacity={isSel ? 1 : 0.9}
                              className="transition-all duration-300"
                            />
                            <text
                              x={n.x}
                              y={n.y + st.r + 14}
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="500"
                              fill="#000000"
                              opacity="0.85"
                              className="select-none"
                            >
                              {renderWrappedText(n.label, n.x)}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                  
                  <div className="absolute bottom-4 left-4 text-[10.5px] text-muted-foreground pointer-events-none bg-white/70 backdrop-blur px-3 py-1 rounded-full border border-border">
                    Drag to pan • Use buttons to zoom
                  </div>
                </Card>

                <div className="space-y-4">
                  <Card className="bg-white">
                    <Eyebrow>Legend</Eyebrow>
                    <div className="space-y-2.5 mt-3">
                      {Object.entries(typeStyle).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-3">
                          <span
                            className="w-4 h-4 rounded-full border-2 shrink-0"
                            style={{ background: v.fill, borderColor: v.stroke }}
                          />
                          <span className="text-[12.5px] capitalize font-medium text-foreground/80">{k}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {selected && (
                    <Card className="bg-white animate-in fade-in duration-200">
                      <Eyebrow>Selected Node</Eyebrow>
                      <div className="mt-3">
                        <div className="text-base font-semibold mb-1 leading-snug">{selected.label}</div>
                        <Badge variant="muted" className="capitalize">
                          {selected.type}
                        </Badge>
                        <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[color:var(--link)] mb-2">
                          Connected to
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {related.length === 0 ? (
                            <span className="text-[12px] text-muted-foreground">No connections</span>
                          ) : (
                            related.map((n) => (
                              <button
                                key={n.id}
                                onClick={() => setSelected(n)}
                                className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-border text-[11px] hover:border-primary/50 hover:bg-white transition cursor-pointer font-medium text-foreground"
                              >
                                {n.label}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              <div className="mt-12 text-center max-w-2xl mx-auto">
                <Card className="bg-[#FAF7F2]/60 border border-border">
                  <Eyebrow>How it works</Eyebrow>
                  <h3 className="text-xl font-semibold mb-2 mt-1">
                    Your memory, mapped visually
                  </h3>
                  <p className="text-[13px] text-[color:var(--link)] leading-relaxed">
                    Every subject, chapter, concept, and mistake you've encountered becomes a node. 
                    Connections show how ideas connect across your studies, helping you identify knowledge gaps and visual clusters.
                  </p>
                </Card>
              </div>
            </div>
          )}
        </section>
      )}

      {/* REVISION DECK TAB */}
      {activeTab === "revise" && (
        <section className="animate-in fade-in duration-300">
          {reviseQuestions.length === 0 ? (
            <Card className="text-center py-20 max-w-2xl mx-auto border border-dashed border-border rounded-[2.5rem] bg-white">
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
            <div className="grid lg:grid-cols-[1fr_280px] gap-6">
              <div className="space-y-6">
                {/* Revision Deck filters */}
                <div className="soft-card p-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[10.5px] uppercase tracking-widest text-muted-foreground font-bold">
                      Subject
                    </label>
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-border rounded-xl px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                      {reviseSubjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[10.5px] uppercase tracking-widest text-muted-foreground font-bold">
                      Topic / Chapter
                    </label>
                    <select
                      value={chapterFilter}
                      onChange={(e) => setChapterFilter(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-border rounded-xl px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                      {reviseChapters.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {activeCards.length === 0 ? (
                  <Card className="text-center py-16 border border-dashed rounded-[2rem] bg-white">
                    <h2 className="text-lg font-semibold mb-2">No cards matching filters</h2>
                    <p className="text-[color:var(--link)] text-[13px]">
                      Try selecting a different subject or topic to practice.
                    </p>
                  </Card>
                ) : (
                  <div>
                    <div className="mb-4 flex items-center justify-between text-[12px] text-muted-foreground font-semibold">
                      <span>
                        Card {Math.min(idx + 1, total)} of {total}
                      </span>
                      <span>
                        {Math.round((Math.min(idx, total) / total) * 100)}% complete
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#FAF7F2] border border-border/40 rounded-full overflow-hidden mb-8">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(Math.min(idx, total) / total) * 100}%` }}
                      />
                    </div>

                    {done ? (
                      <Card className="text-center py-16 rounded-[2rem] bg-white border border-border space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 grid place-items-center mx-auto text-primary">
                          <Flame className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground">Session complete!</h2>
                        <p className="text-[13.5px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                          You reviewed **{total} cards** with **{accuracy}% accuracy** during this session.
                        </p>
                        <Button onClick={resetRevise} className="rounded-full font-semibold">
                          <RotateCw className="w-4 h-4 mr-1.5" /> Start over
                        </Button>
                      </Card>
                    ) : (
                      <Card className="min-h-[360px] flex flex-col justify-between rounded-[2.5rem] bg-white border border-border p-8 shadow-sm">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-6">
                            <Badge variant="muted">Question</Badge>
                            <Badge variant="default" className="capitalize">{card.subject}</Badge>
                            <Badge variant="outline" className="capitalize">{card.chapter}</Badge>
                          </div>
                          <div className="text-xl md:text-2xl font-serif font-medium leading-relaxed text-foreground">
                            {card.q}
                          </div>
                          {revealed && (
                            <div className="mt-8 pt-8 border-t border-border animate-in fade-in duration-300">
                              <Badge variant="primary" className="mb-4">
                                Answer
                              </Badge>
                              <div className="text-[14.5px] text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                                <Markdown text={card.a} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-8 pt-6 border-t border-border/10">
                          {!revealed ? (
                            <Button
                              className="w-full rounded-full font-semibold h-12 text-[14.5px] cursor-pointer"
                              size="lg"
                              onClick={() => setRevealed(true)}
                            >
                              Reveal Answer
                            </Button>
                          ) : (
                            <div className="grid grid-cols-3 gap-3">
                              <button
                                onClick={() => rate("learning")}
                                className="rounded-full py-3 text-[12.5px] font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition cursor-pointer"
                              >
                                Still Learning
                              </button>
                              <button
                                onClick={() => rate("almost")}
                                className="rounded-full py-3 text-[12.5px] font-semibold border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                              >
                                Almost There
                              </button>
                              <button
                                onClick={() => rate("got")}
                                className="rounded-full py-3 text-[12.5px] font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
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
                <Eyebrow>Session Stats</Eyebrow>
                {[
                  { label: "Reviewed Cards", value: reviewed },
                  { label: "Session Accuracy", value: `${accuracy}%` },
                  { label: "Active Streak", value: "14d" },
                ].map((s) => (
                  <Card key={s.label} className="p-5 rounded-2xl bg-white border border-border">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="text-2xl font-bold mt-1.5 text-foreground">{s.value}</div>
                  </Card>
                ))}
                
                <Card className="p-5 rounded-2xl bg-white border border-border">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">
                    Rating breakdown
                  </div>
                  <div className="space-y-3 text-[12.5px] font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Got It
                      </span>
                      <span className="text-foreground/75">{reviseStats.got}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Almost
                      </span>
                      <span className="text-foreground/75">{reviseStats.almost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Learning
                      </span>
                      <span className="text-foreground/75">{reviseStats.learning}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function SelectPill({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-9 py-2 rounded-xl bg-white border border-[#E8E3DB] text-[13px] focus:outline-none focus:border-primary/50 cursor-pointer hover:border-foreground/20 font-medium"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {label === "Subject" || label === "Source" ? o : `${label}: ${o}`}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--link)]" />
    </div>
  );
}

function QCard({ q }: { q: (typeof questions)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="hover:border-foreground/15 flex flex-col bg-white transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="muted">{q.subject}</Badge>
          <Badge>{q.chapter}</Badge>
          <Badge variant="default">{q.source}</Badge>
          {q.verified && (
            <Badge variant="success">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </Badge>
          )}
        </div>
        <span className="text-[11px] text-[color:var(--link)] flex items-center gap-1 shrink-0">
          <RotateCw className="w-3 h-3" /> {q.reused}×
        </span>
      </div>
      <div className="text-[14px] font-medium leading-relaxed mb-3">
        {q.question}
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="text-[12px] text-primary hover:underline self-start cursor-pointer font-semibold"
      >
        {open ? "Hide answer" : "Show answer"} {open ? "↑" : "↓"}
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-white/5 text-[13px] text-[color:var(--link)] leading-relaxed animate-in fade-in duration-200">
          <Markdown text={q.answer} />
        </div>
      )}
    </Card>
  );
}
