import type { ComplaintStatus } from "@/generated/prisma/client";
import { DEPARTMENTS, DEPARTMENT_KEYS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getDepartmentScope, type Viewer } from "./scope";

/** All dashboard data for one viewer. dept_admin is always locked to their own department. */
export async function getDashboardData(viewer: Viewer, requestedDepartment?: string) {
  const scope = getDepartmentScope(viewer, requestedDepartment);
  const isSuper = viewer.role === "super_admin";

  const [statusGroups, ratingAgg, chartGroups, recurringGroups, recent] = await Promise.all([
    prisma.complaint.groupBy({ by: ["status"], where: scope, _count: { _all: true } }),
    prisma.complaint.aggregate({
      where: { ...scope, rating: { not: null } },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    isSuper
      ? prisma.complaint.groupBy({ by: ["department"], where: scope, _count: { _all: true } })
      : prisma.complaint.groupBy({ by: ["issueType"], where: scope, _count: { _all: true } }),
    prisma.complaint.groupBy({
      by: ["issueType", "department"],
      where: scope,
      _count: { _all: true },
      orderBy: { _count: { issueType: "desc" } },
      take: 5,
    }),
    prisma.complaint.findMany({
      where: scope,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, department: true, status: true, createdAt: true },
    }),
  ]);

  const n = (s: ComplaintStatus) => statusGroups.find((g) => g.status === s)?._count._all ?? 0;
  const stats = {
    pending: n("PENDING"),
    inProgress: n("IN_PROGRESS"),
    resolved: n("RESOLVED"),
    rejected: n("REJECTED"),
    total: 0,
  };
  stats.total = stats.pending + stats.inProgress + stats.resolved + stats.rejected;

  const avg = ratingAgg._avg.rating;
  const satisfaction = {
    average: avg === null ? null : Math.round(avg * 10) / 10,
    count: ratingAgg._count.rating,
  };

  // Super admin: one bar per department. Dept admin: one bar per issue type of their department.
  let chart: { label: string; count: number }[];
  if (isSuper) {
    const groups = chartGroups as { department: string; _count: { _all: number } }[];
    chart = DEPARTMENT_KEYS.map((k) => ({
      label: DEPARTMENTS[k].label,
      count: groups.find((g) => g.department === k)?._count._all ?? 0,
    }));
  } else {
    const groups = chartGroups as { issueType: string; _count: { _all: number } }[];
    const own = DEPARTMENT_KEYS.find((k) => k === viewer.department);
    chart = (own ? DEPARTMENTS[own].issueTypes : []).map((type) => ({
      label: type,
      count: groups.find((g) => g.issueType === type)?._count._all ?? 0,
    }));
  }

  const recurring = recurringGroups.map((g) => ({
    issueType: g.issueType,
    department: g.department,
    count: g._count._all,
  }));

  return { stats, satisfaction, chart, recurring, recent };
}
