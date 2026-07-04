import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Leaf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, MemoriaLogo } from "./primitives";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/memo", label: "Memo" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/question-bank", label: "Library" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
      <div className="mx-auto max-w-7xl h-16 rounded-full bg-[#FAF7F2]/80 backdrop-blur-md border border-[#E8E3DB] shadow-sm flex items-center justify-between px-6 pointer-events-auto">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary grid place-items-center shadow-sm">
            <MemoriaLogo className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-medium text-2xl tracking-wide text-foreground mt-0.5">
            Memoria
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-primary tracking-wide",
                pathname === it.to ? "text-foreground" : "text-foreground/60",
              )}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-medium text-foreground/80">
                {user.user_metadata?.full_name}
              </span>
              <Link to="/dashboard">
                <button className="bg-primary text-white rounded-full px-5 py-2 text-[14px] font-medium hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_0_rgba(227,139,117,0.39)]">
                  Dashboard
                </button>
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-[13px] text-muted-foreground hover:text-red-500 transition-colors font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="text-[14px] font-medium text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link to="/sign-in">
                <button className="bg-primary text-white rounded-full px-6 py-2 text-[14px] font-medium hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_0_rgba(227,139,117,0.39)]">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden pointer-events-auto">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border p-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-xl tracking-wide">
                Memoria
              </span>
              <button onClick={() => setOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-[15px] font-medium transition-colors",
                    pathname === it.to
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  {it.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-3 px-4">
              {user ? (
                <>
                  <div className="text-center py-2 text-[15px] font-medium text-foreground/80 border-b border-border mb-2">
                    {user.user_metadata?.full_name}
                  </div>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    <button className="w-full bg-primary text-white rounded-full py-3 text-[15px] font-medium">
                      Dashboard
                    </button>
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="w-full text-center py-3 text-[15px] font-medium text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    onClick={() => setOpen(false)}
                    className="text-center py-3 text-[15px] font-medium"
                  >
                    Sign In
                  </Link>
                  <Link to="/sign-in" onClick={() => setOpen(false)}>
                    <button className="w-full bg-primary text-white rounded-full py-3 text-[15px] font-medium">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF7F2]/80 border-b border-[#E8E3DB]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary grid place-items-center shadow-sm">
            <MemoriaLogo className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-xl font-medium tracking-wide mt-0.5">
            Memoria
          </span>
        </Link>
        <Link
          to="/dashboard"
          className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </header>
  );
}
