import { cookies } from "next/headers";
import type { ComplaintStatus } from "@/generated/prisma/client";
import { DEPARTMENTS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getDepartmentScope, type Viewer } from "./scope";

export const SEEN_COOKIE = "cc_notifications_seen";
export const READ_COOKIE = "cc_notifications_read";
const LIMIT = 30;

/** Ids the user opened individually (JSON array in a cookie). */
export async function getReadIds(): Promise<string[]> {
  const value = (await cookies()).get(READ_COOKIE)?.value;
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export type NotificationItem = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  departmentLabel: string;
  status: ComplaintStatus;
  remark: string;
  createdAt: Date;
  unread: boolean;
  /** "status" = status change, "remark" = remark only, "new" = new complaint (admin feed). */
  kind: "status" | "remark" | "new";
  /** Student name, for "new" items. */
  actorName?: string;
};

async function getSeenAt(): Promise<Date | null> {
  const value = (await cookies()).get(SEEN_COOKIE)?.value;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function getNotifications(viewer: Viewer): Promise<NotificationItem[]> {
  const [seenAt, readIds] = await Promise.all([getSeenAt(), getReadIds()]);
  const readSet = new Set(readIds);
  // Unread = newer than the "mark all" cookie AND not individually opened.
  const isUnread = (id: string, d: Date) => (!seenAt || d > seenAt) && !readSet.has(id);

  if (viewer.role === "student") {
    const updates = await prisma.complaintUpdate.findMany({
      where: { complaint: { studentId: viewer.id } },
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      include: { complaint: { select: { id: true, title: true, department: true } } },
    });
    return updates.map((u) => ({
      id: u.id,
      complaintId: u.complaint.id,
      complaintTitle: u.complaint.title,
      departmentLabel: DEPARTMENTS[u.complaint.department].label,
      status: u.status,
      remark: u.remark,
      createdAt: u.createdAt,
      unread: isUnread(u.id, u.createdAt),
      kind: u.status === "PENDING" ? "remark" : "status",
    }));
  }

  const complaints = await prisma.complaint.findMany({
    where: getDepartmentScope(viewer),
    orderBy: { createdAt: "desc" },
    take: LIMIT,
    include: { student: { select: { name: true } } },
  });
  return complaints.map((c) => ({
    id: c.id,
    complaintId: c.id,
    complaintTitle: c.title,
    departmentLabel: DEPARTMENTS[c.department].label,
    status: c.status,
    remark: c.description.slice(0, 100),
    createdAt: c.createdAt,
    unread: isUnread(c.id, c.createdAt),
    kind: "new" as const,
    actorName: c.student.name,
  }));
}

/** Sidebar badge count; capped at the same window the list shows. */
export async function getUnreadCount(viewer: Viewer): Promise<number> {
  const [seenAt, readIds] = await Promise.all([getSeenAt(), getReadIds()]);
  const after = {
    ...(seenAt ? { createdAt: { gt: seenAt } } : {}),
    ...(readIds.length ? { id: { notIn: readIds } } : {}),
  };

  const count =
    viewer.role === "student"
      ? await prisma.complaintUpdate.count({ where: { complaint: { studentId: viewer.id }, ...after } })
      : await prisma.complaint.count({ where: { ...getDepartmentScope(viewer), ...after } });
  return Math.min(count, LIMIT);
}
