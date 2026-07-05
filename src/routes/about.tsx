import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Anchor, Heart, Brain, ArrowRight, Linkedin } from "lucide-react";
import {
  Card,
  Button,
  Eyebrow,
  SectionHeading,
  Reveal,
} from "@/components/studymind/primitives";
import { team, values } from "@/data/mock";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Memoria" },
      {
        name: "description",
        content: "Giving every student an AI that actually remembers them.",
      },
    ],
  }),
  component: About,
});

const valueIcons: Record<string, any> = {
  shield: Shield,
  anchor: Anchor,
  heart: Heart,
  brain: Brain,
};

function About() {
  return (
    <main className="overflow-hidden">
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[160px]" />
        </div>
        <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <Reveal>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
              Giving every student an AI that{" "}
              <span className="italic font-light text-[color:var(--link)]">
                actually remembers
              </span>{" "}
              them.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <Reveal>
            <div>
              <Eyebrow>Our story</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 leading-tight">
                Built because AI kept forgetting us.
              </h2>
              <p className="text-[color:var(--link)] leading-relaxed mb-4 text-[14px]">
                We watched students ask the same question three different ways
                in three different sessions — and get three different answers.
                Confidence dropped. Trust broke.
              </p>
              <p className="text-[color:var(--link)] leading-relaxed text-[14px]">
                Memoria is our fix: a companion built around persistent
                memory, so every answer is grounded, consistent, and tied to
                your own material. No more restarting from zero every session.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="soft-card p-2">
              <img
                src="images/image1.png"
                alt="Students learning"
                className="w-full aspect-square object-cover rounded-2xl"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#FAF7F2]/50 border-y border-border relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Our Technology"
              title="Powered by Cognee GraphRAG"
              center
            />
          </Reveal>
          
          <div className="mt-6 text-center max-w-3xl mx-auto mb-16">
            <p className="text-[16px] text-muted-foreground leading-relaxed">
              Standard AI systems suffer from "short-term memory loss." They treat every prompt as a blank slate. Memoria uses Cognee's open-source cognitive memory engine to build a structured, long-term memory graph directly grounded in your study files.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Extract & Ingest",
                desc: "When you upload files (PDFs, docs, text), Cognee ingests them, extracting core concepts, facts, and relationships while keeping them securely tied to your profile.",
                gradient: "from-blue-500/20 to-cyan-500/20",
                bgHover: "hover:bg-blue-50/50",
              },
              {
                title: "2. Cognify (Knowledge Graph)",
                desc: "Instead of treating notes as isolated snippets, Cognee links them into an interconnected semantic graph. It maps how formulas, definitions, and topics relate.",
                gradient: "from-purple-500/20 to-fuchsia-500/20",
                bgHover: "hover:bg-purple-50/50",
              },
              {
                title: "3. Hybrid GraphRAG",
                desc: "Memoria searches both vector embeddings (for semantic text similarity) and graph paths (for complex relationships), delivering 100% consistent, source-cited answers.",
                gradient: "from-emerald-500/20 to-teal-500/20",
                bgHover: "hover:bg-emerald-50/50",
              }
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 150}>
                <div className="group relative h-full">
                  <div className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
                  
                  <Card className={`relative h-full flex flex-col p-8 bg-white/80 backdrop-blur-xl border border-[#E8E3DB] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] ${card.bgHover}`}>
                    <h3 className="text-xl font-serif font-medium tracking-wide mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed flex-1">
                      {card.desc}
                    </p>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="mt-14 text-center">
              <a
                href="https://docs.cognee.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Read Cognee Documentation <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="The team"
              title="The people behind Memoria"
              center
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {team.map((m, i) => {
              const avatarUrl = m.linkedin
                ? `https://unavatar.io/linkedin/${m.linkedin}`
                : m.avatar;

              return (
                <Reveal key={m.name} delay={i * 80}>
                  <div className="group relative h-full">
                    <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-primary/15 to-purple-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                    <Card className="relative h-full text-center p-8 bg-white/80 backdrop-blur-xl border border-[#E8E3DB] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 rounded-[2rem] flex flex-col items-center">
                      <img
                        src={avatarUrl}
                        alt={m.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border border-white/50 shadow-md group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to static avatar if unavatar fetch fails
                          (e.target as HTMLImageElement).src = m.avatar;
                        }}
                      />
                      <div className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{m.name}</div>
                      <div className="text-[11px] uppercase tracking-widest text-primary/70 mt-1 font-semibold">
                        {m.role}
                      </div>
                      <div className="text-[13px] text-muted-foreground mt-3 leading-relaxed flex-1">
                        {m.bio}
                      </div>
                      {m.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${m.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
                          aria-label={`${m.name}'s LinkedIn Profile`}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </Card>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Our values"
              title="What we hold onto"
              center
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = valueIcons[v.icon] || Brain;
              const gradients = [
                "from-blue-500/15 to-indigo-500/15",
                "from-emerald-500/15 to-teal-500/15",
                "from-purple-500/15 to-fuchsia-500/15",
                "from-rose-500/15 to-orange-500/15",
              ];
              const textColors = [
                "text-blue-500",
                "text-emerald-500",
                "text-purple-500",
                "text-rose-500",
              ];
              const currentGradient = gradients[i % gradients.length];
              const currentTextColor = textColors[i % textColors.length];

              return (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="group relative h-full">
                    <div className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br ${currentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

                    <Card className="relative h-full p-8 bg-white/80 backdrop-blur-xl border border-[#E8E3DB] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 rounded-[2rem] flex flex-col">
                      <div className={`w-12 h-12 rounded-[1rem] bg-gradient-to-br ${currentGradient} border border-white/50 shadow-inner grid place-items-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-5 h-5 ${currentTextColor}`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{v.title}</h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">
                        {v.desc}
                      </p>
                    </Card>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-20 text-center bg-gradient-to-br from-primary via-primary to-[#0000AA]">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,white,transparent_50%)]" />
              <div className="relative">
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 max-w-3xl mx-auto">
                  Join the students who don't restart from zero.
                </h2>
                <Link to="/sign-up">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-7 py-4 font-medium hover:brightness-95 transition-all hover:-translate-y-0.5">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
