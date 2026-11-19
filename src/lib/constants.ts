import type { ComplaintStatus, Department } from "@/generated/prisma/client";

export type Role = "student" | "dept_admin" | "super_admin";

export type DepartmentInfo = {
  label: string;
  adminName: string;
  /** lucide-react icon name */
  icon: string;
  hint: string;
  issueTypes: readonly string[];
};

export const DEPARTMENTS: Record<Department, DepartmentInfo> = {
  CAFETERIA: {
    label: "Cafeteria",
    adminName: "Cafeteria Administration",
    icon: "Utensils",
    hint: "Food, prices and cafeteria staff",
    issueTypes: [
      "Food quality / hygiene",
      "High prices",
      "Limited variety",
      "Staff behaviour",
    ],
  },
  LIBRARY: {
    label: "Library",
    adminName: "Library Administration",
    icon: "BookOpen",
    hint: "Books, hours and study space",
    issueTypes: [
      "Outdated books",
      "Librarian availability",
      "Opening hours",
      "Seating space",
    ],
  },
  LABS_IT: {
    label: "Labs / IT",
    adminName: "Laboratory / IT Administration",
    icon: "Monitor",
    hint: "Computers, internet and equipment",
    issueTypes: [
      "Computers not working",
      "Internet",
      "Projector / multimedia",
      "Missing software",
    ],
  },
  TEACHING: {
    label: "Teaching",
    adminName: "Teaching / Academic Administration",
    icon: "GraduationCap",
    hint: "Teachers, notes and classrooms",
    issueTypes: [
      "Teacher late",
      "Notes unavailable",
      "Poor explanation",
      "Classroom discipline",
    ],
  },
};

/** Sidebar badge text: "Student", the department name, or "Super Admin". */
export function getRoleLabel(role: string, department?: string | null): string {
  if (role === "super_admin") return "Super Admin";
  if (role === "dept_admin") {
    return department && department in DEPARTMENTS
      ? DEPARTMENTS[department as Department].label
      : "Department Admin";
  }
  return "Student";
}

export const DEPARTMENT_KEYS = Object.keys(DEPARTMENTS) as Department[];

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};
