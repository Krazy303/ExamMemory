import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Check, ChevronDown, Brain, Zap, Target, Upload, MessageSquare, LineChart, BookMarked, Flame, Network, ListChecks, Layers } from "lucide-react";
import { Button, Card, Badge, SectionHeading, Reveal, Eyebrow } from "@/components/studymind/primitives";
import { testimonials, stats, pricing, faq, howItWorks, whyCards, featureChips, trustedLogos } from "@/data/mock";
import memoPreview from "@/assets/memo-preview.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyMind — Never Get a Different Answer Twice" },
      { name: "description", content: "A persistent-memory AI study companion. Consistent, source-cited answers grounded in your own notes and past papers." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <ValueStrip />
      <Why />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <Stats />
      <Pricing />
      <FAQSection />
      <FinalCTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative pt-14 pb-20 md:pt-24 md:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/20 rounded-full blur-[160px]" />
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
        <Reveal>
          <Badge variant="primary" className="mb-6 py-1.5 px-4">
            <Brain className="w-3.5 h-3.5" /> Your memory-powered study companion
          </Badge>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[82px] font-semibold tracking-tight max-w-5xl mx-auto">
            Never Get a<br />
            <span className="italic font-light text-[color:var(--link)]">Different Answer</span> Twice
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-7 text-base md:text-lg text-[color:var(--link)] max-w-2xl mx-auto leading-relaxed">
            StudyMind remembers your notes, past papers, and mistakes — so every answer is consistent, source-cited, and truly yours.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/sign-up"><Button size="lg">Get Started Free <ArrowRight className="w-4 h-4" /></Button></Link>
            <a href="#how"><Button size="lg" variant="outline">See How It Works</Button></a>
          </div>
        </Reveal>

        <Reveal delay={450}>
          <div className="mt-20 relative">
            <div className="absolute -inset-x-10 -inset-y-6 bg-gradient-to-b from-primary/20 to-transparent blur-3xl -z-10" />
            <div className="soft-card p-2 md:p-3 mx-auto max-w-5xl overflow-hidden">
              <div className="rounded-2xl overflow-hidden border border-white/5">
                <img src={memoPreview.url} alt="StudyMind Memo chat interface" className="w-full aspect-[16/9] object-cover object-top" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-16">
            <div className="eyebrow mb-6">Trusted by students at</div>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-50">
              {trustedLogos.map((l) => (
                <span key={l} className="text-lg md:text-xl font-semibold tracking-tight grayscale">{l}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center relative">
        <div className="hidden md:block absolute -left-8 top-8 float-y">
          <Card className="p-4 w-40"><Sparkles className="w-5 h-5 text-primary mb-2" /><div className="text-[11px] text-[color:var(--link)]">Grounded in your notes</div></Card>
        </div>
        <div className="hidden md:block absolute -right-8 bottom-0 float-y" style={{ animationDelay: "-3s" }}>
          <Card className="p-4 w-40"><Target className="w-5 h-5 text-primary mb-2" /><div className="text-[11px] text-[color:var(--link)]">Remembers mistakes</div></Card>
        </div>
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            Learning that <span className="text-[color:var(--link)]">remembers you</span>, instead of forgetting every session.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

function Why() {
  const icons = [Zap, BookMarked, Target];
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Why StudyMind" title={<>What sets StudyMind <span className="text-[color:var(--link)] italic font-light">apart</span></>} center />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {whyCards.map((c, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={c.title} delay={i * 100}>
                <Card className="h-full hover:-translate-y-1 hover:border-white/15">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center mb-6">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{c.title}</h3>
                  <p className="text-[13px] text-[color:var(--link)] leading-relaxed">{c.desc}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {featureChips.map((chip) => (
              <span key={chip} className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-[12px] text-[color:var(--link)] hover:border-white/25 hover:text-foreground transition-colors">{chip}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="How it works" title="Four steps from upload to mastery" center />
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {howItWorks.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <Card className="h-full">
                <div className="text-primary text-[13px] font-semibold mb-4">{s.n}</div>
                <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
                <p className="text-[13px] text-[color:var(--link)] leading-relaxed">{s.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const blocks = [
    { eyebrow: "The Memo", title: "Chat that cites its work", desc: "Every answer in Memo pulls from your uploaded material and shows the exact source. No hallucinations, no mystery.", icon: MessageSquare, img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80" },
    { eyebrow: "Knowledge Graph", title: "See how your ideas connect", desc: "Every concept you study becomes a node. Watch your understanding compound as chapters link together.", icon: Network, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80" },
    { eyebrow: "Revision Queue", title: "Practice the things you actually miss", desc: "StudyMind surfaces the mistakes you keep making and turns them into flashcards. Focused, not random.", icon: ListChecks, img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80" },
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-24">
        {blocks.map((b, i) => (
          <Reveal key={b.title}>
            <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="soft-card p-2">
                  <div className="rounded-2xl overflow-hidden border border-white/5">
                    <img src={b.img} alt={b.title} className="w-full aspect-[4/3] object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <Eyebrow>{b.eyebrow}</Eyebrow>
                <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-5 leading-tight">{b.title}</h3>
                <p className="text-[15px] text-[color:var(--link)] leading-relaxed mb-6">{b.desc}</p>
                <Button variant="outline" size="sm">Learn more <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Loved by students" title="Real students, real revision" center />
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <Card className="h-full flex flex-col">
                <p className="text-[13px] leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-[13px] font-medium">{t.name}</div>
                    <div className="text-[11px] text-[color:var(--link)]">{t.school}</div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="soft-card p-10 md:p-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">{s.value}</div>
                <div className="text-[12px] uppercase tracking-widest text-[color:var(--link)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Pricing" title="Simple pricing, big memory" center />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {pricing.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <Card className={`h-full flex flex-col relative ${p.highlight ? "border-primary/60 glow-primary" : ""}`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Most Popular</Badge>
                  </div>
                )}
                <div className="text-[12px] uppercase tracking-widest text-[color:var(--link)] mb-3">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-semibold">{p.price}</span>
                  <span className="text-[13px] text-[color:var(--link)]">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px]">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/sign-up"><Button variant={p.highlight ? "primary" : "outline"} className="w-full">{p.cta}</Button></Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered" center />
        </Reveal>
        <div className="space-y-3">
          {faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="soft-card p-0 overflow-hidden">
                <button className="w-full flex items-center justify-between text-left p-6 hover:bg-white/[0.02] transition-colors" onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-medium text-[14px] pr-4">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && (
                  <div className="px-6 pb-6 text-[13px] text-[color:var(--link)] leading-relaxed">{f.a}</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-20 text-center bg-gradient-to-br from-primary via-primary to-[#0000AA]">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,white,transparent_50%)]" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 max-w-3xl mx-auto">
                Start remembering everything you learn
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto text-[15px]">Join thousands of students learning with a companion that never forgets.</p>
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
  );
}
