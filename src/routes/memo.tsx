import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Upload, Send, Paperclip, ThumbsUp, ThumbsDown, Copy, Sparkles, RotateCw, ChevronDown, PanelLeftClose, PanelLeft, User } from "lucide-react";
import { AppNavbar } from "@/components/studymind/Navbar";
import { Button, Badge, Modal } from "@/components/studymind/primitives";
import { chatThreads, seedChat, student, subjects, chapters, type ChatMessage } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/memo")({
  head: () => ({
    meta: [
      { title: "Memo — StudyMind" },
      { name: "description", content: "Chat with StudyMind. Every answer is grounded in your own notes and past papers." },
    ],
  }),
  component: MemoPage,
});

function MemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedChat);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState("Thermodynamics");
  const [consistency, setConsistency] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now() + "u", role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + "a",
        role: "ai",
        text: "Based on your uploaded notes, here's a grounded answer. This demo response shows how StudyMind cites its sources and flags whether the answer is consistent with previous ones.",
        sources: [
          { name: "your_notes.pdf", excerpt: "Referenced section from your uploaded material." },
        ],
        consistency: { type: Math.random() > 0.5 ? "same" : "new", date: "Mar 20, 2025" },
      };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-screen">
      <AppNavbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={cn("border-r border-white/5 bg-[#050508] flex flex-col transition-all duration-300 overflow-hidden", sidebarOpen ? "w-72" : "w-0")}>
          <div className="p-4 border-b border-white/5">
            <Button variant="primary" className="w-full" size="sm" onClick={() => setMessages(seedChat)}>
              <Plus className="w-4 h-4" /> New Chat
            </Button>
          </div>
          <div className="p-4 border-b border-white/5 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold">Subject</div>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary/50">
              {subjects.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(chapters[subject.toLowerCase()] || chapters.physics).map((ch) => (
                <button key={ch} onClick={() => setChapter(ch)} className={cn("px-2.5 py-1 rounded-full text-[11px] border transition", chapter === ch ? "bg-primary/20 border-primary/50 text-white" : "border-white/10 text-[color:var(--link)] hover:border-white/25")}>{ch}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold px-2 mb-2">Recent</div>
            {chatThreads.map((t) => (
              <button key={t.id} className="w-full text-left p-2.5 rounded-lg hover:bg-white/5 transition-colors mb-1">
                <div className="text-[13px] truncate">{t.title}</div>
                <div className="text-[10px] text-[color:var(--link)] mt-0.5">{t.subject} · {t.updated}</div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-white/5 flex items-center gap-3">
            <img src={student.avatar} alt="" className="w-8 h-8 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium truncate">{student.name}</div>
              <div className="text-[10px] text-[color:var(--link)] truncate">{student.school}</div>
            </div>
          </div>
        </aside>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-14 border-b border-white/5 px-4 md:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => setSidebarOpen((s) => !s)} className="p-2 hover:bg-white/5 rounded-lg shrink-0">
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
              </button>
              <div className="text-[13px] text-[color:var(--link)] truncate">
                <span>{subject}</span> <span className="mx-1.5">›</span> <span className="text-foreground">{chapter}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setConsistency((c) => !c)} className={cn("hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] border transition", consistency ? "bg-primary/15 border-primary/40 text-white" : "border-white/10 text-[color:var(--link)]")}>
                <Sparkles className="w-3 h-3" /> Consistency Mode: {consistency ? "On" : "Off"}
              </button>
              <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
                <Upload className="w-3.5 h-3.5" /> Upload Notes
              </Button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} msg={m} />
              ))}
              {typing && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 grid place-items-center shrink-0"><Sparkles className="w-4 h-4 text-white" /></div>
                  <div className="soft-card px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white typing-dot" style={{ animationDelay: "0s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white typing-dot" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white typing-dot" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/5 p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="soft-card flex items-end gap-2 p-2">
                <button className="p-2.5 text-[color:var(--link)] hover:text-foreground shrink-0"><Paperclip className="w-4 h-4" /></button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Ask StudyMind anything about your notes..."
                  rows={1}
                  className="flex-1 bg-transparent resize-none py-2.5 text-[14px] focus:outline-none placeholder:text-[color:var(--link)] max-h-40"
                />
                <button onClick={send} disabled={!input.trim()} className="p-2.5 bg-primary rounded-full text-white hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[10px] text-[color:var(--link)] text-center mt-2">Answers are grounded in your uploaded material.</div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Notes">
        <div className="border-2 border-dashed border-white/15 rounded-2xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
          <div className="text-[14px] font-medium mb-1">Drop files here</div>
          <div className="text-[12px] text-[color:var(--link)]">PDF, DOCX, MD, TXT up to 50MB</div>
        </div>
        <Button className="w-full mt-6" onClick={() => setUploadOpen(false)}>Done</Button>
      </Modal>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const [expandedSrc, setExpandedSrc] = useState<string | null>(null);
  if (msg.role === "user") {
    return (
      <div className="flex gap-3 items-start justify-end group">
        <div className="max-w-[80%] bg-primary text-white rounded-2xl rounded-tr-md px-4 py-3 text-[14px] leading-relaxed">{msg.text}</div>
        <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center shrink-0"><User className="w-4 h-4" /></div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 items-start group">
      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 grid place-items-center shrink-0"><Sparkles className="w-4 h-4 text-white" /></div>
      <div className="max-w-[85%] flex-1 min-w-0">
        {msg.consistency && (
          <div className="mb-2">
            {msg.consistency.type === "same" ? (
              <Badge variant="muted"><RotateCw className="w-3 h-3" /> Same as answered on {msg.consistency.date}</Badge>
            ) : (
              <Badge variant="primary"><Sparkles className="w-3 h-3" /> New answer</Badge>
            )}
          </div>
        )}
        <div className="soft-card px-5 py-4 text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {msg.sources.map((s) => (
              <div key={s.name} className="relative">
                <button onClick={() => setExpandedSrc(expandedSrc === s.name ? null : s.name)} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[color:var(--link)] hover:text-foreground hover:border-white/25 transition-colors flex items-center gap-1">
                  <span>📄</span> {s.name}
                </button>
                {expandedSrc === s.name && (
                  <div className="absolute z-10 mt-2 left-0 w-72 soft-card p-3 text-[12px] text-[color:var(--link)]">
                    <div className="text-[10px] uppercase tracking-widest mb-1.5 text-foreground/60">Excerpt</div>
                    {s.excerpt}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--link)] hover:text-foreground"><ThumbsUp className="w-3.5 h-3.5" /></button>
          <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--link)] hover:text-foreground"><ThumbsDown className="w-3.5 h-3.5" /></button>
          <button className="p-1.5 rounded-lg hover:bg-white/5 text-[color:var(--link)] hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
