import type { ComplaintStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getDepartmentScope, type Viewer } from "./scope";

export const ADMIN_PAGE_SIZE = 10;

type Filters = { q?: string; department?: string; status?: ComplaintStatus; page?: number };

export async function getAdminComplaints(viewer: Viewer, { q, department, status, page = 1 }: Filters) {
  const scope = getDepartmentScope(viewer, department);
  const where: Prisma.ComplaintWhereInput = {
    ...scope,
    ...(status ? { status } : {}),
    ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
  };

  const [total, scopedTotal, scopedPending] = await Promise.all([
    prisma.complaint.count({ where }),
    prisma.complaint.count({ where: scope }),
    prisma.complaint.count({ where: { ...scope, status: "PENDING" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const rows = await prisma.complaint.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (safePage - 1) * ADMIN_PAGE_SIZE,
    take: ADMIN_PAGE_SIZE,
    include: { student: { select: { id: true, name: true } } },
  });

  return { rows, total, totalPages, page: safePage, scopedTotal, scopedPending };
}

/** Returns null when the complaint is outside the viewer's department scope. */
export async function getComplaintForAdmin(id: string, viewer: Viewer) {
  return prisma.complaint.findFirst({
    where: { id, ...getDepartmentScope(viewer) },
    include: {
      student: { select: { id: true, name: true } },
      updates: {
        orderBy: { createdAt: "asc" },
        include: { admin: { select: { id: true, name: true } } },
      },
    },
  });
}
