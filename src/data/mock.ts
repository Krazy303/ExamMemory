// All demo data for Memoria. Replace with real API responses later.

export const student = {
  name: "Alex Chen",
  email: "alex@studymind.app",
  avatar: "https://i.pravatar.cc/120?img=47",
  school: "Westbrook Academy",
};

export const subjects = [
  { id: "physics", name: "Physics", color: "#0000EE" },
  { id: "chemistry", name: "Chemistry", color: "#7C3AED" },
  { id: "biology", name: "Biology", color: "#10B981" },
  { id: "math", name: "Mathematics", color: "#F59E0B" },
];

export const chapters: Record<string, string[]> = {
  physics: ["Thermodynamics", "Electromagnetism", "Optics", "Mechanics"],
  chemistry: ["Organic", "Inorganic", "Physical"],
  biology: ["Cell Biology", "Genetics", "Ecology"],
  math: ["Calculus", "Linear Algebra", "Statistics"],
};

export const chatThreads = [
  { id: "1", title: "Entropy basics", subject: "Physics", updated: "2h ago" },
  {
    id: "2",
    title: "Thermodynamics past paper Qs",
    subject: "Physics",
    updated: "Yesterday",
  },
  {
    id: "3",
    title: "Balancing redox reactions",
    subject: "Chemistry",
    updated: "2d ago",
  },
  {
    id: "4",
    title: "Mitosis vs Meiosis",
    subject: "Biology",
    updated: "3d ago",
  },
  {
    id: "5",
    title: "Integration by parts drill",
    subject: "Math",
    updated: "Last week",
  },
];

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  sources?: { name: string; excerpt: string }[];
  consistency?: { type: "same" | "new"; date?: string };
};

export const seedChat: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    text: "Explain the second law of thermodynamics in simple terms.",
  },
  {
    id: "m2",
    role: "ai",
    text: "The second law states that in any isolated system, entropy (disorder) tends to increase over time. Heat naturally flows from hot to cold, never the reverse without external work. This is why perpetual motion machines are impossible.",
    sources: [
      {
        name: "physics_ch4_notes.pdf",
        excerpt: "Entropy of an isolated system never decreases; ΔS ≥ 0.",
      },
      {
        name: "Past Paper 2023",
        excerpt: "Q4: State the second law and give one everyday example.",
      },
    ],
    consistency: { type: "same", date: "Mar 14, 2025" },
  },
  {
    id: "m3",
    role: "user",
    text: "Can you give me a worked example calculating entropy change?",
  },
  {
    id: "m4",
    role: "ai",
    text: "Sure. For 1 mol of ideal gas expanding isothermally from V₁ to 2V₁ at 300 K:\n\nΔS = nR ln(V₂/V₁) = (1)(8.314) ln(2) ≈ 5.76 J/K\n\nThe positive value confirms entropy increases as the gas spreads out.",
    sources: [
      {
        name: "physics_ch4_notes.pdf",
        excerpt: "ΔS = nR ln(V₂/V₁) for isothermal expansion of ideal gas.",
      },
    ],
    consistency: { type: "new" },
  },
  {
    id: "m5",
    role: "user",
    text: "Why can't heat flow from cold to hot spontaneously?",
  },
  {
    id: "m6",
    role: "ai",
    text: "Because it would decrease the total entropy of the universe, violating the second law. Heat flowing cold→hot would require work input (like a refrigerator's compressor).",
    sources: [
      {
        name: "physics_ch4_notes.pdf",
        excerpt:
          "Clausius statement: heat cannot spontaneously flow from a colder to a hotter body.",
      },
    ],
    consistency: { type: "same", date: "Feb 28, 2025" },
  },
];

export const testimonials = [
  {
    name: "Priya S.",
    school: "Grade 12 · Delhi Public",
    quote:
      "Memoria actually remembers what I struggle with. Revision finally feels focused instead of random.",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    name: "Marcus T.",
    school: "A-Levels · Manchester",
    quote:
      "The consistency badges are wild — I ask the same question a month later and get the exact same grounded answer.",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    name: "Yuki N.",
    school: "IB Diploma · Tokyo",
    quote:
      "Uploading past papers once and having them cited in every answer changed how I revise.",
    avatar: "https://i.pravatar.cc/80?img=45",
  },
  {
    name: "Amara O.",
    school: "SAT Prep · Lagos",
    quote:
      "It flags concepts I keep getting wrong. My mock scores jumped 180 points in six weeks.",
    avatar: "https://i.pravatar.cc/80?img=25",
  },
];

export const stats = [
  { value: "10,000+", label: "Questions Answered" },
  { value: "98%", label: "Consistency Rate" },
  { value: "5,000+", label: "Students Learning" },
  { value: "42", label: "Supported Subjects" },
];

export const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "50 questions / month",
      "1 subject",
      "Basic memory",
      "Question bank access",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Student Pro",
    price: "$9",
    period: "/month",
    features: [
      "Unlimited questions",
      "All subjects",
      "Persistent memory",
      "Knowledge graph",
      "Mistake tracking",
      "Priority support",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Institution",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Class dashboards",
      "Teacher analytics",
      "SSO & LMS integration",
      "Dedicated success manager",
    ],
    cta: "Talk to Sales",
    highlight: false,
  },
];

export const faq = [
  {
    q: "How does Memoria's memory actually work?",
    a: "Every question, note, and past paper you upload becomes part of a personal knowledge graph. Answers are grounded in that graph, so the same question always returns a consistent, source-cited answer.",
  },
  {
    q: "Is my data private?",
    a: "Your notes and chats are encrypted at rest and never used to train foundation models. You can export or delete everything at any time.",
  },
  {
    q: "What file types can I upload?",
    a: "PDFs, DOCX, Markdown, images with text (OCR), and plain text. Up to 50MB per file on the free tier.",
  },
  {
    q: "Which subjects are supported?",
    a: "We work across STEM, humanities, and language subjects — anything you can upload notes for. The system adapts to your curriculum.",
  },
  {
    q: "Can I use it offline?",
    a: "Reading and reviewing cached content works offline. New questions and uploads require an internet connection.",
  },
  {
    q: "Does it replace my teacher?",
    a: "No — it augments them. Memoria is a memory-powered study companion, not a substitute for classroom learning or human feedback.",
  },
];

export const dashboardStats = [
  { label: "Study Streak", value: "14", suffix: "days", icon: "flame" },
  {
    label: "Questions Asked",
    value: "47",
    suffix: "this week",
    icon: "message",
  },
  {
    label: "Topics Covered",
    value: "68%",
    suffix: "of syllabus",
    icon: "book",
  },
  { label: "Mistakes Tracked", value: "12", suffix: "active", icon: "alert" },
];

export const syllabusCoverage = [
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

export const weakConcepts = [
  { concept: "Entropy calculations", subject: "Physics", severity: "high" },
  {
    concept: "Newton's third law application",
    subject: "Physics",
    severity: "medium",
  },
  {
    concept: "Redox balancing in acidic solution",
    subject: "Chemistry",
    severity: "high",
  },
  { concept: "Integration by parts", subject: "Math", severity: "low" },
];

export const recentActivity = [
  { icon: "upload", title: "Uploaded physics_ch4_notes.pdf", time: "2h ago" },
  {
    icon: "message",
    title: "Asked about entropy calculations",
    time: "3h ago",
  },
  {
    icon: "check",
    title: "Completed revision session (12 cards)",
    time: "Yesterday",
  },
  {
    icon: "alert",
    title: "New mistake logged: Newton's third law",
    time: "2d ago",
  },
  { icon: "upload", title: "Uploaded Past Paper 2023", time: "3d ago" },
];

export const questions = [
  {
    id: "q1",
    question: "State and explain the second law of thermodynamics.",
    answer:
      "Entropy of an isolated system never decreases. Heat flows spontaneously from hot to cold. Examples: melting ice, gas expansion.",
    subject: "Physics",
    chapter: "Thermodynamics",
    source: "Past Paper",
    verified: true,
    reused: 7,
  },
  {
    id: "q2",
    question: "Derive ΔS for isothermal expansion of an ideal gas.",
    answer: "ΔS = nR ln(V₂/V₁). Derived from dQ_rev/T with PV=nRT.",
    subject: "Physics",
    chapter: "Thermodynamics",
    source: "AI Generated",
    verified: true,
    reused: 4,
  },
  {
    id: "q3",
    question: "What are the four Maxwell equations?",
    answer:
      "Gauss's law for E, Gauss's law for B, Faraday's law, Ampère-Maxwell law.",
    subject: "Physics",
    chapter: "Electromagnetism",
    source: "Notes Upload",
    verified: true,
    reused: 12,
  },
  {
    id: "q4",
    question: "Explain the mechanism of SN1 vs SN2 reactions.",
    answer:
      "SN1: two-step, carbocation intermediate, favors tertiary. SN2: one-step, backside attack, favors primary.",
    subject: "Chemistry",
    chapter: "Organic",
    source: "Past Paper",
    verified: true,
    reused: 9,
  },
  {
    id: "q5",
    question: "Balance: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ (acidic).",
    answer: "MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O",
    subject: "Chemistry",
    chapter: "Inorganic",
    source: "AI Generated",
    verified: false,
    reused: 2,
  },
  {
    id: "q6",
    question: "Compare mitosis and meiosis.",
    answer:
      "Mitosis: 2 identical diploid cells, growth/repair. Meiosis: 4 haploid gametes, genetic variation via crossing over.",
    subject: "Biology",
    chapter: "Cell Biology",
    source: "Notes Upload",
    verified: true,
    reused: 15,
  },
  {
    id: "q7",
    question: "What is Mendel's law of segregation?",
    answer:
      "Each individual has two alleles per gene which separate during gamete formation, so each gamete receives one allele.",
    subject: "Biology",
    chapter: "Genetics",
    source: "Past Paper",
    verified: true,
    reused: 6,
  },
  {
    id: "q8",
    question: "Evaluate ∫x·eˣ dx.",
    answer:
      "By parts: u=x, dv=eˣdx → x·eˣ − ∫eˣ dx = x·eˣ − eˣ + C = eˣ(x−1) + C",
    subject: "Mathematics",
    chapter: "Calculus",
    source: "AI Generated",
    verified: true,
    reused: 8,
  },
  {
    id: "q9",
    question: "Find eigenvalues of [[2,1],[1,2]].",
    answer: "det(A−λI)=0 → (2−λ)²−1=0 → λ=1, 3",
    subject: "Mathematics",
    chapter: "Linear Algebra",
    source: "Past Paper",
    verified: true,
    reused: 5,
  },
  {
    id: "q10",
    question: "Define standard deviation and variance.",
    answer:
      "Variance = mean of squared deviations from mean. SD = √variance. Measures spread.",
    subject: "Mathematics",
    chapter: "Statistics",
    source: "Notes Upload",
    verified: true,
    reused: 11,
  },
  {
    id: "q11",
    question: "State Snell's law.",
    answer: "n₁ sin θ₁ = n₂ sin θ₂. Governs refraction at interface.",
    subject: "Physics",
    chapter: "Optics",
    source: "Past Paper",
    verified: true,
    reused: 3,
  },
  {
    id: "q12",
    question: "What is Le Chatelier's principle?",
    answer:
      "If a system at equilibrium is disturbed, it shifts to counteract the disturbance.",
    subject: "Chemistry",
    chapter: "Physical",
    source: "AI Generated",
    verified: false,
    reused: 1,
  },
];

export const timelineItems = [
  {
    date: "Today",
    items: [
      {
        icon: "upload",
        title: "Uploaded physics_ch4_notes.pdf",
        desc: "12 pages · Thermodynamics",
        time: "10:24",
        subject: "Physics",
      },
      {
        icon: "message",
        title: "Asked: Explain the second law",
        desc: "Consistency badge shown on AI response",
        time: "10:31",
        subject: "Physics",
        consistency: "same",
      },
    ],
  },
  {
    date: "Yesterday",
    items: [
      {
        icon: "check",
        title: "Completed revision session",
        desc: "12 cards · 83% accuracy",
        time: "18:02",
        subject: "Chemistry",
      },
      {
        icon: "alert",
        title: "Mistake logged: Redox balancing",
        desc: "3rd time missed",
        time: "16:47",
        subject: "Chemistry",
      },
      {
        icon: "message",
        title: "Asked: SN1 vs SN2 mechanism",
        desc: "New answer generated",
        time: "14:12",
        subject: "Chemistry",
        consistency: "new",
      },
    ],
  },
  {
    date: "This Week",
    items: [
      {
        icon: "upload",
        title: "Uploaded Past Paper 2023",
        desc: "Physics · 24 pages",
        time: "Mon 09:15",
        subject: "Physics",
      },
      {
        icon: "check",
        title: "Streak milestone: 14 days",
        desc: "Keep it going!",
        time: "Sun 21:00",
        subject: "General",
      },
      {
        icon: "message",
        title: "Asked: Mendel's law of segregation",
        desc: "Same as answered on Feb 10",
        time: "Sat 11:20",
        subject: "Biology",
        consistency: "same",
      },
    ],
  },
];

export type GraphNode = {
  id: string;
  label: string;
  type: "student" | "subject" | "chapter" | "concept" | "mistake";
  x: number;
  y: number;
};
export const graphNodes: GraphNode[] = [
  { id: "you", label: "You", type: "student", x: 400, y: 260 },
  { id: "phys", label: "Physics", type: "subject", x: 200, y: 140 },
  { id: "chem", label: "Chemistry", type: "subject", x: 600, y: 140 },
  { id: "bio", label: "Biology", type: "subject", x: 200, y: 380 },
  { id: "math", label: "Math", type: "subject", x: 600, y: 380 },
  { id: "thermo", label: "Thermodynamics", type: "chapter", x: 90, y: 60 },
  { id: "em", label: "Electromagnetism", type: "chapter", x: 260, y: 30 },
  { id: "entropy", label: "Entropy", type: "concept", x: 60, y: 180 },
  { id: "mistake1", label: "Entropy calc", type: "mistake", x: 30, y: 260 },
  { id: "org", label: "Organic", type: "chapter", x: 720, y: 60 },
  { id: "sn1", label: "SN1 mechanism", type: "concept", x: 720, y: 200 },
  { id: "calc", label: "Calculus", type: "chapter", x: 720, y: 440 },
  {
    id: "parts",
    label: "Integration by parts",
    type: "concept",
    x: 720,
    y: 500,
  },
  { id: "cell", label: "Cell Biology", type: "chapter", x: 90, y: 460 },
];
export const graphEdges: [string, string][] = [
  ["you", "phys"],
  ["you", "chem"],
  ["you", "bio"],
  ["you", "math"],
  ["phys", "thermo"],
  ["phys", "em"],
  ["thermo", "entropy"],
  ["entropy", "mistake1"],
  ["chem", "org"],
  ["org", "sn1"],
  ["math", "calc"],
  ["calc", "parts"],
  ["bio", "cell"],
];

export const flashcards = [
  {
    q: "What does the second law of thermodynamics state?",
    a: "Entropy of an isolated system never decreases; heat flows from hot to cold.",
  },
  {
    q: "Formula for entropy change in isothermal expansion?",
    a: "ΔS = nR ln(V₂/V₁)",
  },
  {
    q: "SN1 vs SN2 — which favors tertiary substrates?",
    a: "SN1 (stable carbocation intermediate).",
  },
  {
    q: "Balance MnO₄⁻ + Fe²⁺ in acidic solution.",
    a: "MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O",
  },
  {
    q: "Difference between mitosis and meiosis?",
    a: "Mitosis: 2 diploid cells. Meiosis: 4 haploid gametes with genetic variation.",
  },
  { q: "∫x·eˣ dx = ?", a: "eˣ(x − 1) + C" },
  { q: "State Snell's law.", a: "n₁ sin θ₁ = n₂ sin θ₂" },
  {
    q: "Le Chatelier's principle in one line?",
    a: "A system at equilibrium shifts to counteract a disturbance.",
  },
  { q: "Eigenvalues of [[2,1],[1,2]]?", a: "λ = 1 and λ = 3" },
  {
    q: "Definition of standard deviation?",
    a: "Square root of variance — a measure of data spread from the mean.",
  },
];

export const team = [
  {
    name: "Rushikesh Gauswami",
    role: "Backend Developer",
    bio: "UIT, KU",
    avatar: "/avatar.png",
    linkedin: "rushikeshgiri-gauswami-848058329",
  },
  {
    name: "Sanskar Patil",
    role: "Frontend Developer",
    bio: "UIT, KU",
    avatar: "/avatar.png",
    linkedin: "sanskar-patil-36a880382",
  },
  {
    name: "Abhay Purohit",
    role: "Design & Integration",
    bio: "UIT, KU",
    avatar: "/avatar.png",
    linkedin: "abhay-purohit-31514b402",
  },
];

export const values = [
  {
    title: "Built on Trust",
    desc: "Your notes stay yours. Encrypted, exportable, deletable.",
    icon: "shield",
  },
  {
    title: "Grounded, Not Guessed",
    desc: "Every answer cites your material. No hallucinated facts.",
    icon: "anchor",
  },
  {
    title: "Student-First",
    desc: "Designed with students, not for a corporate roadmap.",
    icon: "heart",
  },
  {
    title: "Memory That Compounds",
    desc: "The longer you use it, the smarter it gets about you.",
    icon: "brain",
  },
];

export const trustedLogos = [
  "Cambridge",
  "MIT",
  "Stanford",
  "IIT",
  "NUS",
  "ETH",
];

export const howItWorks = [
  {
    n: "01",
    title: "Upload your material",
    desc: "Notes, textbooks, past papers — everything gets indexed into your personal knowledge graph.",
  },
  {
    n: "02",
    title: "Ask in Memo",
    desc: "Chat naturally. Memoria pulls from your material, not the open web.",
  },
  {
    n: "03",
    title: "Grounded answers",
    desc: "Every response cites the exact source. Same question later = same answer.",
  },
  {
    n: "04",
    title: "Track progress",
    desc: "Dashboard shows coverage, streaks, and the concepts you keep tripping on.",
  },
];

export const whyCards = [
  {
    title: "Consistent Answers",
    desc: "Ask the same question in a week or a month — you'll get the same grounded answer, not a new AI hallucination.",
  },
  {
    title: "Source-Cited Recall",
    desc: "Every answer traces back to your own notes and past papers. No mystery citations.",
  },
  {
    title: "Tracks Your Mistakes",
    desc: "Remembers recurring errors and surfaces them in revision so you actually stop repeating them.",
  },
];

export const featureChips = [
  "Flashcards",
  "Question Bank",
  "Syllabus Coverage",
  "Knowledge Graph",
  "Revision Queue",
  "Study Streaks",
];
