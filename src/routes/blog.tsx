import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import {
  Card,
  Button,
  Eyebrow,
} from "@/components/studymind/primitives";
import { Reveal } from "@/components/studymind/primitives";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Memoria" },
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
    <main className="mx-auto max-w-6xl px-5 sm:px-8 py-14 md:py-20">
      <header className="mb-14 text-center max-w-3xl mx-auto">
        <br />
        <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-wide mt-2 text-foreground">
          Ideas, insights & <span className="italic text-primary">methods</span>
        </h1>
        <p className="text-[16px] text-muted-foreground mt-4 leading-relaxed">
          Exploring the intersections of cognitive neuroscience, open-source AI databases, GraphRAG memory engines, and efficient learning design.
        </p>
      </header>

      {/* Empty State */}
      <section className="mt-10">
        <Reveal>
          <Card className="text-center py-20 max-w-2xl mx-auto border border-dashed border-border rounded-[2.5rem] bg-white">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No articles published yet</h2>
            <p className="text-[13.5px] text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
              We are currently drafting insights on GraphRAG technology, active recall systems, and cognitive memory. Check back soon!
            </p>
            <Link to="/">
              <Button size="lg" className="rounded-full">Return Home</Button>
            </Link>
          </Card>
        </Reveal>
      </section>
    </main>
  );
}
