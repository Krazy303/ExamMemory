import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Leaf, ChevronDown, LogOut, Settings as SettingsIcon, Brain } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button, MemoriaLogo } from "./primitives";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/memo", label: "Memo" },
  { to: "/question-bank", label: "Library" },
  { to: "/about", label: "About" },
  { to: "/guide", label: "Guide" },
  { to: "/blog", label: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userName = user?.user_metadata?.full_name || "Student";
  const userEmail = user?.email || "";
  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(userName)}&backgroundColor=e8e3db`;

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

        {/* User Auth Right Area */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-[#FAF7F2] border border-[#E8E3DB]/40 hover:border-[#E8E3DB] transition-all duration-300 select-none cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E3DB] bg-[#FAF7F2] shrink-0">
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[13.5px] font-medium text-foreground tracking-wide max-w-[100px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-4 z-[90] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-muted shrink-0">
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold text-foreground truncate">
                        {userName}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {userEmail}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-foreground/80 hover:text-foreground hover:bg-muted transition-colors font-medium"
                    >
                      <SettingsIcon className="w-4 h-4 text-primary shrink-0" />
                      Settings
                    </Link>
                    <Link
                      to="/memo"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-foreground/80 hover:text-foreground hover:bg-muted transition-colors font-medium"
                    >
                      <Brain className="w-4 h-4 text-primary shrink-0" />
                      Study Workspace
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-red-600 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
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
          className="lg:hidden text-foreground p-2 pointer-events-auto"
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
            <div className="mt-8 flex flex-col gap-3 px-4 border-t border-border pt-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-muted shrink-0">
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold text-foreground truncate">
                        {userName}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {userEmail}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-[14px] font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
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
        <Link to="/settings">
          <Button
            size="sm"
            className="rounded-full font-medium bg-primary hover:bg-primary/90 text-white border-transparent text-[13px] px-4 py-1.5 flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(234,88,12,0.2)]"
          >
            ← Back to Settings
          </Button>
        </Link>
      </div>
    </header>
  );
}
