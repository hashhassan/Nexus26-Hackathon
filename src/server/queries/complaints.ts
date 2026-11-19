import type { ComplaintStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/** Own complaints only, newest first, with the latest update. */
export async function getMyComplaints(userId: string, status?: ComplaintStatus) {
  return prisma.complaint.findMany({
    where: { studentId: userId, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    include: { updates: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
}

export async function getMyComplaintStats(userId: string) {
  const groups = await prisma.complaint.groupBy({
    by: ["status"],
    where: { studentId: userId },
    _count: { _all: true },
  });
  const n = (s: ComplaintStatus) => groups.find((g) => g.status === s)?._count._all ?? 0;
  const pending = n("PENDING");
  const inProgress = n("IN_PROGRESS");
  const resolved = n("RESOLVED");
  const rejected = n("REJECTED");
  return { total: pending + inProgress + resolved + rejected, pending, inProgress, resolved, rejected };
}

/** Security check: only returns the complaint when it belongs to this student. */
export async function getComplaintForStudent(id: string, userId: string) {
  return prisma.complaint.findFirst({
    where: { id, studentId: userId },
    include: {
      student: { select: { id: true, name: true } },
      updates: {
        orderBy: { createdAt: "asc" },
        include: { admin: { select: { id: true, name: true } } },
      },
    },
  });
}
