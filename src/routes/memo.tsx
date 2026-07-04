import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  Upload,
  Send,
  FileText,
  Database,
  Cpu,
  History,
  Sparkles,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Check,
  Copy,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Trash2,
  CheckCircle2,
  RotateCw,
} from "lucide-react";
import { AppNavbar } from "@/components/studymind/Navbar";
import { Button, Badge, Modal } from "@/components/studymind/primitives";
import { student, type ChatMessage } from "@/data/mock";
import { cn } from "@/lib/utils";
import {
  cogneeSearch,
  cogneeRememberText,
  cogneeGetMemoSidebarData,
  cogneeGetDatasetFiles,
  cogneeSummarizeText,
  cogneeDeleteDataset,
} from "@/lib/cognee";
import { Markdown } from "@/components/studymind/Markdown";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/memo")({
  head: () => ({
    meta: [
      { title: "Workspace — Memoria" },
      {
        name: "description",
        content:
          "Chat with Memoria. Every answer is grounded in your own notes and past papers.",
      },
    ],
  }),
  component: MemoPage,
});

interface ChatThread {
  id: string;
  title: string;
  datasetName: string;
  searchType: string;
  messages: ChatMessage[];
  updatedAt: string;
}

const welcomeMessage: ChatMessage[] = [
  {
    id: "welcome",
    role: "ai",
    text: "Welcome to your Memoria Workspace! 🚀\n\nI am your persistent-memory AI study companion powered by Cognee Cloud. I can analyze and answer complex queries grounded in the files you upload.\n\n### How to get started:\n1. Click the **Upload Notes** button in the sidebar or below to index some study files (PDFs, TXT, MD) into memory.\n2. Choose your **Memory Dataset** and **Search Type** in the sidebar.\n3. Type your question in the chat box to search!",
  },
];

const SUGGESTED_PROMPTS = [
  "Summarize the main concepts in my notes",
  "What is the key takeaway from the uploaded guide?",
  "List any formulas or definitions found in my data",
  "Generate 3 practice questions based on my notes",
];

function MemoPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/sign-in" });
    }
  }, [user, loading, navigate]);

  const [messages, setMessages] = useState<ChatMessage[]>(welcomeMessage);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Cognee States
  const [datasetsList, setDatasetsList] = useState<
    { id: string; name: string }[]
  >([{ id: "default_dataset", name: "default_dataset" }]);
  const [selectedDataset, setSelectedDataset] = useState("default_dataset");
  const [searchType, setSearchType] = useState("GRAPH_COMPLETION");
  const [datasetFiles, setDatasetFiles] = useState<any[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Create subject states
  const [createSubjectOpen, setCreateSubjectOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [creatingSubject, setCreatingSubject] = useState(false);

  // Chat Threads local-storage states
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [answerLength, setAnswerLength] = useState<"short" | "auto" | "long">(
    "auto",
  );
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  // Load Datasets from Cognee Cloud
  const fetchDatasets = async () => {
    try {
      const res = await cogneeGetMemoSidebarData();
      if (res && !res.isMock && res.datasets && res.datasets.length > 0) {
        setDatasetsList(res.datasets);

        // Make sure active selection is present in the list, otherwise select the first item
        const hasActive = res.datasets.some(
          (d: any) => d.name === selectedDataset,
        );
        if (!hasActive) {
          setSelectedDataset(res.datasets[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to load datasets:", err);
    }
  };

  // Load threads from LocalStorage and datasets list
  useEffect(() => {
    // 1. Load Local Chat Threads
    const saved = localStorage.getItem("studymind_chat_threads");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setThreads(parsed);
        }
      } catch (e) {
        console.error("Failed to parse local chat threads:", e);
      }
    }

    fetchDatasets();
  }, []);

  // Load Files for Selected Dataset
  const fetchDatasetFiles = async (datasetName: string) => {
    setFilesLoading(true);
    try {
      const res = await cogneeGetDatasetFiles({ data: { datasetName } });
      if (res && !res.isMock && res.files) {
        setDatasetFiles(res.files);
      } else {
        setDatasetFiles([]);
      }
    } catch (err) {
      console.error("Failed to fetch dataset files:", err);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasetFiles(selectedDataset);
  }, [selectedDataset]);

  // Save threads helper
  const saveThreadsToLocalStorage = (updatedThreads: ChatThread[]) => {
    localStorage.setItem(
      "studymind_chat_threads",
      JSON.stringify(updatedThreads),
    );
    setThreads(updatedThreads);
  };

  // Start a new clean chat thread
  const startNewChat = () => {
    setActiveThreadId(null);
    setMessages(welcomeMessage);
  };

  // Switch to an existing thread
  const selectThread = (thread: ChatThread) => {
    setActiveThreadId(thread.id);
    setMessages(thread.messages);
    setSelectedDataset(thread.datasetName);
    setSearchType(thread.searchType);
  };

  // Delete an existing thread
  const deleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering thread select
    const updated = threads.filter((t) => t.id !== threadId);
    saveThreadsToLocalStorage(updated);
    if (activeThreadId === threadId) {
      startNewChat();
    }
  };

  const send = async (queryText?: string) => {
    const activeQuery = queryText || input;
    if (!activeQuery.trim()) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: Date.now() + "u",
      role: "user",
      text: activeQuery,
    };
    const newMessages = [...(activeThreadId ? messages : []), userMsg];

    // Optimistic UI update
    setMessages(newMessages);
    setInput("");
    setTyping(true);

    // If it's a new thread, create the thread object first
    let threadId = activeThreadId;
    let tempThreads = [...threads];

    if (!threadId) {
      threadId = Date.now().toString();
      const newThread: ChatThread = {
        id: threadId,
        title:
          activeQuery.length > 30
            ? activeQuery.slice(0, 30) + "..."
            : activeQuery,
        datasetName: selectedDataset,
        searchType: searchType,
        messages: [userMsg],
        updatedAt: new Date().toISOString(),
      };
      tempThreads = [newThread, ...tempThreads];
      saveThreadsToLocalStorage(tempThreads);
      setActiveThreadId(threadId);
    } else {
      // Append user query to existing thread messages
      tempThreads = tempThreads.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: [...t.messages, userMsg],
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      saveThreadsToLocalStorage(tempThreads);
    }

    // Append answer length and strict style instructions to RAG context query
    let queryWithLength = activeQuery;

    // Add strict style instruction to remove conversational filler
    queryWithLength +=
      "\n\nStyle instruction: Do not start with conversational greetings, pleasantries, or introductory filler (e.g. 'Hey there!', 'Sure, here is...', 'Let's get started'). Answer the question directly, concisely, and immediately, starting with the factual answer.";

    if (answerLength === "short") {
      queryWithLength +=
        " Provide a brief, concise answer (under 3 sentences).";
    } else if (answerLength === "long") {
      queryWithLength +=
        " Provide a detailed, highly comprehensive breakdown with all relevant details.";
    }

    // Check if we already have a cached response for this exact query in this Subject database
    const cleanQuery = activeQuery.trim().toLowerCase();
    let cachedResponse: any = null;

    for (const t of threads) {
      if (t.datasetName === selectedDataset && Array.isArray(t.messages)) {
        for (let i = 0; i < t.messages.length - 1; i++) {
          const m = t.messages[i];
          const nextM = t.messages[i + 1];
          if (
            m.role === "user" &&
            m.text.trim().toLowerCase() === cleanQuery &&
            nextM.role === "ai" &&
            !nextM.text.startsWith("Error:")
          ) {
            cachedResponse = {
              answer: nextM.text,
              sources: nextM.sources,
              consistency: nextM.consistency,
              summary: nextM.summary,
              verified: nextM.verified,
            };
            break;
          }
        }
      }
      if (cachedResponse) break;
    }

    try {
      let response;
      if (cachedResponse) {
        // Retrieve directly from local cache
        response = cachedResponse;
      } else {
        response = await cogneeSearch({
          data: {
            query: queryWithLength,
            datasetName: selectedDataset,
            searchType: searchType,
          },
        });
      }

      const aiMsg: ChatMessage = {
        id: Date.now() + "a",
        role: "ai",
        text: response.answer,
        sources: response.sources,
        consistency: response.consistency,
        summary: response.summary,
        verified: response.verified,
      };

      const finalizedMessages = [...newMessages, aiMsg];
      setMessages(finalizedMessages);

      // Append AI response to thread and persist
      const updatedThreads = tempThreads.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: finalizedMessages,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      saveThreadsToLocalStorage(updatedThreads);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Date.now() + "err",
        role: "ai",
        text: `Error: Failed to fetch response from Cognee Cloud.\n\nDetail: ${err.message || "Unknown error"}`,
      };
      const finalizedMessages = [...newMessages, errorMsg];
      setMessages(finalizedMessages);

      const updatedThreads = tempThreads.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: finalizedMessages,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      saveThreadsToLocalStorage(updatedThreads);
    } finally {
      setTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMarkQuestion = async (msgId: string, fullText: string) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    const isCurrentlyVerified = targetMsg ? !!targetMsg.verified : false;

    if (isCurrentlyVerified) {
      const updatedMessages = messages.map((m) => {
        if (m.id === msgId) {
          return { ...m, verified: false };
        }
        return m;
      });
      setMessages(updatedMessages);

      if (activeThreadId) {
        const updatedThreads = threads.map((t) => {
          if (t.id === activeThreadId) {
            return { ...t, messages: updatedMessages };
          }
          return t;
        });
        saveThreadsToLocalStorage(updatedThreads);
      }
      return;
    }

    // Reuse existing summary if present to save API tokens
    if (targetMsg && targetMsg.summary) {
      const updatedMessages = messages.map((m) => {
        if (m.id === msgId) {
          return { ...m, verified: true };
        }
        return m;
      });
      setMessages(updatedMessages);

      if (activeThreadId) {
        const updatedThreads = threads.map((t) => {
          if (t.id === activeThreadId) {
            return { ...t, messages: updatedMessages };
          }
          return t;
        });
        saveThreadsToLocalStorage(updatedThreads);
      }
      return;
    }

    setSummarizingId(msgId);
    try {
      const res = await cogneeSummarizeText({
        data: { text: fullText, datasetName: selectedDataset },
      });
      const summaryText = res?.summary || "";

      const updatedMessages = messages.map((m) => {
        if (m.id === msgId) {
          return { ...m, verified: true, summary: summaryText };
        }
        return m;
      });
      setMessages(updatedMessages);

      if (activeThreadId) {
        const updatedThreads = threads.map((t) => {
          if (t.id === activeThreadId) {
            return { ...t, messages: updatedMessages };
          }
          return t;
        });
        saveThreadsToLocalStorage(updatedThreads);
      }
    } catch (err) {
      console.error("Failed to summarize question:", err);
      const updatedMessages = messages.map((m) => {
        if (m.id === msgId) {
          return { ...m, verified: true };
        }
        return m;
      });
      setMessages(updatedMessages);
    } finally {
      setSummarizingId(null);
    }
  };

  const handleDeleteSubject = async (datasetName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Subject "${datasetName}"? This will permanently delete all associated documents and study history.`,
    );
    if (!confirmed) return;

    try {
      await cogneeDeleteDataset({ data: { datasetName } });

      const updatedList = datasetsList.filter((d) => d.name !== datasetName);
      setDatasetsList(updatedList);
      if (updatedList.length > 0) {
        setSelectedDataset(updatedList[0].name);
      }

      if (
        threads.some(
          (t) => t.id === activeThreadId && t.datasetName === datasetName,
        )
      ) {
        startNewChat();
      }

      alert(`Subject "${datasetName}" has been successfully deleted.`);
    } catch (err: any) {
      console.error(err);
      alert(`Error deleting subject: ${err.message || err}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AppNavbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Modern Sidebar (Like ChatGPT) */}
        <aside
          className={cn(
            "border-r border-border bg-[#FAF7F2] flex flex-col transition-all duration-300 overflow-hidden shrink-0",
            sidebarOpen ? "w-80" : "w-0",
          )}
        >
          {/* New Chat Button */}
          <div className="p-4 border-b border-border">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 hover:bg-muted border-border"
              size="sm"
              onClick={startNewChat}
            >
              <Plus className="w-4 h-4 text-primary" /> New Chat
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            {/* Subject Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" /> Subject
                </span>
                <button
                  onClick={() => setCreateSubjectOpen(true)}
                  className="text-primary hover:text-foreground hover:underline transition-colors text-[9px] uppercase tracking-wider font-bold"
                >
                  + Create New
                </button>
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full bg-white border border-border border border-border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-primary/50 text-foreground cursor-pointer hover:bg-muted transition-colors"
              >
                {datasetsList.map((d) => (
                  <option key={d.id} value={d.name} className="bg-[#FAF7F2]">
                    {d.name}
                  </option>
                ))}
              </select>

              {datasetsList.length > 1 && (
                <Button
                  onClick={() => handleDeleteSubject(selectedDataset)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 text-[11px] py-2 mt-2 transition-all duration-200"
                  size="sm"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" /> Delete Active
                  Subject
                </Button>
              )}
            </div>

            {/* Retrieval Search Type Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary" /> Cognitive Search
                Type
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full bg-white border border-border border border-border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-primary/50 text-foreground cursor-pointer hover:bg-muted transition-colors"
              >
                <option value="GRAPH_COMPLETION" className="bg-[#FAF7F2]">
                  Graph Completion (Knowledge Graph)
                </option>
                <option value="RAG_COMPLETION" className="bg-[#FAF7F2]">
                  RAG Completion (Document Chunks)
                </option>
                <option value="FEELING_LUCKY" className="bg-[#FAF7F2]">
                  Feeling Lucky (Auto-Select)
                </option>
                <option value="GRAPH_COMPLETION_COT" className="bg-[#FAF7F2]">
                  Chain of Thought Graph
                </option>
                <option value="CHUNKS" className="bg-[#FAF7F2]">
                  Verbatim Text Chunks
                </option>
              </select>
            </div>

            {/* Chat History List (Like ChatGPT) */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-primary" /> Chat Sessions
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {threads.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => selectThread(t)}
                    className={cn(
                      "group w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border text-left",
                      activeThreadId === t.id
                        ? "bg-primary/10 border-primary/25 text-foreground"
                        : "border-transparent hover:bg-muted text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div className="text-[12px] truncate">{t.title}</div>
                    </div>
                    <button
                      onClick={(e) => deleteThread(t.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 rounded transition-opacity"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {threads.length === 0 && (
                  <div className="text-[11px] text-[color:var(--link)] bg-white border border-dashed border-border rounded-xl p-4 text-center">
                    No recent conversations.
                  </div>
                )}
              </div>
            </div>

            {/* Indexed Files List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--link)] font-semibold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Indexed
                  Files
                </label>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-[11px] text-primary"
                  onClick={() => setUploadOpen(true)}
                >
                  + Add File
                </Button>
              </div>

              <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                {filesLoading ? (
                  <div className="text-[11px] text-[color:var(--link)] py-2 animate-pulse">
                    Loading dataset files...
                  </div>
                ) : datasetFiles.length > 0 ? (
                  datasetFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border hover:border-border transition-all text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium truncate text-foreground">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-[color:var(--link)] mt-0.5">
                          {file.createdAt}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[11.5px] text-[color:var(--link)] bg-white border border-dashed border-border rounded-xl p-4 text-center">
                    No indexed documents.
                    <br />
                    <span
                      className="text-[10.5px] text-primary/70 cursor-pointer hover:underline"
                      onClick={() => setUploadOpen(true)}
                    >
                      Upload one now →
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User profile footer */}
          <div className="p-4 border-t border-border flex items-center gap-3 bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary uppercase text-[12px]">
              {user?.user_metadata?.full_name?.slice(0, 2) || user?.email?.slice(0, 2) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium truncate text-foreground">
                {user?.user_metadata?.full_name || "Memoria User"}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {user?.email}
              </div>
            </div>
            <button 
              onClick={() => signOut()} 
              className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-red-500 transition-colors"
            >
              Log Out
            </button>
          </div>
        </aside>

        {/* Dynamic Chat Workspace Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Top Info Bar */}
          <div className="h-14 border-b border-border px-4 md:px-6 flex items-center justify-between gap-3 bg-[#FAF7F2]/40">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="p-2 hover:bg-muted rounded-lg shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                title={
                  sidebarOpen
                    ? "Hide Workspace Config"
                    : "Show Workspace Config"
                }
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeft className="w-4 h-4" />
                )}
              </button>
              <div className="text-[13px] text-[color:var(--link)] truncate flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">
                  {selectedDataset}
                </span>
                <span className="mx-1 text-foreground/30">/</span>
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground font-medium text-foreground">
                  {searchType.toLowerCase().replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-muted text-[12px]"
                onClick={() => setUploadOpen(true)}
              >
                <Upload className="w-3.5 h-3.5 text-primary" /> Upload Notes
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar"
          >
            {messages.map((msg) => {
              const isAi = msg.role === "ai";
              const { cleanText, citations } = isAi
                ? parseCitations(msg.text)
                : { cleanText: msg.text, citations: [] };
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-3xl mx-auto flex gap-4 p-4 rounded-2xl transition-all border",
                    isAi
                      ? "bg-white border-border hover:border-border"
                      : "bg-white border-border",
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-[12px] font-semibold font-mono",
                      isAi
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-white border border-border border-border text-foreground",
                    )}
                  >
                    {isAi ? "AI" : "ME"}
                  </div>

                  {/* Bubble Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="text-[14px] leading-relaxed text-foreground">
                      <Markdown text={cleanText} />
                    </div>

                    {/* Interactive Citation Buttons */}
                    {isAi && citations.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {citations.map((cit, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => setActiveCitation(cit)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[11px] font-medium transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                            Citation: {cit.docName}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Citations / Source Cards */}
                    {isAi && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <div className="text-[10px] uppercase tracking-wider text-[color:var(--link)] font-semibold flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-primary" /> Cited
                          Sources
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {msg.sources.map((src, i) => (
                            <div
                              key={i}
                              className="p-2 bg-white border border-border rounded-xl hover:border-border transition-all text-left"
                            >
                              <div className="text-[11px] font-medium text-muted-foreground truncate">
                                {src.name}
                              </div>
                              <div className="text-[10px] text-[color:var(--link)] line-clamp-1 mt-0.5">
                                {src.excerpt}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Helper actions (like Copy Answer and Save to Bank) */}
                    {isAi && (
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-[color:var(--link)]">
                        <button
                          onClick={() => copyToClipboard(cleanText, msg.id)}
                          className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />{" "}
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Response
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => toggleMarkQuestion(msg.id, cleanText)}
                          disabled={summarizingId === msg.id}
                          className={cn(
                            "flex items-center gap-1.5 transition-colors pl-3 border-l border-border hover:text-foreground",
                            msg.verified ? "text-emerald-400 font-medium" : "",
                            summarizingId === msg.id
                              ? "opacity-50 cursor-wait"
                              : "",
                          )}
                        >
                          {summarizingId === msg.id ? (
                            <>
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />{" "}
                              Summarizing...
                            </>
                          ) : msg.verified ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />{" "}
                              Saved in Bank
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" /> Save to Bank
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {typing && (
              <div className="max-w-3xl mx-auto flex gap-4 p-4 rounded-2xl bg-white border border-border">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-primary text-[12px] font-mono font-semibold">
                  AI
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            )}

            {/* Suggested Prompts (Grid) on New Conversation */}
            {messages.length === 1 && !typing && (
              <div className="max-w-3xl mx-auto pt-6 space-y-3">
                <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)] font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" /> Suggested
                  Questions
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => send(prompt)}
                      className="p-3 text-left rounded-xl bg-white hover:bg-white/[0.03] border border-border hover:border-primary/20 text-[13px] text-muted-foreground hover:text-foreground transition-all flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-4 h-4 text-[color:var(--link)] group-hover:text-primary transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Chat Input Console */}
          <div className="p-4 md:p-6 border-t border-border bg-[#FAF7F2]/40">
            <div className="max-w-3xl mx-auto mb-2 flex items-center gap-1.5 px-1">
              {["Short", "Auto", "Long"].map((len) => (
                <button
                  key={len}
                  onClick={() => setAnswerLength(len.toLowerCase() as any)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-medium transition-all border",
                    answerLength === len.toLowerCase()
                      ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                      : "bg-white border border-border border-border text-[color:var(--link)] hover:text-foreground hover:bg-muted",
                  )}
                >
                  {len}
                </button>
              ))}
            </div>

            <div className="max-w-3xl mx-auto relative flex items-center rounded-2xl bg-white border border-border border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all px-4 py-2 gap-2">
              {/* Optional Subject Upload Button */}
              <button
                onClick={() => setUploadOpen(true)}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title="Upload Notes"
              >
                <Upload className="w-4 h-4 text-primary" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                disabled={typing}
                placeholder={
                  typing ? "Thinking..." : "Ask your knowledge base..."
                }
                className="flex-1 bg-transparent py-2 text-[14px] focus:outline-none placeholder:text-gray-500 text-foreground disabled:opacity-50"
              />

              <button
                onClick={() => send()}
                disabled={typing || !input.trim()}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  input.trim() && !typing
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "bg-white border border-border text-foreground/30 cursor-not-allowed",
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Ingestion / Upload Dialog Modal */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload notes to Cognee Cloud"
      >
        <div className="space-y-4">
          <label className="block border-2 border-dashed border-border hover:border-primary/40 rounded-2xl p-8 text-center transition-all cursor-pointer bg-white hover:bg-white">
            <input
              type="file"
              accept=".txt,.md,.json,.csv,.xml"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const text = await file.text();
                  await cogneeRememberText({
                    data: {
                      text,
                      datasetName: selectedDataset,
                      fileName: file.name,
                    },
                  });
                  alert(
                    `Successfully uploaded "${file.name}" to "${selectedDataset}"!`,
                  );

                  // Reload files list
                  fetchDatasetFiles(selectedDataset);
                } catch (err: any) {
                  console.error(err);
                  alert(`Error uploading file: ${err.message || err}`);
                } finally {
                  setUploading(false);
                  setUploadOpen(false);
                }
              }}
            />
            <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-[14px] font-medium mb-1">
              {uploading
                ? "Cognifying & Indexing..."
                : "Click to select a file"}
            </div>
            <div className="text-[11px] text-[color:var(--link)]">
              Supported: TXT, MD, JSON, CSV, XML
            </div>
          </label>

          <div className="text-center text-[10px] uppercase tracking-wider text-foreground/30">
            — OR —
          </div>

          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-widest text-[color:var(--link)] font-semibold">
              Paste raw study notes
            </div>
            <textarea
              placeholder="Paste your notes here..."
              rows={4}
              className="w-full bg-white border border-border border border-border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-primary/50 text-foreground placeholder:text-gray-600 resize-none"
              id="paste-notes-area-scratch-redone"
            />
            <Button
              className="w-full font-medium"
              size="sm"
              onClick={async () => {
                const textarea = document.getElementById(
                  "paste-notes-area-scratch-redone",
                ) as HTMLTextAreaElement;
                const text = textarea?.value?.trim();
                if (!text) return;
                setUploading(true);
                try {
                  await cogneeRememberText({
                    data: {
                      text,
                      datasetName: selectedDataset,
                      fileName: "pasted_note.txt",
                    },
                  });
                  alert(`Successfully uploaded notes to "${selectedDataset}"!`);
                  textarea.value = "";

                  // Reload files list
                  fetchDatasetFiles(selectedDataset);
                } catch (err: any) {
                  console.error(err);
                  alert(`Error pasting notes: ${err.message || err}`);
                } finally {
                  setUploading(false);
                  setUploadOpen(false);
                }
              }}
            >
              {uploading ? "Indexing..." : "Ingest Pasted Note"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Subject Modal */}
      <Modal
        open={createSubjectOpen}
        onClose={() => {
          if (!creatingSubject) {
            setCreateSubjectOpen(false);
            setNewSubjectName("");
          }
        }}
        title="Create New Subject"
      >
        <div className="space-y-4">
          <div className="text-[13px] text-muted-foreground leading-relaxed">
            Create a dedicated subject memory space. All files you upload and
            questions you ask in this subject will be isolated here.
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-[color:var(--link)] font-semibold">
              Subject Name
            </label>
            <input
              type="text"
              placeholder="e.g. physics, organic_chemistry, world_history"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              disabled={creatingSubject}
              className="w-full bg-white border border-border border border-border rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:border-primary/50 text-foreground placeholder:text-gray-600"
            />
            <div className="text-[10px] text-[color:var(--link)] mt-1">
              * Names must contain only letters, numbers, hyphens, and
              underscores. Spaces will be converted to underscores.
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={creatingSubject}
              onClick={() => {
                setCreateSubjectOpen(false);
                setNewSubjectName("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={creatingSubject || !newSubjectName.trim()}
              onClick={async () => {
                const rawName = newSubjectName.trim();
                if (!rawName) return;

                const formattedName = rawName
                  .replace(/[^a-zA-Z0-9_-]/g, "_")
                  .toLowerCase();

                setCreatingSubject(true);
                try {
                  await cogneeRememberText({
                    data: {
                      text: `Subject Database for ${rawName} successfully initialized.`,
                      datasetName: formattedName,
                      fileName: "welcome_init.txt",
                    },
                  });

                  setDatasetsList((prev) => {
                    if (prev.some((d) => d.name === formattedName)) return prev;
                    return [
                      ...prev,
                      { id: formattedName, name: formattedName },
                    ];
                  });

                  setSelectedDataset(formattedName);
                  setCreateSubjectOpen(false);
                  setNewSubjectName("");
                  alert(`Subject "${rawName}" has been created!`);

                  fetchDatasets();
                } catch (err: any) {
                  console.error(err);
                  alert(`Error creating subject: ${err.message || err}`);
                } finally {
                  setCreatingSubject(false);
                }
              }}
            >
              {creatingSubject ? "Creating Subject..." : "Create Subject"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Citation Viewer Modal */}
      <Modal
        open={!!activeCitation}
        onClose={() => setActiveCitation(null)}
        title="Source Document Citation"
      >
        {activeCitation && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-border border border-border">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold truncate text-foreground">
                  {activeCitation.docName}
                </div>
                <div className="text-[10px] text-[color:var(--link)] mt-0.5">
                  data_id: {activeCitation.dataId}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-[color:var(--link)] font-semibold">
                Cited Snippet Content
              </div>
              <div className="p-4 rounded-xl bg-foreground text-background/40 border border-border text-[13px] text-foreground/95 leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                {activeCitation.content}
              </div>
            </div>

            <div className="text-[10.5px] text-[color:var(--link)]">
              <strong>Chunk ID:</strong> {activeCitation.chunkId}
            </div>

            <Button
              className="w-full mt-2"
              variant="outline"
              onClick={() => setActiveCitation(null)}
            >
              Close Citation
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

interface Citation {
  docName: string;
  dataId: string;
  chunkId: string;
  content: string;
}

function parseCitations(text: string): {
  cleanText: string;
  citations: Citation[];
} {
  const citations: Citation[] = [];

  const evidenceIndex = text.search(/(?:Evidence|evidence):/i);
  if (evidenceIndex === -1) {
    return { cleanText: text, citations };
  }

  const cleanText = text.slice(0, evidenceIndex).trim();
  const evidencePart = text.slice(evidenceIndex);

  const regex =
    /(?:[•\-*\s]*chunk\s*\d*\s*of\s*document\s*([^\s(]+)\s*\(data_id:\s*([a-f0-9-]+),\s*chunk_id:\s*([a-f0-9-]+)\):\s*["'“”]?([\s\S]+?)(?=(?:\n\s*(?:[•\-*\s]*chunk|Evidence|document))|$))/gi;

  let match;
  while ((match = regex.exec(evidencePart)) !== null) {
    const docName = match[1];
    const dataId = match[2];
    const chunkId = match[3];
    let content = match[4].trim();

    if (content.startsWith('"') || content.startsWith("“"))
      content = content.slice(1);
    if (
      content.endsWith('"') ||
      content.endsWith("”") ||
      content.endsWith("…")
    ) {
      content = content.slice(0, -1);
    }

    citations.push({ docName, dataId, chunkId, content });
  }

  if (citations.length === 0) {
    const lines = evidencePart.split("\n");
    lines.forEach((line) => {
      if (line.includes("data_id") && line.includes("chunk_id")) {
        try {
          const docNameMatch = line.match(/document\s+([^\s(]+)/i);
          const dataIdMatch = line.match(/data_id:\s*([a-f0-9-]+)/i);
          const chunkIdMatch = line.match(/chunk_id:\s*([a-f0-9-]+)/i);
          const contentSplit = line.split("):");

          if (dataIdMatch && chunkIdMatch) {
            citations.push({
              docName: docNameMatch ? docNameMatch[1] : "Document",
              dataId: dataIdMatch[1],
              chunkId: chunkIdMatch[1],
              content: contentSplit.length > 1 ? contentSplit[1].trim() : line,
            });
          }
        } catch (e) {
          console.warn("Failed parsing line fallback:", e);
        }
      }
    });
  }

  return { cleanText, citations };
}
