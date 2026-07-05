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
  Settings,
  Sliders,
  Cpu,
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
  const [institution, setInstitution] = useState("Not Set");
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
      setInstitution(user.user_metadata?.institution || "Not Set");
      setStudyGoal(user.user_metadata?.study_goal || "10 hours");
      setGraphPhysics(user.user_metadata?.graph_physics || "medium");
      setAiModel(user.user_metadata?.ai_model || "standard");
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

  // Dynamic user data computations
  const [stats, setStats] = useState([
    { label: "Study Streak", value: "0", suffix: "days", icon: "flame" },
    { label: "Questions Asked", value: "0", suffix: "asked", icon: "message" },
    { label: "Topics Covered", value: "0%", suffix: "of syllabus", icon: "book" },
    { label: "Mistakes Tracked", value: "0", suffix: "active", icon: "alert" },
  ]);

  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [weakConcepts, setWeakConcepts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedThreads = localStorage.getItem("studymind_chat_threads");
      let totalQuestions = 0;
      const uniqueSubjects = new Set<string>();
      const activities: any[] = [];
      const weakList: any[] = [];

      if (savedThreads) {
        const threads = JSON.parse(savedThreads);
        if (Array.isArray(threads)) {
          threads.forEach((t: any) => {
            if (t.datasetName) {
              uniqueSubjects.add(t.datasetName);
            }
            
            const threadDate = new Date(t.updatedAt || Date.now());
            const dateStr = threadDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            
            t.messages.forEach((msg: any, i: number) => {
              if (msg.role === "user") {
                totalQuestions++;
                activities.push({
                  icon: "message",
                  title: `Asked: "${msg.text.length > 35 ? msg.text.slice(0, 35) + "..." : msg.text}"`,
                  time: dateStr,
                });
              }
            });

            // Count AI answers that didn't come from verified source
            const unverifiedAnswersCount = t.messages.filter((m: any) => m.role === "ai" && !m.verified).length;
            if (unverifiedAnswersCount > 0) {
              weakList.push({
                concept: t.title || "Untitled Concept",
                subject: t.datasetName || "General",
                severity: unverifiedAnswersCount >= 2 ? "high" : "medium",
              });
            }
          });
        }
      }

      const activeStreak = "0";

      // Dynamic stats structure
      setStats([
        { label: "Study Streak", value: activeStreak, suffix: "days", icon: "flame" },
        { label: "Questions Asked", value: totalQuestions.toString(), suffix: "asked", icon: "message" },
        { label: "Topics Covered", value: uniqueSubjects.size > 0 ? `${Math.min(uniqueSubjects.size * 25, 100)}%` : "0%", suffix: "completed", icon: "book" },
        { label: "Mistakes Tracked", value: weakList.length.toString(), suffix: "active", icon: "alert" },
      ]);

      // Dynamic syllabus calculation
      const dynamicSyllabus = Array.from(uniqueSubjects).map((sub) => {
        const subThreads = JSON.parse(savedThreads || "[]").filter((t: any) => t.datasetName === sub);
        const chapters = subThreads.map((t: any) => ({
          name: t.title || "Untitled Topic",
          pct: t.messages.length > 3 ? 100 : 50,
        }));
        const avgPct = chapters.length > 0
          ? Math.round(chapters.reduce((sum: number, c: any) => sum + c.pct, 0) / chapters.length)
          : 0;

        return {
          subject: sub,
          pct: avgPct,
          chapters,
        };
      });
      setSyllabus(dynamicSyllabus);

      // Activities limited to latest 5
      setRecentActivity(activities.slice(0, 5));

      // Weak Concepts limited to latest 4
      setWeakConcepts(weakList.slice(0, 4));

    } catch (e) {
      console.error("Failed to build dashboard stats:", e);
    }
  }, []);

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
        setFiles([]);
      }
    } catch (err) {
      console.error("Failed to load dataset files in dashboard:", err);
      setFiles([]);
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

  const parsedGoalHours = parseInt(studyGoal.replace(/[^0-9]/g, "")) || 10;
  const timerHours = timeElapsed / 3600;
  const goalProgressPercentage = Math.min(Math.round((timerHours / parsedGoalHours) * 100), 100);

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
            {stats.map((s) => {
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
                {syllabus.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-border rounded-2xl bg-white text-muted-foreground text-[13px]">
                    No subjects studied yet. Ask questions in the study workspace to populate your syllabus progress map.
                  </div>
                ) : (
                  syllabus.map((s) => (
                    <SyllabusRow key={s.subject} row={s} />
                  ))
                )}
              </div>
            </Card>

            <Card className="bg-white border border-border">
              <div className="mb-6">
                <Eyebrow>Weak Concepts</Eyebrow>
                <h2 className="text-xl font-semibold text-foreground">Focus here</h2>
              </div>
              <div className="space-y-3">
                {weakConcepts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-[#FAF7F2]/30 text-muted-foreground text-[13px] px-4 leading-relaxed">
                    No weak concepts identified. Practice revision decks or get verified AI answers to track focus areas!
                  </div>
                ) : (
                  weakConcepts.map((w) => (
                    <div key={w.concept} className="p-3.5 rounded-xl border border-border hover:border-foreground/15 transition-colors bg-[#FAF7F2]/40">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-[13px] font-semibold text-foreground leading-normal">{w.concept}</div>
                        <span className={cn("w-2.5 h-2.5 rounded-full mt-1 shrink-0", w.severity === "high" ? "bg-red-500" : w.severity === "medium" ? "bg-amber-500" : "bg-emerald-500")} />
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
                        <span className="text-[11px] text-[color:var(--link)] font-medium">{w.subject}</span>
                        <Link to="/question-bank?tab=revise" className="text-[11px] text-primary hover:underline font-semibold">Practice this →</Link>
                      </div>
                    </div>
                  ))
                )}
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
                {recentActivity.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-[13px]">
                    No study activity recorded. Start typing in the workspace to log your progress!
                  </div>
                ) : (
                  recentActivity.map((a, i) => {
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
                  })
                )}
              </div>
            </Card>

            <div className="space-y-4">
              <Eyebrow>Quick Actions</Eyebrow>
              {[
                { icon: MessageCircle, label: "Go to Workspace", to: "/memo", desc: "Ask a question" },
                { icon: Upload, label: "Upload Notes", to: "/memo", desc: "Add study material" },
                { icon: Sparkles, label: "Start Revision", to: "/question-bank?tab=revise", desc: "Review active flashcards" },
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

      {/* STUDY PLANNER & GOALS TAB */}
      {activeTab === "goals" && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          {/* Progress Goal */}
          <Card className="bg-white border border-border p-8">
            <Eyebrow>Weekly Target</Eyebrow>
            <h2 className="text-2xl font-serif font-medium mt-1">Study Hours Goal</h2>
            <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
              Your weekly hours target is configured inside the settings below.
            </p>

            <div className="flex flex-col items-center justify-center py-12 my-6 bg-[#FAF7F2] rounded-3xl border border-border relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="rgba(0,0,0,0.03)" strokeWidth="10" fill="transparent" />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="var(--color-primary)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - goalProgressPercentage / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{goalProgressPercentage}%</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Complete</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[13px] font-medium border-t border-border/60 pt-4">
              <span className="text-muted-foreground">Logged This Week</span>
              <span className="text-foreground font-bold">{timerHours.toFixed(1)} hrs / {parsedGoalHours} hrs</span>
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
                className={cn("flex-1 h-12 rounded-full font-semibold cursor-pointer", timerActive ? "bg-amber-600 hover:bg-amber-700" : "bg-primary")}
              >
                {timerActive ? "Pause Focus" : "Start Focus Session"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResetTimer}
                className="px-6 h-12 rounded-full font-semibold border-border cursor-pointer"
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
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <div>
              <Eyebrow>Knowledge Base</Eyebrow>
              <h2 className="text-2xl font-serif font-medium mt-1">Study Materials</h2>
            </div>
            <Link to="/memo">
              <Button className="rounded-full flex items-center gap-2 h-10 font-semibold text-[13px] cursor-pointer">
                <Upload className="w-4 h-4" /> Add Materials
              </Button>
            </Link>
          </div>

          {filesLoading ? (
            <div className="text-center py-20 text-[13px] text-muted-foreground animate-pulse font-semibold">
              Loading your study files...
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-[#FAF7F2]/20">
              <FileText className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
              <h3 className="text-[15.5px] font-semibold text-foreground mb-1">No uploaded files</h3>
              <p className="text-[13px] text-muted-foreground max-w-xs mx-auto mb-6 leading-relaxed">
                Add PDFs, study guides, or textbook notes in the Workspace to query them.
              </p>
              <Link to="/memo">
                <Button variant="outline" className="rounded-full text-[12.5px] font-semibold">Upload Your First File</Button>
              </Link>
            </div>
          ) : (
            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-white hover:bg-[#FAF7F2]/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-foreground truncate">{file.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Added {file.createdAt} • {file.size}</div>
                    </div>
                  </div>
                  <Link to="/memo">
                    <Button variant="outline" size="sm" className="rounded-full text-[12px] font-semibold cursor-pointer">Chat</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ACCOUNT SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 animate-in fade-in duration-300">
          <Card className="bg-white border border-border p-8">
            <Eyebrow>Configuration</Eyebrow>
            <h2 className="text-2xl font-serif font-medium mt-1 mb-6">Account & Preferences</h2>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-border rounded-xl px-4 py-2.5 text-[13.5px] focus:outline-none focus:border-primary/50 font-medium"
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground">School / Institution</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-border rounded-xl px-4 py-2.5 text-[13.5px] focus:outline-none focus:border-primary/50 font-medium"
                    placeholder="Enter school"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground">Weekly Target Hours</label>
                  <select
                    value={studyGoal}
                    onChange={(e) => setStudyGoal(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-border rounded-xl px-3 py-2.5 text-[13.5px] focus:outline-none focus:border-primary/50 cursor-pointer font-medium"
                  >
                    <option value="5 hours">5 hours / week</option>
                    <option value="10 hours">10 hours / week</option>
                    <option value="15 hours">15 hours / week</option>
                    <option value="20 hours">20 hours / week</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground">AI Model Engine</label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-border rounded-xl px-3 py-2.5 text-[13.5px] focus:outline-none focus:border-primary/50 cursor-pointer font-medium"
                  >
                    <option value="standard">Memoria Standard (Fast)</option>
                    <option value="pro">Memoria Pro (Complex Queries)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="alerts"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4.5 h-4.5 accent-primary cursor-pointer"
                />
                <label htmlFor="alerts" className="text-[13px] font-medium text-foreground select-none cursor-pointer">
                  Receive weekly study consistency summary emails
                </label>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-full px-8 h-11 font-semibold text-[13.5px] cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
                {success && (
                  <span className="text-[12.5px] font-bold text-emerald-600 animate-in fade-in duration-300">
                    Preferences saved successfully!
                  </span>
                )}
              </div>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="bg-white border border-border">
              <Eyebrow>Model Tuning</Eyebrow>
              <h3 className="text-[14.5px] font-bold text-foreground mt-1 mb-4 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-primary" /> Memory Retrieval Weights
              </h3>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed mb-6">
                Optimize search recall ratios for notes compared to logged exam error cards.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: "Past Papers & Guides", value: 40 },
                  { label: "Classroom Notes", value: 45 },
                  { label: "Revision Log Mistakes", value: 15 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-[12px] font-semibold">
                      <span className="text-foreground/80">{item.label}</span>
                      <span className="text-primary">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-border/20">
                      <div className="h-full bg-primary/80 rounded-full" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white border border-border">
              <Eyebrow>AI Engine</Eyebrow>
              <div className="flex items-center gap-3.5 mt-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-foreground">Gemini 1.5 Flash</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Active search backend</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}

function SyllabusRow({ row }: { row: { subject: string; pct: number; chapters: { name: string; pct: number }[] } }) {
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
