export type HelpRole = "student" | "admin";

export type HelpEntry = {
  keywords: string[];
  question: string;
  answer: string;
  roles: HelpRole[];
};

export const FALLBACK_ANSWER = "I'm not sure about that. Try one of the suggestions below.";

// Order matters: the first matching entry wins, so specific entries come before broad ones.
export const HELP_ENTRIES: HelpEntry[] = [
  // Student
  {
    keywords: ["submit", "file a complaint", "new complaint", "create complaint", "raise", "report an issue", "how do i complain"],
    question: "How do I submit a complaint?",
    answer:
      "Open New Complaint in the sidebar, choose a category, pick the issue type, add a title and description (and an optional image), then press Submit. It goes straight to the right department.",
    roles: ["student"],
  },
  {
    keywords: ["edit", "delete", "remove", "modify", "change my complaint", "update my complaint"],
    question: "Can I edit or delete a complaint?",
    answer:
      "Yes, but only while it is Pending. On My Complaints use Update or Delete on that row. The category can't be changed after submission.",
    roles: ["student"],
  },
  {
    keywords: ["rate", "rating", "star", "feedback", "satisfied"],
    question: "How do I rate a resolution?",
    answer: "Open a Resolved complaint, choose 1 to 5 stars, add an optional comment and press Submit Rating. You can rate once.",
    roles: ["student"],
  },
  {
    keywords: ["image", "photo", "picture", "attach", "upload", "screenshot"],
    question: "How do I attach an image?",
    answer: "On the New Complaint form, drag a file into the evidence box or click to browse. PNG or JPG, up to 4MB.",
    roles: ["student"],
  },
  {
    keywords: ["status", "pending", "in progress", "resolved", "rejected", "mean"],
    question: "What do the statuses mean?",
    answer:
      "Pending: received and waiting for review. In Progress: the department is working on it. Resolved: fixed and closed. Rejected: closed with a reason from the department.",
    roles: ["student"],
  },
  {
    keywords: ["track", "timeline", "follow", "see my complaint", "view", "response", "remark"],
    question: "How do I track my complaint?",
    answer: "Go to My Complaints and press View on a row. You will see the status timeline and every response from the department.",
    roles: ["student"],
  },
  {
    keywords: [
      "department", "dept", "who handles", "category", "cafeteria", "food", "library", "book", "seat",
      "computer", "internet", "wifi", "wi fi", "projector", "software", "lab", "teacher", "lecture", "notes", "class",
    ],
    question: "Which department handles what?",
    answer:
      "Cafeteria / food: Cafeteria Administration. Library / books / seats: Library Administration. Computers / internet / wifi / projector / software / labs: Laboratory / IT Administration. Teachers / lectures / notes / classes: Teaching / Academic Administration.",
    roles: ["student"],
  },

  // Admin
  {
    keywords: ["update", "status", "remark", "dispatch", "reject", "resolve", "close", "change"],
    question: "How do I update a complaint?",
    answer:
      "Open the complaint, use Dispatch Action to pick a status and write a remark, then Save update. Rejecting needs a reason. Super admins have a view-only oversight of complaints.",
    roles: ["admin"],
  },
  {
    keywords: ["filter", "search", "find", "sort"],
    question: "How do filters and search work?",
    answer:
      "On the Complaints page, search by title and filter by status. Super admins can also filter by category. Department admins always see only their own department.",
    roles: ["admin"],
  },
  {
    keywords: ["dashboard", "chart", "graph", "stat", "analytics", "satisfaction", "recurring"],
    question: "What is on the dashboard?",
    answer:
      "The Dashboard shows complaint totals by status, a bar chart (by department, or by issue type for department admins), the status breakdown, average satisfaction, top recurring issues and the latest complaints.",
    roles: ["admin"],
  },

  // Shared
  {
    keywords: ["notification", "alert", "unread"],
    question: "How do notifications work?",
    answer:
      "Open Notifications in the sidebar. Students see updates on their complaints and admins see new complaints for their department. Clicking one marks it as read.",
    roles: ["student", "admin"],
  },
  {
    keywords: ["password", "profile", "settings", "change my name", "account"],
    question: "How do I change my password?",
    answer: "Go to Profile & Settings. Use the Security card: enter your current password and a new one (at least 8 characters).",
    roles: ["student", "admin"],
  },
  {
    keywords: ["hello", " hi ", "hey", "good morning", "good evening", "salam"],
    question: "Hello",
    answer: "Hello! Ask me anything about using CampusConnect, or pick a suggestion below.",
    roles: ["student", "admin"],
  },
];

/** The 4 chips shown for each role. */
export const CHIP_QUESTIONS: Record<HelpRole, string[]> = {
  student: [
    "How do I submit a complaint?",
    "Which department handles what?",
    "What do the statuses mean?",
    "Can I edit or delete a complaint?",
  ],
  admin: [
    "How do I update a complaint?",
    "How do filters and search work?",
    "What is on the dashboard?",
    "How do notifications work?",
  ],
};

function normalize(text: string) {
  return ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
}

export function findEntry(role: HelpRole, text: string): HelpEntry | undefined {
  const haystack = normalize(text);
  return HELP_ENTRIES.filter((e) => e.roles.includes(role)).find((e) =>
    e.keywords.some((k) => haystack.includes(k.includes(" ") && k.startsWith(" ") ? k : k.toLowerCase())),
  );
}

export function entryForQuestion(role: HelpRole, question: string): HelpEntry | undefined {
  return HELP_ENTRIES.find((e) => e.roles.includes(role) && e.question === question);
}
