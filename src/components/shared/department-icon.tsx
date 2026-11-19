import { Building2, BookOpen, GraduationCap, Monitor, Utensils, type LucideIcon } from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";

const icons: Record<string, LucideIcon> = { Utensils, BookOpen, Monitor, GraduationCap };

/** Renders the lucide icon configured for a department in DEPARTMENTS. */
export function DepartmentIcon({
  department,
  className,
}: {
  department: keyof typeof DEPARTMENTS;
  className?: string;
}) {
  const Icon = icons[DEPARTMENTS[department].icon] ?? Building2;
  return <Icon className={className} />;
}
