import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/studymind/primitives";

export const Route = createFileRoute("/sign-in")({
  head: () => ({ meta: [{ title: "Sign In — StudyMind" }, { name: "description", content: "Sign back into StudyMind." }] }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  return <AuthShell title="Welcome back" sub="Sign in to continue your study journey." cta="Sign In" alt={<>Don't have an account? <Link to="/sign-up" className="text-primary hover:underline">Sign up</Link></>} onSubmit={() => navigate({ to: "/dashboard" })}>
    <Field label="Email" type="email" placeholder="you@school.edu" />
    <Field label="Password" type="password" placeholder="••••••••" />
    <div className="text-right"><a href="#" className="text-[12px] text-[color:var(--link)] hover:text-foreground">Forgot password?</a></div>
  </AuthShell>;
}

export function AuthShell({ title, sub, cta, alt, onSubmit, children }: any) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-primary via-[#0000AA] to-black">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,white,transparent_50%)]" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur border border-white/20 grid place-items-center"><Brain className="w-5 h-5" /></div>
            <span className="font-semibold text-lg">StudyMind</span>
          </Link>
          <div>
            <h2 className="text-4xl xl:text-5xl font-semibold leading-tight mb-4">The AI study companion that remembers everything you learn.</h2>
            <p className="text-white/70 max-w-md">Consistent answers, source-cited recall, and a memory that compounds over every session.</p>
          </div>
          <div className="text-[11px] uppercase tracking-widest text-white/40">© 2026 StudyMind Labs</div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary grid place-items-center"><Brain className="w-4 h-4 text-white" /></div>
            <span className="font-semibold">StudyMind</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">{title}</h1>
          <p className="text-[color:var(--link)] text-[14px] mb-8">{sub}</p>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
            {children}
            <Button type="submit" className="w-full mt-2" size="lg">{cta} <ArrowRight className="w-4 h-4" /></Button>
          </form>
          <div className="mt-6 text-center text-[13px] text-[color:var(--link)]">{alt}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-[12px] uppercase tracking-widest text-[color:var(--link)] mb-2 font-semibold">{label}</label>
      <input {...props} className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] placeholder:text-[color:var(--link)] focus:outline-none focus:border-primary/60 transition-colors" />
    </div>
  );
}
