import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button, StudyMemoLogo } from "@/components/studymind/primitives";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign In — StudyMemo" },
      { name: "description", content: "Sign back into StudyMemo." },
    ],
  }),
  component: SignIn,
});

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(email);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      setError(e.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      sub="Sign in to continue your study journey."
      cta={loading ? "Signing In..." : "Sign In"}
      alt={
        <>
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
      onSubmit={handleSignIn}
    >
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
      <Field 
        label="Email" 
        type="email" 
        placeholder="you@school.edu" 
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
        required
      />
      <Field 
        label="Password" 
        type="password" 
        placeholder="••••••••" 
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        required
      />
      <div className="text-right">
        <a
          href="#"
          className="text-[12px] text-[color:var(--link)] hover:text-foreground"
        >
          Forgot password?
        </a>
      </div>
    </AuthShell>
  );
}

export function AuthShell({ title, sub, cta, alt, onSubmit, children }: any) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:block relative overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent_50%)]" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 grid place-items-center">
              <StudyMemoLogo className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-medium tracking-wide text-2xl">StudyMemo</span>
          </Link>
          <div>
            <h2 className="text-4xl xl:text-5xl font-serif font-medium leading-[1.1] tracking-wide mb-6">
              The AI study companion that remembers everything you learn.
            </h2>
            <p className="text-white/70 max-w-md">
              Consistent answers, source-cited recall, and a memory that
              compounds over every session.
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-widest text-white/40">
            © 2026 StudyMemo Labs
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary grid place-items-center">
              <StudyMemoLogo className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-medium text-xl">StudyMemo</span>
          </div>
          <h1 className="text-4xl font-serif font-medium tracking-wide mb-3 text-foreground">
            {title}
          </h1>
          <p className="text-[color:var(--link)] text-[14px] mb-8">{sub}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            {children}
            <Button type="submit" className="w-full mt-2" size="lg">
              {cta} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
          <div className="mt-6 text-center text-[13px] text-[color:var(--link)]">
            {alt}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-[12px] uppercase tracking-[0.1em] text-muted-foreground mb-2 font-medium">
        {label}
      </label>
      <input
        {...props}
        className="w-full h-12 px-4 rounded-xl bg-white border border-[#E8E3DB] text-[15px] text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
    </div>
  );
}
