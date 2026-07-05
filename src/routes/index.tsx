import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  Check,
  ChevronDown,
  Brain,
  Zap,
  Target,
  Upload,
  MessageSquare,
  LineChart,
  BookMarked,
  Flame,
  Network,
  ListChecks,
  Layers,
} from "lucide-react";
import {
  Button,
  Card,
  Badge,
  SectionHeading,
  Reveal,
  Eyebrow,
} from "@/components/studymind/primitives";
import {
  testimonials,
  stats,
  faq,
  howItWorks,
  whyCards,
  featureChips,
  trustedLogos,
} from "@/data/mock";
import memoPreview from "@/assets/memo-preview.png.asset.json";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memoria — Never Get a Different Answer Twice" },
      {
        name: "description",
        content:
          "A persistent-memory AI study companion. Consistent, source-cited answers grounded in your own notes and past papers.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto pt-24 pb-8">
        <Hero />
        <Marquee />
        <ValueStrip />
        <Why />
        <HowItWorks />
        <Showcase />
        <Testimonials />
        <Stats />
        <StudentBenefits />
        <FAQSection />
        <FinalCTA />
      </div>
    </main>
  );
}

function Marquee() {
  const items = [
    "AI STUDY COMPANION",
    "•",
    "KNOWLEDGE GRAPH",
    "•",
    "AUTOMATED REVISION",
    "•",
    "SMART FLASHCARDS",
    "•",
    "PDF CHAT",
    "•",
  ];
  return (
    <div className="w-full overflow-hidden bg-muted text-muted-foreground py-5 flex whitespace-nowrap border-y border-border">
      <div className="animate-marquee flex gap-12 items-center font-medium tracking-[0.2em] text-[13px] uppercase">
        {items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
        {items.map((item, i) => (
          <span key={i + 100}>{item}</span>
        ))}
        {items.map((item, i) => (
          <span key={i + 200}>{item}</span>
        ))}
        {items.map((item, i) => (
          <span key={i + 300}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function FlowingLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20 -z-10"
      viewBox="0 0 1000 400"
      preserveAspectRatio="none"
    >
      <path
        d="M0 200 Q 250 50, 500 200 T 1000 200"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeDasharray="10 10"
        className="animate-dash-flow"
      />
    </svg>
  );
}

function NumberCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = Math.max(16, Math.floor(duration / end));
    const stepValue = Math.max(1, Math.floor(end / (duration / stepTime)));

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <>
      {count}
      {suffix}
    </>
  );
}

function Hero() {
  const { user } = useAuth();
  const ctaLink = user ? "/memo" : "/sign-up";

  return (
    <section className="relative px-5 sm:px-8 lg:px-16 pt-28 md:pt-32 lg:pt-16 pb-24 md:pb-32 overflow-hidden max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left Side: Typography */}
        <div className="flex-1 text-left relative z-10 w-full">
          <Reveal>
            <div className="text-xs font-semibold tracking-[0.2em] text-primary mb-8 uppercase">
              [ Memoria ]
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-6xl md:text-[80px] lg:text-[110px] leading-[1.05] sm:leading-[0.95] font-serif font-medium tracking-wide text-foreground">
              Never get <br className="hidden sm:inline" />
              a different <br className="hidden sm:inline" />
              <span className="italic text-primary">answer</span> twice.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-10 text-[17px] text-muted-foreground font-medium max-w-md leading-relaxed">
              Memoria remembers your notes and mistakes, so every answer is
              consistent, source-cited, and truly yours.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-12 flex items-center gap-4">
              <Link to={ctaLink}>
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl rounded-full text-[15px] px-10 h-14 bg-primary text-white font-medium hover:-translate-y-1 transition-all"
                >
                  Meet Memo
                </Button>
              </Link>
              <Link
                to="/about"
                className="text-[14px] font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right Side: 3D Elements and Growth Card */}
        <div className="flex-1 relative w-full h-[320px] sm:h-[450px] lg:h-[700px] flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10" />

          {/* Decorative floaters - hidden on mobile/tablets for a clean stacked structure */}
          <Reveal delay={300} className="absolute top-10 left-10 hidden lg:block">
            <div className="w-32 h-32 bg-primary rounded-[2rem] shadow-xl rotate-12 flex items-center justify-center">
              <Sparkles className="w-14 h-14 text-white" />
            </div>
          </Reveal>

          <Reveal delay={400} className="absolute bottom-32 left-1/4 hidden lg:block">
            <div className="w-24 h-24 bg-yellow-400 rounded-full shadow-lg -rotate-12 flex items-center justify-center">
              <Brain className="w-12 h-12 text-black" />
            </div>
          </Reveal>

          <Reveal delay={500} className="absolute top-1/4 right-0 hidden lg:block">
            <div className="w-40 h-40 bg-red-500 rounded-[2.5rem] shadow-2xl rotate-6 flex items-center justify-center">
              <Target className="w-16 h-16 text-white" />
            </div>
          </Reveal>

          {/* Growth Card - Centered on mobile/tablets, positioned on desktop */}
          <Reveal delay={600} className="relative lg:absolute lg:bottom-10 lg:right-10 z-20">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white w-72 sm:w-80 hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-3">
                <ArrowRight className="w-10 h-10 text-foreground -rotate-45" />
                <span className="text-6xl font-normal tracking-tighter text-foreground">
                  <NumberCounter end={132} suffix="%" />
                </span>
              </div>
              <div className="text-[14px] font-semibold tracking-widest text-foreground/60 mb-3 uppercase">
                Retention
              </div>
              <p className="text-[13px] text-foreground/60 leading-relaxed font-medium">
                Our students see measurable memory growth through strategic AI
                revision.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="py-24 md:py-32 relative bg-background border-b border-border">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center relative">
        <Reveal>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] tracking-wide text-foreground">
            Learning that{" "}
            <span className="text-primary italic">remembers you</span>, instead
            of forgetting every session.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

function Why() {
  const icons = [Zap, BookMarked, Target];
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why Memoria"
            title={
              <>
                What sets Memoria{" "}
                <span className="text-primary italic">apart</span>
              </>
            }
            center
          />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {whyCards.map((c, i) => {
            const Icon = icons[i];
            const gradients = [
              {
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-blue-500",
                bgHover: "hover:bg-blue-50/50",
              },
              {
                gradient: "from-emerald-500/20 to-teal-500/20",
                iconColor: "text-emerald-500",
                bgHover: "hover:bg-emerald-50/50",
              },
              {
                gradient: "from-purple-500/20 to-fuchsia-500/20",
                iconColor: "text-purple-500",
                bgHover: "hover:bg-purple-50/50",
              },
            ];
            const style = gradients[i % gradients.length];
            return (
              <Reveal key={c.title} delay={i * 150}>
                <div className="group relative h-full">
                  {/* Hover gradient border effect */}
                  <div className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

                  <Card className={`relative h-full flex flex-col items-center text-center p-10 bg-white/80 backdrop-blur-xl border border-[#E8E3DB] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] ${style.bgHover}`}>
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${style.gradient} border border-white/50 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-8 h-8 ${style.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif font-medium tracking-wide mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {c.title}
                    </h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xs flex-1">
                      {c.desc}
                    </p>
                  </Card>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            {featureChips.map((chip) => (
              <span
                key={chip}
                className="px-5 py-2 rounded-full border border-border bg-white text-[14px] font-medium text-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
              >
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how"
      className="py-24 md:py-32 bg-background relative overflow-hidden border-t border-border"
    >
      <FlowingLines />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Four steps to mastery"
            center
          />
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {howItWorks.map((s, i) => {
            const gradients = [
              "from-blue-500/10 to-indigo-500/10",
              "from-purple-500/10 to-fuchsia-500/10",
              "from-rose-500/10 to-orange-500/10",
              "from-emerald-500/10 to-teal-500/10",
            ];
            const textColors = [
              "text-blue-500",
              "text-purple-500",
              "text-rose-500",
              "text-emerald-500",
            ];
            const currentGradient = gradients[i % gradients.length];
            const currentTextColor = textColors[i % textColors.length];

            return (
              <Reveal key={s.n} delay={i * 100}>
                <div className="group relative h-full">
                  <div className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br ${currentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

                  <Card className="relative h-full bg-white/80 backdrop-blur-xl border border-[#E8E3DB] p-8 rounded-[2rem] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentGradient} border border-white/50 shadow-inner ${currentTextColor} font-serif font-medium text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      {s.n}
                    </div>
                    <h3 className="text-xl font-serif font-medium tracking-wide mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                      {s.title}
                    </h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">
                      {s.desc}
                    </p>
                  </Card>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const blocks = [
    {
      eyebrow: "The Memo",
      title: "Chat that cites its work",
      desc: "Every answer in Memo pulls from your uploaded material and shows the exact source. No hallucinations, no mystery.",
      icon: MessageSquare,
      img: "images/image.png",
    },
    {
      eyebrow: "Knowledge Graph",
      title: "See how your ideas connect",
      desc: "Every concept you study becomes a node. Watch your understanding compound as chapters link together.",
      icon: Network,
      img: "images/image2.png",
    },
    {
      eyebrow: "Revision Queue",
      title: "Practice the things you miss",
      desc: "Memoria surfaces the mistakes you keep making and turns them into flashcards. Focused, not random.",
      icon: ListChecks,
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
    },
  ];
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-32">
        {blocks.map((b, i) => (
          <Reveal key={b.title}>
            <div
              className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <div className="bg-[#FAF7F2] p-4 rounded-[3rem] border border-[#E8E3DB] shadow-sm">
                  <div className="rounded-[2.5rem] overflow-hidden">
                    <img
                      src={b.img}
                      alt={b.title}
                      className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Eyebrow>{b.eyebrow}</Eyebrow>
                <h3 className="text-4xl md:text-5xl font-serif font-medium tracking-wide mb-6 leading-[1.1] text-foreground">
                  {b.title}
                </h3>
                <p className="text-[17px] text-muted-foreground leading-relaxed mb-10 max-w-lg">
                  {b.desc}
                </p>
                <Button variant="outline" size="lg" className="rounded-full">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
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
    <section className="py-24 md:py-32 bg-[#FAF7F2] border-y border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Loved by students"
            title="Real students, real revision"
            center
          />
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                <Card className="relative h-full flex flex-col p-8 bg-white/80 backdrop-blur-xl border border-[#E8E3DB] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 rounded-[2rem]">
                  <p className="text-[15px] leading-relaxed mb-8 flex-1 text-foreground font-serif italic group-hover:text-primary transition-colors duration-300">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover shadow-sm border border-white/50 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div>
                      <div className="text-[15px] font-medium text-foreground">
                        {t.name}
                      </div>
                      <div className="text-[13px] text-muted-foreground tracking-wide">
                        {t.school}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="bg-white rounded-[3rem] border border-[#E8E3DB] p-12 md:p-20 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x-0 md:divide-x border-border">
            {stats.map((s, i) => (
              <div key={s.label} className={i !== 0 ? "md:pl-12" : ""}>
                <div className="text-5xl md:text-6xl font-serif font-medium tracking-wide text-primary mb-4">
                  <NumberCounter
                    end={parseInt(s.value.replace(/\D/g, "") || "0")}
                    suffix={s.value.replace(/[0-9]/g, "")}
                  />
                </div>
                <div className="text-[14px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StudentBenefits() {
  const benefits = [
    {
      title: "Save 15+ Hours a Week",
      desc: "Stop re-reading the same textbook. Memoria directs you straight to the concepts you struggle with.",
      icon: Zap,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
      bgHover: "hover:bg-blue-50/50"
    },
    {
      title: "Better Grades, Less Stress",
      desc: "By focusing purely on what you don't know, students report a full letter grade improvement on average.",
      icon: Target,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
      bgHover: "hover:bg-emerald-50/50"
    },
    {
      title: "Confidence in Every Exam",
      desc: "Know exactly how much material you have mastered and walk into the exam room feeling completely prepared.",
      icon: Sparkles,
      gradient: "from-purple-500/20 to-fuchsia-500/20",
      iconColor: "text-purple-500",
      bgHover: "hover:bg-purple-50/50"
    }
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden border-y border-border">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#FAF7F2]/50 to-background -z-10" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -z-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -translate-y-1/2 -z-10" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Student Benefits"
            title="How you benefit from using Memoria"
            center
          />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={i * 150}>
                <div className="group relative h-full">
                  {/* Hover gradient border effect */}
                  <div className={`absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-br ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

                  <Card className={`relative h-full flex flex-col p-10 bg-white/80 backdrop-blur-xl border border-[#E8E3DB] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] ${b.bgHover}`}>

                    <div className="relative mb-8">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-gradient-to-br ${b.gradient} border border-white/50 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-8 h-8 ${b.iconColor}`} />
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif font-medium tracking-wide mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {b.title}
                    </h3>

                    <p className="text-[16px] text-muted-foreground leading-relaxed flex-1">
                      {b.desc}
                    </p>
                  </Card>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered" center />
        </Reveal>
        <div className="space-y-4">
          {faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-border overflow-hidden transition-all">
                <button
                  className="w-full flex items-center justify-between text-left p-6 hover:bg-muted/30 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-semibold tracking-tight text-[16px] pr-4 text-foreground">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform text-foreground/60 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`px-6 text-[15px] text-foreground/70 font-medium leading-relaxed transition-all duration-300 ${open === i ? "pb-6 max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
                >
                  {f.a}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { user } = useAuth();
  const ctaLink = user ? "/memo" : "/sign-up";

  return (
    <section className="py-24 md:py-32 bg-background pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] p-12 md:p-24 text-center bg-primary">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_0%,white,transparent_70%)]" />
            <div className="relative z-10">
              <Eyebrow>Join us</Eyebrow>
              <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-wide leading-[1.1] mb-8 max-w-3xl mx-auto text-white">
                Start remembering everything you learn.
              </h2>
              <p className="text-white/80 font-medium mb-12 max-w-xl mx-auto text-[17px] leading-relaxed">
                Join thousands of students learning with a companion that never
                forgets.
              </p>
              <Link to={ctaLink}>
                <button className="inline-flex items-center gap-2 bg-white text-primary rounded-full px-10 py-5 font-medium hover:-translate-y-1 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-[15px]">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
                </button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
