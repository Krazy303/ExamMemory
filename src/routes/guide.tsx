import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { BookOpen, Compass, Key, Brain, Sparkles, CheckCircle2, ChevronRight, Database, Cpu, Sliders } from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Eyebrow,
} from "@/components/studymind/primitives";
import { Reveal } from "@/components/studymind/primitives";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "User Guide — Memoria" },
      {
        name: "description",
        content: "Learn how to get the most out of your persistent-memory AI study companion.",
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const steps = [
    {
      title: "1. Index Study Material",
      desc: "Upload PDFs, Word documents, PowerPoint slides, or text files directly into Memoria. Cognee Cloud processes your notes into an interconnected semantic network.",
      icon: Compass,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: "2. Ask grounding queries",
      desc: "Type questions inside the chat. Every answer is retrieved using hybrid GraphRAG (semantic vector search and memory graph paths), ensuring zero hallucinations.",
      icon: Brain,
      gradient: "from-purple-500/20 to-fuchsia-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: "3. Targeted revisions",
      desc: "Memoria automatically converts your mistakes and weakest concepts into active revision cards. Test yourself regularly to optimize long-term retention.",
      icon: Sparkles,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
    },
  ];

  const faqs = [
    {
      q: "What makes Memoria different from standard ChatGPT or PDFs chats?",
      a: "Standard LLMs have short-term memory limits and forget context once a session ends. Memoria runs a persistent cognitive database (powered by Cognee GraphRAG) that links topics across all of your chats.",
    },
    {
      q: "Which file formats are supported?",
      a: "We support PDF (.pdf), Microsoft Word (.docx, .doc), PowerPoint (.pptx, .ppt), Markdown (.md), Text (.txt), and basic images (.png, .jpg).",
    },
    {
      q: "How does the Knowledge Graph visualize my learning?",
      a: "Every subject you upload, chapter you query, and mistake you make is mapped as an interconnected SVG node. Radial layouts show cluster densities so you can identify weak topics.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8 py-14 md:py-20">
      <header className="mb-14 text-center max-w-3xl mx-auto">
        <br />
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-wide mt-2 text-foreground">
          How to study with <span className="italic text-primary">Memoria</span>
        </h1>
        <p className="text-[16px] text-muted-foreground mt-4 leading-relaxed">
          Walkthroughs, best practices, and answers to help you organize your study workspace and build persistent cognitive graph memory.
        </p>
      </header>

      {/* Guide Steps */}
      <section className="mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 100}>
                <div className="group relative h-full">
                  <div className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
                  <Card className="relative h-full flex flex-col p-8 bg-white border border-border shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 rounded-[2rem]">
                    <div className="relative mb-6">
                      <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center bg-gradient-to-br ${s.gradient} border border-white/50 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-6 h-6 ${s.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-serif font-medium tracking-wide mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                      {s.title}
                    </h3>
                    <p className="text-[14.5px] text-muted-foreground leading-relaxed flex-1">
                      {s.desc}
                    </p>
                  </Card>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Advanced Chatbot Guide */}
      <section id="search-types" className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="primary" className="mb-2">Advanced Workspace Guide</Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-wide text-foreground">
            Mastering the Chat Console
          </h2>
          <p className="text-[14.5px] text-muted-foreground mt-2 leading-relaxed">
            Every feature, control, and option inside your Memoria study workspace explained in detail.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Column 1: Retrieval & Length Controls */}
          <div className="space-y-6">
            <Card className="p-8 h-full flex flex-col justify-between rounded-[2rem]">
              <div>
                <h3 className="text-xl font-serif font-medium text-foreground mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" /> Cognitive Search Types
                </h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-6">
                  Memoria lets you select the exact search algorithm used to scan your notes. Change this option in the sidebar to match your query type:
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      name: "Graph Completion (Default)",
                      desc: "Uses Cognee's semantic network to trace links between subjects and chapters. Best for explaining 'how' concepts relate.",
                    },
                    {
                      name: "RAG Completion",
                      desc: "Searches vector databases to find raw document chunks containing exact word overlaps. Best for direct lookups.",
                    },
                    {
                      name: "Chain of Thought Graph",
                      desc: "Instructs the AI to output its multi-step reasoning pathway before retrieving nodes. Best for complex calculations.",
                    },
                    {
                      name: "Verbatim Text Chunks",
                      desc: "Returns exact, unchanged excerpts and source quotes from your notes without AI rewrites.",
                    },
                    {
                      name: "Feeling Lucky (Auto)",
                      desc: "Delegates your prompt to the AI router, which automatically selects standard RAG or Graph traversal.",
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="border-b border-border pb-3.5 last:border-0 last:pb-0">
                      <strong className="text-[14px] text-foreground block mb-0.5">{item.name}</strong>
                      <span className="text-[12.5px] text-muted-foreground leading-relaxed">{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Column 2: Dataset Namespaces & Output Length */}
          <div className="space-y-6 flex flex-col justify-between">
            <Card className="p-8 flex-1 mb-6 rounded-[2rem]">
              <h3 className="text-xl font-serif font-medium text-foreground mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Memory Datasets (Namespaces)
              </h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">
                Keep different subjects isolated! Memoria namespaces act as database partitions:
              </p>
              <ul className="space-y-3.5 text-[12.5px] text-muted-foreground leading-relaxed">
                <li>
                  <strong className="text-foreground block mb-0.5">Creating Subjects</strong> Click "+ Create Subject" to make a new memory container (e.g., "Physics 101", "History Exam"). Upload files directly to this subject to build separate graphs.
                </li>
                <li>
                  <strong className="text-foreground block mb-0.5">Isolating Context</strong> When chatting, only the active subject's notes are scanned. This prevents ideas from different courses from crossing over.
                </li>
                <li>
                  <strong className="text-foreground block mb-0.5">Deleting Subjects</strong> If you no longer need a course dataset, select it and click "Delete Active Subject" to wipe its vector index and graphs.
                </li>
              </ul>
            </Card>

            <Card className="p-8 flex-1 rounded-[2rem]">
              <h3 className="text-xl font-serif font-medium text-foreground mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" /> Workspace Toggles & History
              </h3>
              <ul className="space-y-3.5 text-[12.5px] text-muted-foreground leading-relaxed">
                <li>
                  <strong className="text-foreground block mb-0.5">Response Length</strong> Toggle between **Short** (concise summary bullets), **Auto** (standard balanced responses), and **Long** (comprehensive explanations) directly above the chat box.
                </li>
                <li>
                  <strong className="text-foreground block mb-0.5">Document Viewer</strong> Click "Indexed Files" in the sidebar to review active files. Ensure your files are listed there to verify they've been successfully parsed by Cognee.
                </li>
                <li>
                  <strong className="text-foreground block mb-0.5">Chat History (Threads)</strong> Past sessions are saved to local storage. You can rename threads, swap between sessions to load past messages, or delete sessions when finished.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 border-y border-border bg-[#FAF7F2]/40 rounded-[3.5rem] px-8 md:px-14 mb-20">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div>
            <Eyebrow>Study tips</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-wide mt-2 text-foreground mb-6 leading-tight">
              Best practices for active recall
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
              Memoria is designed around cognitive retention. To maximize your study efficiency, we recommend following these methods:
            </p>
            <Link to="/memo">
              <Button className="rounded-full">
                Enter Study Workspace <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Keep your datasets structured",
                desc: "Choose clear dataset names (e.g. 'Intro to Biology' rather than 'draft1') so Cognee maps relationships cleanly.",
              },
              {
                title: "Review flagged cards daily",
                desc: "The Revision Queue automatically flags questions you get wrong. A quick 5-minute review session consolidates memory pathways.",
              },
              {
                title: "Examine the Knowledge Graph",
                desc: "Check node sizes and connected lines. Larger clusters of mistake nodes show chapters that require review before exams.",
              },
            ].map((tip, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white/60 rounded-2xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[15px] text-foreground mb-1">{tip.title}</h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-serif font-medium tracking-wide text-center mb-10 text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <Card key={i} className="p-6 rounded-2xl">
              <h3 className="font-semibold text-[15px] text-foreground mb-3 flex items-start gap-2">
                <span className="text-primary font-serif">Q.</span> {faq.q}
              </h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed pl-5">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
