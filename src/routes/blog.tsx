import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Sparkles, Brain, Clock, Calendar, User, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Card,
  Button,
  Eyebrow,
} from "@/components/studymind/primitives";
import { Reveal } from "@/components/studymind/primitives";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — StudyMemo" },
      {
        name: "description",
        content: "Insights on AI-driven study tools, GraphRAG, active recall, and efficient learning techniques.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-8 py-14 md:py-20 bg-[#FAF7F2]/10">
      <header className="mb-14 text-center max-w-3xl mx-auto">
        <br />
        <Eyebrow>Hackathon Spotlight</Eyebrow>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium tracking-wide mt-3 text-foreground leading-[1.15] text-balance">
          Beyond the Blank Slate: How Cognee Gave Our AI a <span className="italic text-primary">Permanent Memory</span>
        </h1>
        <p className="text-[16px] text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto">
          Standard AI is short-sighted. Here is how we built StudyMemo, an agentic study companion that maps human understanding using persistent GraphRAG memory.
        </p>

        {/* Article Metadata */}
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap text-[12.5px] text-[color:var(--link)] border-y border-border/60 py-3.5 max-w-xl mx-auto font-medium">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>The StudyMemo Team</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>July 5, 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-stone max-w-none text-[15px] text-foreground/90 leading-[1.75] space-y-8">
        
        <p className="first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:line-height-[1] clear-none">
          We watched students ask the same question three different ways in three different study sessions—and get three different answers. Standard Large Language Models (LLMs) are brilliant, but they suffer from severe "short-term memory loss." The moment your chat session ends, the model forgets your notes, your past papers, and your recurring mistakes.
        </p>

        <p>
          For the <strong>Cognee Hackathon</strong>, we set out to fix this. We built <strong>StudyMemo</strong>: a persistent-memory AI study companion that doesn't just chat, but continuously maps your learning. Here is our journey, our build, and how Cognee's cognitive graph database allowed us to solve the LLM blank-slate crisis.
        </p>

        {/* Highlight Blockquote */}
        <div className="p-6 rounded-2xl bg-white border border-border border-l-4 border-l-primary my-8">
          <p className="font-serif italic text-lg text-foreground mb-2 leading-relaxed">
            "We didn't want another chatbot wrapper that scans PDFs and spits out summaries. We wanted an engine that connects subjects, detects knowledge gaps, and gets smarter the more you study."
          </p>
          <span className="text-[11px] uppercase tracking-wider text-primary font-bold">— Dev Diary, Day 2</span>
        </div>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> How Cognee Gives AI a Permanent Memory
        </h2>
        
        <p>
          Standard vector RAG (Retrieval-Augmented Generation) splits documents into isolated text chunks, embeds them, and does a mathematical similarity search when you ask a question. This works fine for direct, simple lookups (e.g., "What is the definition of mitosis?").
        </p>
        
        <p>
          But learning isn't a list of isolated facts; it's a web of connected ideas. If you ask "How does mitosis connect to the chapter on cancer?", standard vector search fails because the links aren't written verbatim in one place.
        </p>

        <p>
          <strong>Cognee Cloud</strong> bridges this gap by creating an interconnected cognitive graph database. When a student indexes text or uploads materials:
        </p>
        
        <ul className="list-disc pl-6 space-y-2.5 my-4">
          <li><strong>Ingestion & Structuring:</strong> Cognee processes document chunks and extracts core concepts, facts, and relationships.</li>
          <li><strong>Cognify (The Graph):</strong> Instead of storing isolated vectors, Cognee links these concepts together. Nodes represent entities (e.g., "Mitosis", "Cell Division", "Apoptosis"), and edges represent relationships (e.g., "is a phase of", "leads to").</li>
          <li><strong>Hybrid GraphRAG Search:</strong> StudyMemo searches both vector embeddings (for semantic similarity) and graph paths (for relational links). This yields 100% consistent, source-cited answers that reference exact chunks.</li>
        </ul>

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto my-8 border border-border rounded-2xl bg-white">
          <table className="min-w-full divide-y divide-border text-[13.5px]">
            <thead className="bg-[#FAF7F2]/50 font-semibold text-foreground text-left">
              <tr>
                <th className="p-4">Feature</th>
                <th className="p-4">Standard Vector RAG</th>
                <th className="p-4 text-primary">Cognee GraphRAG (StudyMemo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="p-4 font-semibold text-foreground">Memory Persistence</td>
                <td className="p-4">Starts from scratch each session</td>
                <td className="p-4 text-foreground font-medium">Persistent cognitive database across chats</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground">Relational Queries</td>
                <td className="p-4">Fails when connecting disparate documents</td>
                <td className="p-4 text-foreground font-medium">Traces paths between concepts in the graph</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground">Response Consistency</td>
                <td className="p-4">High variance (different answers on repeats)</td>
                <td className="p-4 text-foreground font-medium">Locked response grounded in graph citations</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground">Weakness Tracking</td>
                <td className="p-4">Impossible without custom code layers</td>
                <td className="p-4 text-foreground font-medium">Identifies isolated/unverified graph clusters</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> The Build: Translating Graphs Into Features
        </h2>

        <p>
          We leveraged Cognee's Graph completion engine to feed four distinct views inside StudyMemo:
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">Dynamic Workspace</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Students upload notes to subject-isolated namespaces. Cognee searches using Graph Completion, Chain of Thought, or verbatim chunks.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">Interactive Graph Canvas</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                SVG rendering of the cognitive graph, showing how chapters connect, with zoom, search, and cluster detail cards.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">Auto-Generated Revision Decks</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Cognee identifies unverified or weak nodes (concepts you got wrong in chat) and compiles them into recall flashcards.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">My Dashboard</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Tracks study streaks, active materials indexings, and lists weak concepts to study before exams.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4 flex items-center gap-2">
          The Journey: Designing a Premium Student UX
        </h2>

        <p>
          Building this during the hackathon pushed us to combine high-performance database graph calls with beautiful web design. We chose a premium glassmorphic palette—earthy tones, smooth HSL transitions, outfit fonts, and soft gradients—to ensure the interface felt professional and calming rather than clinical.
        </p>
        
        <p>
          To make the experience accessible, we implemented local client fallback state managers. If a developer runs the site offline or without a Cognee Cloud API key, StudyMemo falls back to synchronized local storage schemas, allowing files, timeline logs, and card states to refresh dynamically.
        </p>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4">
          Conclusion: Memory is the Next AI Frontier
        </h2>
        
        <p>
          StudyMemo proves that giving AI a permanent, structured memory transforms it from a temporary chatbot into a true cognitive extension. Thanks to Cognee's GraphRAG engine, students can build a compound knowledge database that remembers their notes, learns from their errors, and ensures they never get a different answer twice.
        </p>

      </article>

      {/* Call to action footer */}
      <section className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row gap-6 items-center justify-between text-center sm:text-left bg-white p-8 rounded-3xl border border-border">
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">Ready to try StudyMemo?</h3>
          <p className="text-[12.5px] text-muted-foreground mt-1">Ingest your first study note and build your persistent knowledge graph.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/guide">
            <Button variant="outline" className="rounded-full text-[13px] font-semibold h-11">User Guide</Button>
          </Link>
          <Link to="/memo">
            <Button className="rounded-full text-[13px] font-semibold h-11 flex items-center gap-1.5 shadow-md">
              Start Studying <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
