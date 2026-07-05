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
          It started with a frustrating moment. A friend of mine—pre-med, studying for her anatomy exam—was chatting with an AI assistant to help her understand cardiac output. She asked the same question three days in a row, phrased slightly differently each time. Three different answers. Not wildly wrong, but inconsistent enough to confuse her. She came to me and said, "I don't know what to believe anymore." And honestly? That hit me. Here we are in 2026, with the most powerful language models ever built, and a student can't trust her study tool to give her the same answer twice.
        </p>

        <p>
          That's the problem we wanted to solve at the <strong>Cognee Hackathon</strong>. Not "build another AI chatbot." Not "make a prettier study app." We wanted to fix the thing that makes AI fundamentally broken for learning: it has no memory. Every session starts from zero. Your notes? Gone. Your past mistakes? Forgotten. Your syllabus? A stranger. It's like having a brilliant tutor who develops amnesia overnight, every night.
        </p>

        <p>
          So we built <strong>StudyMemo</strong>. And Cognee made it possible in ways I genuinely didn't expect.
        </p>

        {/* Highlight Blockquote */}
        <div className="p-6 rounded-2xl bg-white border border-border border-l-4 border-l-primary my-8">
          <p className="font-serif italic text-lg text-foreground mb-2 leading-relaxed">
            "We didn't want another chatbot wrapper that scans PDFs and spits out summaries. We wanted something that actually thinks about how concepts relate to each other — something that gets smarter the more you use it."
          </p>
          <span className="text-[11px] uppercase tracking-wider text-primary font-bold">— Dev Diary, Day 2, sometime around 2am</span>
        </div>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> Why Normal AI Fails Learners (And Why Nobody Talks About It)
        </h2>
        
        <p>
          Here's what most people don't realize about how AI answers questions today. When you upload a PDF and ask something, the system chops your document into tiny chunks, converts them into numerical vectors, and when you ask a question, it finds the chunks that are mathematically "close" to your question. That's vector RAG — retrieval-augmented generation — and it works surprisingly well for simple lookups.
        </p>
        
        <p>
          Ask "What is the definition of mitosis?" and it'll nail it. Every time.
        </p>

        <p>
          But ask "How does what I learned in Chapter 3 about cell division connect to what Chapter 9 says about tumor growth?" — and it breaks. Completely. Because the link between those two ideas doesn't exist as a written sentence anywhere in your textbook. It lives <em>between</em> the facts, in the relational web of concepts. Standard vector search has no way to navigate that web. It just... can't.
        </p>

        <p>
          What I've noticed is that this is exactly where students struggle most. Not with individual facts — with connections. With the "why does this matter?" and "how does this fit with what I already know?" That's where learning actually happens. And that's precisely what AI was leaving on the table.
        </p>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> Enter Cognee: This Is Where It Gets Genuinely Cool
        </h2>

        <p>
          When we discovered Cognee, my first reaction was something like — okay, this is different. Cognee doesn't just store your text. It <em>understands</em> the structure of it. When you feed it a document, it builds a cognitive graph: nodes for every meaningful entity (think: "Mitosis", "G1 Phase", "Tumor Suppressor Gene"), and edges that represent the relationships between them ("is triggered by", "inhibits", "leads to").
        </p>
        
        <p>
          It's the difference between a filing cabinet and an actual brain. The filing cabinet stores stuff. The brain connects stuff.
        </p>

        <p>
          Concretely, here's how it flows inside StudyMemo when a student uploads their biology notes:
        </p>
        
        <ul className="list-disc pl-6 space-y-2.5 my-4">
          <li><strong>Ingestion & Structuring:</strong> Cognee processes the document and extracts concepts, named entities, and factual relationships — not just keywords, but actual semantic links.</li>
          <li><strong>Cognify (Graph Building):</strong> Those extracted entities become nodes in a live knowledge graph. "Apoptosis leads to cell death" isn't a loose sentence floating in a vector space — it's a typed, directional edge between two nodes. The graph grows with every file you add.</li>
          <li><strong>Hybrid GraphRAG Search:</strong> When a student asks a question, StudyMemo searches <em>both</em> the vector embeddings (for semantic closeness) and the graph paths (for relational reasoning). The answers are grounded, cited, and — critically — <strong>consistent</strong>. Ask the same question tomorrow and you'll get the same answer, because it's reading from the same structured graph, not rolling the dice on similarity scores.</li>
        </ul>

        <p>
          Honestly, watching it work for the first time in our dev environment was a bit of a "wait, is this real?" moment. We asked it to connect two concepts from different uploaded chapters and it traced a path through the graph, citing intermediate nodes we hadn't even directly asked about. That's not a chatbot. That's a thinking tool.
        </p>

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
                <td className="p-4">Starts from scratch every session</td>
                <td className="p-4 text-foreground font-medium">Persistent knowledge graph that compounds over time</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground">Cross-Topic Reasoning</td>
                <td className="p-4">Fails when ideas span multiple documents</td>
                <td className="p-4 text-foreground font-medium">Traces relational paths through the graph</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground">Answer Consistency</td>
                <td className="p-4">Changes based on phrasing, session, context</td>
                <td className="p-4 text-foreground font-medium">Grounded in the same graph — same answer, every time</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground">Weakness Detection</td>
                <td className="p-4">No concept of what you've gotten wrong before</td>
                <td className="p-4 text-foreground font-medium">Flags unverified or low-confidence graph nodes automatically</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> What We Actually Built (And the Decisions Behind It)
        </h2>

        <p>
          We had about 48 hours. So the first decision was ruthless prioritization: what features actually matter to a student under exam pressure? We sketched it out on a whiteboard and landed on four pillars. Every one of them is powered by the Cognee graph underneath.
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">The Workspace — Your AI Study Partner</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Upload your PDFs, paste raw notes, create subject spaces. Then just ask questions. Cognee routes each query through Graph Completion, Chain-of-Thought, or direct chunk retrieval depending on complexity. The AI knows which chapter you uploaded last week and cross-references it without being told to.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">The Knowledge Graph — See Your Brain</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                One of my favourite parts. The graph canvas renders every concept as a node, every relationship as an edge. Students can zoom in, search specific topics, and click nodes to see what connects. It's genuinely surprising how much you understand your own subject better when you can <em>see</em> how the ideas link.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">Revision Decks — Target Your Weak Spots</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                This one required some clever Cognee graph querying. Whenever the AI's response to a student's question is "unverified" — meaning there wasn't a confident path through the graph — that concept gets flagged. The revision deck pulls exactly those flagged nodes and builds active recall flashcards from them. You study your actual gaps, not random topics.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-white flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-[14.5px] mb-1">My Dashboard — Your Progress, Actually Tracked</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Study streak, questions asked, topics covered, weak concepts — all computed dynamically from your real activity. Not placeholder numbers. Not dummy data. If you haven't studied today, your streak breaks. If you uploaded three chapters last week, your syllabus coverage reflects it.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4 flex items-center gap-2">
          The UX We Obsessed Over (Because Design Matters)
        </h2>

        <p>
          Here's something I feel strongly about: a tool that's technically brilliant but visually painful will get abandoned. Students are already stressed. If your app adds cognitive friction on top of academic pressure, they'll just go back to their highlighters.
        </p>

        <p>
          So we were deliberate about the design. Earthy tones — warm creams, muted terracotta, soft slate — because they're easier on the eyes during long sessions than the harsh blue-whites most productivity apps default to. Serif typography for the reading content, because it genuinely reads better at length. Micro-animations that feel responsive without being distracting. The entire thing was built to feel like a premium notebook, not a dashboard.
        </p>
        
        <p>
          We also had to think about the offline experience. Not every student has a Cognee API key ready to go. So we built a full local fallback system — all subject spaces, uploaded files, chat threads, and activity logs persist in structured local storage even without the cloud backend. The dashboard still shows your real data. The timeline still logs your sessions. This wasn't a compromise; it was a feature decision.
        </p>

        <h2 className="text-2xl font-serif font-medium text-foreground mt-10 mb-4">
          What This Hackathon Taught Me About AI's Biggest Missing Piece
        </h2>
        
        <p>
          I came away from this build with a fairly strong conviction: the future of useful AI isn't more intelligence — it's better memory. We already have models that can reason, write, and explain at a remarkably high level. The gap is that they don't <em>remember</em>. Not really. Not in the structured, relational way that actually matters for learning and problem-solving.
        </p>

        <p>
          Cognee addresses that in a way I haven't seen elsewhere. It's not just storing your data — it's building a model of how your knowledge is structured. That's a fundamentally different thing. And the implications go way beyond studying. Think about a doctor who wants an AI that remembers every patient case it's ever helped with, and can reason across them. Or an engineer who wants an AI that knows the full history and architecture of a codebase without being re-briefed every session. Memory isn't just a nice-to-have. It's the thing that turns AI from a useful toy into a genuine collaborator.
        </p>

        <p>
          Building StudyMemo was our small attempt to show what that looks like in practice. We're proud of it. And we're excited to keep pushing it further.
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
