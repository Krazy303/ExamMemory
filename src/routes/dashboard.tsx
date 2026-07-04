import { useAuth } from "@/context/AuthContext";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Upload,
  ArrowRight,
  Sparkles,
  MessageCircle,
  History,
  FileText,
  Clock
} from "lucide-react";
import {
  Card,
  Eyebrow,
} from "@/components/studymind/primitives";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Memoria" },
      {
        name: "description",
        content: "Your personalized study workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/sign-in" });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  const userName = user?.user_metadata?.full_name || "Student";
  const userEmail = user?.email || "";
  // Generate a random, cute avatar using DiceBear Notionists style based on the user's name
  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(userName)}&backgroundColor=e8e3db`;

  return (
    <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 md:py-14">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E8E3DB] shadow-sm bg-[#FAF7F2] shrink-0">
          <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left flex-1">
          <Eyebrow>Your Profile</Eyebrow>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mt-1">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground mt-1 text-[15px]">{userEmail}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <Eyebrow>Quick Actions</Eyebrow>
          {[
            {
              icon: MessageCircle,
              label: "Chat with Memoria",
              to: "/memo",
              desc: "Ask questions based on your notes",
            },
            {
              icon: Upload,
              label: "Upload New Material",
              to: "/memo",
              desc: "Add PDFs, Word docs, or Text",
            },
            {
              icon: Sparkles,
              label: "Start Revision",
              to: "/revise",
              desc: "Review your active flashcards",
            },
          ].map((a) => (
            <Link key={a.label} to={a.to} className="block">
              <Card className="hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer p-5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <a.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-foreground">{a.label}</div>
                    <div className="text-[13px] text-muted-foreground truncate mt-0.5">
                      {a.desc}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <Eyebrow>Recent Activity</Eyebrow>
          <Card className="p-5 h-full min-h-[300px]">
            <div className="space-y-4">
              {[
                { title: "Chatted about Photosynthesis", time: "2 hours ago", icon: MessageCircle },
                { title: "Uploaded 'Biology_Chapter_4.pdf'", time: "Yesterday", icon: FileText },
                { title: "Reviewed 15 flashcards", time: "2 days ago", icon: History },
                { title: "Created Subject: Physics 101", time: "3 days ago", icon: Clock },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E3DB] flex items-center justify-center shrink-0 shadow-sm">
                    <activity.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-foreground truncate">{activity.title}</div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
