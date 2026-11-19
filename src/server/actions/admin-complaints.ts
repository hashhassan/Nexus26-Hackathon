"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { updateComplaintSchema } from "@/lib/schemas";
import { requireRole } from "@/server/auth";
import { getComplaintForAdmin } from "@/server/queries/admin-complaints";

export async function updateComplaint(
  id: string,
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> }> {
  const admin = await requireRole(["dept_admin", "super_admin"]);
  // Super admin is read-only; only the assigned department admin can change a complaint.
  if (admin.role !== "dept_admin") return { ok: false, error: "Only department admins can update complaints" };

  const parsed = updateComplaintSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { ok: false, error: Object.values(fieldErrors)[0] ?? "Invalid input", fieldErrors };
  }

  const complaint = await getComplaintForAdmin(id, admin);
  if (!complaint) return { ok: false, error: "Complaint not found" };
  if (complaint.status === "RESOLVED" || complaint.status === "REJECTED") {
    return { ok: false, error: "This complaint is closed and can no longer be updated" };
  }

  const { status, remark } = parsed.data;
  await prisma.$transaction([
    prisma.complaint.update({ where: { id }, data: { status } }),
    prisma.complaintUpdate.create({ data: { complaintId: id, adminId: admin.id, status, remark } }),
  ]);

  revalidatePath("/admin/complaints");
  revalidatePath(`/admin/complaints/${id}`);
  revalidatePath(`/complaints/${id}`);
  revalidatePath("/complaints");
  return { ok: true };
}
