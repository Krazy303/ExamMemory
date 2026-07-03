import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Brain } from "lucide-react";
import { useState } from "react";
import { Button } from "./primitives";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/memo", label: "Go to Memo" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/question-bank", label: "Question Bank" },
  { to: "/timeline", label: "Timeline" },
  { to: "/knowledge-graph", label: "Knowledge Graph" },
  { to: "/about", label: "About Us" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary grid place-items-center glow-primary">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight">StudyMind</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "px-3 py-2 rounded-full text-[13px] transition-colors",
                pathname === it.to ? "text-foreground bg-white/8" : "text-[color:var(--link)] hover:text-foreground hover:bg-white/5"
              )}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link to="/sign-in"><Button variant="ghost" size="sm">Sign In</Button></Link>
          <Link to="/sign-up"><Button variant="primary" size="sm">Get Started</Button></Link>
        </div>

        <button className="lg:hidden text-foreground p-2" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-white/10 p-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-semibold">StudyMind</span>
              <button onClick={() => setOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((it) => (
                <Link key={it.to} to={it.to} onClick={() => setOpen(false)} className={cn("px-4 py-3 rounded-xl text-sm", pathname === it.to ? "bg-white/10" : "hover:bg-white/5 text-[color:var(--link)]")}>
                  {it.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/sign-in" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link to="/sign-up" onClick={() => setOpen(false)}><Button variant="primary" className="w-full">Get Started</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary grid place-items-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[14px]">StudyMind</span>
        </Link>
        <Link to="/dashboard" className="text-[13px] text-[color:var(--link)] hover:text-foreground transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </header>
  );
}
