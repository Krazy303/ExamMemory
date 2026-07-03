import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BtnVariant = "primary" | "outline" | "ghost" | "secondary";
type BtnSize = "sm" | "md" | "lg";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }>(
  function Button({ variant = "primary", size = "md", className, ...props }, ref) {
    const base = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
    const sizes: Record<BtnSize, string> = {
      sm: "h-9 px-4 text-[13px]",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-7 text-[15px] py-3.5",
    };
    const variants: Record<BtnVariant, string> = {
      primary: "bg-primary text-primary-foreground hover:brightness-110 hover:-translate-y-0.5 glow-primary",
      outline: "border border-white/15 text-foreground hover:bg-white/5 hover:border-white/25",
      ghost: "text-foreground/80 hover:text-foreground hover:bg-white/5",
      secondary: "bg-white/8 text-foreground hover:bg-white/12",
    };
    return <button ref={ref} className={cn(base, sizes[size], variants[variant], className)} {...props} />;
  }
);

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("soft-card p-6 transition-all duration-300", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default", className }: { children: ReactNode; variant?: "default" | "primary" | "success" | "warning" | "muted"; className?: string }) {
  const styles: Record<string, string> = {
    default: "bg-white/8 text-foreground/90 border border-white/10",
    primary: "bg-primary/15 text-white border border-primary/40",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    muted: "bg-white/5 text-[color:var(--link)] border border-white/10",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", styles[variant], className)}>{children}</span>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow mb-4">{children}</div>;
}

export function SectionHeading({ eyebrow, title, sub, center = false }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={cn("max-w-3xl mb-14", center && "mx-auto text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-tight">{title}</h2>
      {sub && <p className="mt-5 text-base md:text-lg text-[color:var(--link)] leading-relaxed">{sub}</p>}
    </div>
  );
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setShown(true), delay);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={cn("reveal", shown && "reveal-in", className)}>
      {children}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="soft-card w-full max-w-lg p-8 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-[color:var(--link)] hover:text-foreground text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
