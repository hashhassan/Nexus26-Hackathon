import { prisma } from "@/lib/prisma";
import { getDepartmentScope, type Viewer } from "./scope";

/** Activity stats for the profile page, in the shape ProfileSettingsView expects. */
export async function getProfileStats(viewer: Viewer) {
  // Student: own complaints, avg of ratings they gave.
  // Admin: complaints in scope that are no longer PENDING, avg satisfaction in scope.
  const own = viewer.role === "student" ? { studentId: viewer.id } : getDepartmentScope(viewer);
  const handled = viewer.role === "student" ? own : { ...own, status: { not: "PENDING" as const } };

  const [total, resolved, ratings] = await Promise.all([
    prisma.complaint.count({ where: handled }),
    prisma.complaint.count({ where: { ...own, status: "RESOLVED" } }),
    prisma.complaint.aggregate({
      where: { ...own, rating: { not: null } },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  const avg = ratings._avg.rating;
  return {
    total,
    resolved,
    avgRating: avg === null ? null : Math.round(avg * 10) / 10,
    ratedCount: ratings._count.rating,
  };
}
