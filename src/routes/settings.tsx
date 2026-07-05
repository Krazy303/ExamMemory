import { useAuth } from "@/context/AuthContext";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Sliders,
  Check,
  RotateCw,
  Cpu,
  Database,
  Building,
  Target
} from "lucide-react";
import {
  Card,
  Eyebrow,
  Button,
} from "@/components/studymind/primitives";
import { Reveal } from "@/components/studymind/primitives";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Memoria" },
      {
        name: "description",
        content: "Manage your user profile and application settings.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/sign-in" });
    }
  }, [user, loading, navigate]);

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("UIT, KU");
  const [studyGoal, setStudyGoal] = useState("10 hours");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [graphPhysics, setGraphPhysics] = useState("medium");
  const [aiModel, setAiModel] = useState("standard");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-populate fields when user context is loaded
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

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Simulate network delay
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

  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name || "Student")}&backgroundColor=e8e3db`;

  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-8 pt-28 md:pt-36 pb-20">
      <header className="mb-14 text-center max-w-3xl mx-auto">
        <Eyebrow>Account Control</Eyebrow>
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-wide mt-2 text-foreground">
          Settings
        </h1>
        <p className="text-[15.5px] text-muted-foreground mt-4 leading-relaxed">
          Manage your personal details, institution focus, cognitive model preferences, and active local settings.
        </p>
      </header>

      <form onSubmit={handleSave} className="grid lg:grid-cols-[1fr_1.3fr] gap-8 items-start">
        {/* Profile Card & Avatar */}
        <div className="space-y-6">
          <Card className="p-8 text-center bg-white border border-border rounded-[2rem] flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#E8E3DB] shadow-md bg-[#FAF7F2] mb-6">
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-serif font-medium text-foreground mb-1">
              {name || "Student"}
            </h2>
            <span className="text-[12px] text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border mb-6">
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
        </div>

        {/* Profile Settings form fields */}
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

          {/* Preferences & System Settings */}
          <Card className="p-8 rounded-[2rem] bg-white border border-border space-y-6">
            <h3 className="text-xl font-serif font-medium text-foreground flex items-center gap-2 border-b border-border pb-4">
              <Sliders className="w-5 h-5 text-primary" /> Application Preferences
            </h3>

            <div className="space-y-5">
              {/* Email Toggle */}
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

              {/* Model Choice */}
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

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link to="/memo">
              <Button type="button" variant="outline" className="rounded-full">
                Cancel & Return
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              {success && (
                <span className="text-[13px] text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-4 h-4 shrink-0 bg-emerald-100 p-0.5 rounded-full" /> Saved Successfully!
                </span>
              )}
              
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full bg-primary hover:bg-primary/90 text-white min-w-[140px]"
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
        </div>
      </form>
    </main>
  );
}
