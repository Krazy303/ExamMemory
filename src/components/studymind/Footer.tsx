import { Link } from "@tanstack/react-router";
import { Twitter, Github, Linkedin, Youtube } from "lucide-react";
import { Button, MemoriaLogo } from "./primitives";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32 bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary grid place-items-center shadow-sm">
                <MemoriaLogo className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-medium text-xl">Memoria</span>
            </Link>
            <p className="text-[13px] text-[color:var(--link)] leading-relaxed max-w-xs">
              The memory-powered AI study companion. Consistent, source-cited,
              and built to remember you.
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/10 grid place-items-center hover:bg-white/5 hover:border-white/25 transition-colors"
                >
                  <Icon className="w-4 h-4 text-[color:var(--link)]" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: [
                ["Memo", "/memo"],
                ["Settings", "/settings"],
                ["Question Bank", "/question-bank"],
                ["Knowledge Graph", "/knowledge-graph"],
              ],
            },
            {
              title: "Company",
              links: [
                ["About Us", "/about"],
                ["Careers", "#"],
                ["Blog", "/blog"],
                ["Contact", "#"],
              ],
            },
            {
              title: "Resources",
              links: [
                ["Docs", "#"],
                ["Changelog", "#"],
                ["Guides", "/guide"],
                ["Community", "#"],
              ],
            },
            {
              title: "Legal",
              links: [
                ["Privacy", "#"],
                ["Terms", "#"],
                ["Security", "#"],
                ["Cookies", "#"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)] mb-4 font-semibold">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to as string}
                      className="text-[13px] text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full max-w-md">
            <input
              type="email"
              placeholder="Your email for study tips..."
              className="flex-1 h-11 px-4 rounded-full bg-white/5 border border-white/10 text-[13px] placeholder:text-[color:var(--link)] focus:outline-none focus:border-primary/60"
            />
            <Button size="sm">Subscribe</Button>
          </div>
          <p className="text-[12px] text-[color:var(--link)]">
            © 2026 Memoria Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
