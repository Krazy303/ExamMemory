import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Anchor, Heart, Brain, ArrowRight } from "lucide-react";
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
            <Eyebrow>About Memoria</Eyebrow>
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
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80"
                alt="Students learning"
                className="w-full aspect-square object-cover rounded-2xl"
              />
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <Card className="text-center hover:-translate-y-1">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="font-semibold text-[15px]">{m.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)] mt-1">
                    {m.role}
                  </div>
                  <div className="text-[12px] text-[color:var(--link)] mt-3">
                    {m.bio}
                  </div>
                </Card>
              </Reveal>
            ))}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = valueIcons[v.icon] || Brain;
              return (
                <Reveal key={v.title} delay={i * 80}>
                  <Card className="h-full">
                    <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center mb-5">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                    <p className="text-[12px] text-[color:var(--link)] leading-relaxed">
                      {v.desc}
                    </p>
                  </Card>
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
