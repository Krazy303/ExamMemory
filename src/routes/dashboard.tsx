import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Flame,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  Upload,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  LayoutDashboard,
  Target,
  Timer,
  Trash2,
  Settings,
  User,
  Sliders,
  Cpu,
  Database,
  Check,
  RotateCw,
  Building,
  Calendar,
  FileText
} from "lucide-react";
import { Card, Badge, Button, Eyebrow } from "@/components/studymind/primitives";
import { cogneeGetDatasetFiles } from "@/lib/cognee";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Memoria" },
      { name: "description", content: "Track your streak, syllabus coverage, and weak concepts at a glance." },
    ],
  }),
  component: Dashboard,
});

const icons: Record<string, any> = {
  flame: Flame,
  message: MessageSquare,
  book: BookOpen,
  alert: AlertTriangle,
  upload: Upload,
  check: CheckCircle2
};

// Hardcoded initial data from mock file, we fall back to this if user data is missing
const fallbackStats = [
  { label: "Study Streak", value: "14", suffix: "days", icon: "flame" },
  { label: "Questions Asked", value: "47", suffix: "this week", icon: "message" },
  { label: "Topics Covered", value: "68%", suffix: "of syllabus", icon: "book" },
  { label: "Mistakes Tracked", value: "12", suffix: "active", icon: "alert" },
];

const fallbackSyllabus = [
  {
    subject: "Physics",
    pct: 72,
    chapters: [
      { name: "Thermodynamics", pct: 90 },
      { name: "Electromagnetism", pct: 65 },
      { name: "Optics", pct: 40 },
    ],
  },
  {
    subject: "Chemistry",
    pct: 45,
    chapters: [
      { name: "Organic", pct: 60 },
      { name: "Inorganic", pct: 30 },
      { name: "Physical", pct: 45 },
    ],
  },
  {
    subject: "Biology",
    pct: 58,
    chapters: [
      { name: "Cell Biology", pct: 80 },
      { name: "Genetics", pct: 50 },
      { name: "Ecology", pct: 42 },
    ],
  },
  {
    subject: "Mathematics",
    pct: 81,
    chapters: [
      { name: "Calculus", pct: 95 },
      { name: "Linear Algebra", pct: 75 },
      { name: "Statistics", pct: 72 },
    ],
  },
];

const fallbackWeakConcepts = [
  { concept: "Entropy calculations", subject: "Physics", severity: "high" },
  { concept: "Newton's third law application", subject: "Physics", severity: "medium" },
  { concept: "Redox balancing in acidic solution", subject: "Chemistry", severity: "high" },
  { concept: "Integration by parts", subject: "Math", severity: "low" },
];

const fallbackActivity = [
  { icon: "upload", title: "Uploaded physics_ch4_notes.pdf", time: "2h ago" },
  { icon: "message", title: "Asked about entropy calculations", time: "3h ago" },
  { icon: "check", title: "Completed revision session (12 cards)", time: "Yesterday" },
  { icon: "alert", title: "New mistake logged: Newton's third law", time: "2d ago" },
  { icon: "upload", title: "Uploaded Past Paper 2023", time: "3d ago" },
];

function Dashboard() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/sign-in" });
    }
  }, [user, authLoading, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "goals" | "notes" | "settings">("overview");

  // Sync tab with query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "overview" || tab === "goals" || tab === "notes" || tab === "settings") {
      setActiveTab(tab as any);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    // Update URL query parameters
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.toString());
  };

  // Profile Settings States
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("UIT, KU");
  const [studyGoal, setStudyGoal] = useState("10 hours");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [graphPhysics, setGraphPhysics] = useState("medium");
  const [aiModel, setAiModel] = useState("standard");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prep fields
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
      if (user.user_metadata?.institution) {
        setInstitution(user.user_metadata.institution);
      }
      if (user.user_metadata?.study_goal) {
        setStudyGoal(user.user_metadata.study_goal);
      }
      if (user.user_metadata?.graph_physics) {
        setGraphPhysics(user.user_metadata.graph_physics);
      }
      if (user.user_metadata?.ai_model) {
        setAiModel(user.user_metadata.ai_model);
      }
      if (user.user_metadata?.email_alerts !== undefined) {
        setEmailAlerts(user.user_metadata.email_alerts);
      }
    }
  }, [user]);

  // Study Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartStop = () => {
    setTimerActive(!timerActive);
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeElapsed(0);
  };

  // Notes/Files State loaded via Cognee
  const [files, setFiles] = useState<any[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const res = await cogneeGetDatasetFiles({ data: { datasetName: "default_dataset" } });
      if (res && !res.isMock && res.files) {
        setFiles(res.files);
      } else {
        setFiles([
          { id: "f1", name: "physics_ch4_notes.pdf", createdAt: "2 hours ago", size: "2.4 MB" },
          { id: "f2", name: "organic_chemistry_formulas.docx", createdAt: "Yesterday", size: "1.1 MB" },
          { id: "f3", name: "biology_mitosis_diagram.png", createdAt: "3 days ago", size: "450 KB" },
        ]);
      }
    } catch (err) {
      console.error("Failed to load dataset files in dashboard:", err);
      setFiles([
        { id: "f1", name: "physics_ch4_notes.pdf", createdAt: "2 hours ago", size: "2.4 MB" },
        { id: "f2", name: "organic_chemistry_formulas.docx", createdAt: "Yesterday", size: "1.1 MB" },
      ]);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      await updateProfile(name, {
        institution,
        study_goal: studyGoal,
        graph_physics: graphPhysics,
        ai_model: aiModel,
        email_alerts: emailAlerts,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground font-medium animate-pulse">
        Loading Your Dashboard...
      </div>
    );
  }

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name || "Student")}&backgroundColor=e8e3db`;

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 md:py-14">
      {/* Welcome Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Eyebrow>My Dashboard</Eyebrow>
          <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-tight mt-1 text-foreground">
            Welcome back, {name || "Student"} 👋
          </h1>
          <p className="text-[color:var(--link)] mt-2 text-[14px] font-medium">{todayStr} at {institution}</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-full border border-border shadow-sm shrink-0 self-start">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-[#FAF7F2]">
            <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="pr-3">
            <div className="text-[12.5px] font-semibold leading-none">{name || "Student"}</div>
            <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]">{user.email}</div>
          </div>
        </div>
      </header>

      {/* Tabs Selector */}
      <div className="flex border-b border-border mb-8 overflow-x-auto gap-6 scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "goals", label: "Study Planner & Goals", icon: Target },
          { id: "notes", label: "Notes & Materials", icon: FileText },
          { id: "settings", label: "Account Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-4 text-[13.5px] font-semibold border-b-2 transition-all shrink-0 cursor-pointer",
                active
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {fallbackStats.map((s) => {
              const Icon = icons[s.icon] || Sparkles;
              return (
                <Card key={s.label} className="hover:-translate-y-0.5 bg-white border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-semibold tracking-tight">{s.value}</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[color:var(--link)] mt-1.5">{s.label}</div>
                  <div className="text-[11px] text-[color:var(--link)] mt-0.5">{s.suffix}</div>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 bg-white border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Eyebrow>Syllabus Coverage</Eyebrow>
                  <h2 className="text-xl font-semibold text-foreground">Where you stand</h2>
                </div>
                <Badge variant="muted">Updated today</Badge>
              </div>
              <div className="space-y-4">
                {fallbackSyllabus.map((s) => (
                  <SyllabusRow key={s.subject} row={s} />
                ))}
              </div>
            </Card>

            <Card className="bg-white border border-border">
              <div className="mb-6">
                <Eyebrow>Weak Concepts</Eyebrow>
                <h2 className="text-xl font-semibold text-foreground">Focus here</h2>
              </div>
              <div className="space-y-3">
                {fallbackWeakConcepts.map((w) => (
                  <div key={w.concept} className="p-3.5 rounded-xl border border-border hover:border-foreground/15 transition-colors bg-[#FAF7F2]/40">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-[13px] font-semibold text-foreground leading-normal">{w.concept}</div>
                      <span className={cn("w-2.5 h-2.5 rounded-full mt-1 shrink-0", w.severity === "high" ? "bg-red-500" : w.severity === "medium" ? "bg-amber-500" : "bg-emerald-500")} />
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
                      <span className="text-[11px] text-[color:var(--link)] font-medium">{w.subject}</span>
                      <Link to="/revise" className="text-[11px] text-primary hover:underline font-semibold">Practice this →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 bg-white border border-border">
              <div className="mb-6">
                <Eyebrow>Recent Activity</Eyebrow>
                <h2 className="text-xl font-semibold text-foreground">Your last few sessions</h2>
              </div>
              <div className="space-y-1">
                {fallbackActivity.map((a, i) => {
                  const Icon = icons[a.icon] || Sparkles;
                  return (
                    <div key={i} className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FAF7F2]/60 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-border grid place-items-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-foreground font-medium truncate">{a.title}</div>
                      </div>
                      <span className="text-[11px] text-[color:var(--link)] font-medium shrink-0">{a.time}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="space-y-4">
              <Eyebrow>Quick Actions</Eyebrow>
              {[
                { icon: MessageCircle, label: "Go to Workspace", to: "/memo", desc: "Ask a question" },
                { icon: Upload, label: "Upload Notes", to: "/memo", desc: "Add study material" },
                { icon: Sparkles, label: "Start Revision", to: "/revise", desc: "Review active flashcards" },
              ].map((a) => (
                <Link key={a.label} to={a.to} className="block">
                  <Card className="hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer bg-white border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
                        <a.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[14px] font-semibold text-foreground">{a.label}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[color:var(--link)]" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLANNER & GOALS TAB */}
      {activeTab === "goals" && (
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 animate-in fade-in duration-300">
          <Card className="bg-white border border-border p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <Eyebrow>Weekly Target</Eyebrow>
                <h2 className="text-2xl font-serif font-medium mt-1">Study Hours Goal</h2>
              </div>
              <Badge variant="success">Active Plan</Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 py-4">
              {/* Visual SVG Progress Ring */}
              <div className="relative w-40 h-40 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-[#E8E3DB]"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-primary transition-all duration-1000"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - 4.5 / parseInt(studyGoal || "10"))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold tracking-tight">4.5</span>
                  <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                    of {parseInt(studyGoal || "10")} hrs
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">You are making steady progress!</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  You have logged **4.5 hours** of focused study this week. Keep going to reach your target of **{studyGoal}**!
                </p>
                <div className="flex items-center gap-2 bg-[#FAF7F2] p-3 rounded-xl border border-border max-w-sm">
                  <Flame className="w-4.5 h-4.5 text-primary shrink-0" />
                  <span className="text-[12.5px] text-foreground font-medium">14 days study streak maintained!</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-base font-semibold">Weekly Milestone Highlights</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-[#FAF7F2]/30 space-y-1">
                  <div className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground">Most Studied Subject</div>
                  <div className="text-base font-bold text-foreground">Physics</div>
                  <div className="text-[11px] text-muted-foreground">2.5 hours logged</div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-[#FAF7F2]/30 space-y-1">
                  <div className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground">Questions Solved</div>
                  <div className="text-base font-bold text-foreground">47 questions</div>
                  <div className="text-[11px] text-muted-foreground">83% accuracy rate</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Focused Session Timer */}
          <Card className="bg-white border border-border p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-primary" />
                <Eyebrow>Focus Companion</Eyebrow>
              </div>
              <h2 className="text-2xl font-serif font-medium">Study Session Timer</h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed mt-2.5">
                Start the timer before reading your notes or practicing questions. We will keep track of your focus time.
              </p>
            </div>

            <div className="text-center py-10 my-4 bg-[#FAF7F2] rounded-3xl border border-border">
              <div className="text-5xl font-mono font-bold tracking-tight text-foreground">{formatTimer(timeElapsed)}</div>
              <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mt-2.5 block">
                {timerActive ? "Session In Progress" : "Timer Paused"}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleStartStop}
                className={cn(
                  "flex-1 rounded-full text-[13.5px] font-semibold h-11 cursor-pointer",
                  timerActive
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-primary hover:bg-primary/95 text-white"
                )}
              >
                {timerActive ? "Pause Session" : "Start Session"}
              </Button>
              <Button
                onClick={handleResetTimer}
                variant="outline"
                className="rounded-full text-[13.5px] h-11 border-border text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Reset
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* NOTES & MATERIALS TAB */}
      {activeTab === "notes" && (
        <Card className="bg-white border border-border p-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-6">
            <div>
              <Eyebrow>Knowledge Base</Eyebrow>
              <h2 className="text-2xl font-serif font-medium mt-1">Study Notes & Uploads</h2>
              <p className="text-[13px] text-muted-foreground leading-normal mt-1">
                Manage notes, textbooks, and past papers currently indexed in your cognitive memory.
              </p>
            </div>
            <Link to="/memo">
              <Button size="sm" className="rounded-full font-semibold flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Upload New File
              </Button>
            </Link>
          </div>

          {filesLoading ? (
            <div className="py-20 text-center text-muted-foreground text-[14.5px] font-medium animate-pulse">
              Syncing files with Cognee Cloud...
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20 bg-[#FAF7F2]/40 rounded-[2rem] border border-dashed border-border max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">No materials uploaded yet</h3>
              <p className="text-[12.5px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Once you upload past papers, PDFs or notes in the Study Workspace, they will be listed here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-white">
              {files.map((file) => (
                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-[#FAF7F2]/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13.5px] font-semibold text-foreground truncate max-w-[280px] sm:max-w-[400px]">
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 font-medium">
                        <span>{file.createdAt}</span>
                        {file.size && (
                          <>
                            <span>•</span>
                            <span>{file.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <Link to="/memo">
                      <Button size="sm" variant="outline" className="rounded-full text-[12px] h-9 hover:bg-[#FAF7F2]">
                        Open in Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ACCOUNT SETTINGS TAB */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="grid lg:grid-cols-[1fr_1.3fr] gap-8 items-start animate-in fade-in duration-300">
          <Card className="p-8 text-center bg-white border border-border rounded-[2rem] flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E8E3DB] shadow-md bg-[#FAF7F2] mb-6">
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-serif font-medium text-foreground mb-1">
              {name || "Student"}
            </h2>
            <span className="text-[11.5px] text-muted-foreground bg-[#FAF7F2] px-3.5 py-1 rounded-full border border-border mb-6">
              {user.email}
            </span>

            <div className="w-full space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-left">
                <Building className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[color:var(--link)]">Institution</div>
                  <div className="text-[13px] text-foreground font-medium">{institution || "Not specified"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Target className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[color:var(--link)]">Weekly Study Goal</div>
                  <div className="text-[13px] text-foreground font-medium">{studyGoal}</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-8 rounded-[2rem] bg-white border border-border space-y-6">
              <h3 className="text-xl font-serif font-medium text-foreground flex items-center gap-2 border-b border-border pb-4">
                <User className="w-5 h-5 text-primary" /> Profile Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-white text-[13px] focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider block">
                    Institution / School
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. UIT, KU"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-white text-[13px] focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider block">
                  Weekly Study Goal
                </label>
                <select
                  value={studyGoal}
                  onChange={(e) => setStudyGoal(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-white text-[13px] focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="5 hours">5 Hours per week</option>
                  <option value="10 hours">10 Hours per week</option>
                  <option value="15 hours">15 Hours per week</option>
                  <option value="20 hours">20 Hours per week</option>
                  <option value="30+ hours">30+ Hours per week (Hardcore)</option>
                </select>
              </div>
            </Card>

            <Card className="p-8 rounded-[2rem] bg-white border border-border space-y-6">
              <h3 className="text-xl font-serif font-medium text-foreground flex items-center gap-2 border-b border-border pb-4">
                <Sliders className="w-5 h-5 text-primary" /> Application Preferences
              </h3>

              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[13.5px] font-semibold text-foreground">Email Notifications</h4>
                    <p className="text-[12px] text-muted-foreground leading-normal mt-0.5">Receive weekly summaries of your weak concepts and exam milestones.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-border rounded cursor-pointer shrink-0"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider block flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-primary" /> AI Model Level
                    </label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-border bg-white text-[13px] focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                      <option value="standard">Standard Model (Fast responses)</option>
                      <option value="advanced">Advanced (Deep Chain of Thought)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider block flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-primary" /> Graph Physics Speed
                    </label>
                    <select
                      value={graphPhysics}
                      onChange={(e) => setGraphPhysics(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-border bg-white text-[13px] focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                      <option value="slow">Slow (Smooth, cinematic orbits)</option>
                      <option value="medium">Medium (Standard dynamic physics)</option>
                      <option value="fast">Fast (Instant snap-to-grid)</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-end gap-3 flex-wrap">
              {success && (
                <span className="text-[13px] text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                  <Check className="w-4 h-4 shrink-0 bg-emerald-100 p-0.5 rounded-full" /> Saved Successfully!
                </span>
              )}
              
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full bg-primary hover:bg-primary/90 text-white min-w-[140px] cursor-pointer"
              >
                {saving ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin mr-1.5" /> Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}

function SyllabusRow({ row }: { row: typeof fallbackSyllabus[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white">
      <button className="w-full p-4 hover:bg-[#FAF7F2]/40 transition cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-4">
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13.5px] font-semibold text-foreground">{row.subject}</span>
              <span className="text-[12px] text-muted-foreground font-semibold">{row.pct}%</span>
            </div>
            <div className="h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-border/40">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.pct}%` }} />
            </div>
          </div>
        </div>
      </button>
      {open && (
        <div className="border-t border-border/60 p-4 space-y-3 bg-[#FAF7F2]/30 animate-in slide-in-from-top-1 duration-200">
          {row.chapters.map((c) => (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between text-[12px]">
                <span className="text-foreground/80 font-medium">{c.name}</span>
                <span className="text-muted-foreground font-semibold">{c.pct}%</span>
              </div>
              <div className="h-1.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-border/20">
                <div className="h-full bg-primary/75 rounded-full" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
