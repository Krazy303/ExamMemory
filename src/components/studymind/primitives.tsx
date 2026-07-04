import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type BtnVariant = "primary" | "outline" | "ghost" | "secondary";
type BtnSize = "sm" | "md" | "lg";

export const MemoriaLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 2C16 2 20 12 30 16C20 20 16 30 16 30C16 30 12 20 2 16C12 12 16 2 16 2Z" fill="currentColor"/>
    <circle cx="16" cy="16" r="3" fill="#FAF7F2" />
  </svg>
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
    size?: BtnSize;
  }
>(function Button(
  { variant = "primary", size = "md", className, ...props },
  ref,
) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium tracking-wide rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
  const sizes: Record<BtnSize, string> = {
    sm: "h-10 px-5 text-[13px]",
    md: "h-12 px-6 text-[14px]",
    lg: "h-14 px-8 text-[15px]",
  };
  const variants: Record<BtnVariant, string> = {
    primary:
      "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(227,139,117,0.4)]",
    outline:
      "bg-transparent text-foreground border border-border hover:bg-muted/30 hover:border-foreground/30",
    ghost: "text-foreground shadow-none hover:bg-muted/50",
    secondary:
      "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:shadow-lg",
  };
  return (
    <button
      ref={ref}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
});

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("soft-card p-8", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "muted";
  className?: string;
}) {
  const styles: Record<string, string> = {
    default: "bg-white text-foreground border border-border shadow-sm",
    primary: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    muted: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow mb-6">{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl mb-16", center && "mx-auto text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-4xl md:text-5xl lg:text-[60px] font-serif font-medium leading-[1.1] tracking-wide text-foreground">
        {title}
      </h2>
      {sub && (
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {sub}
        </p>
      )}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={cn("reveal", shown && "reveal-in", className)}>
      {children}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.1)] w-full max-w-lg p-8 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-[color:var(--link)] hover:text-foreground text-2xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
