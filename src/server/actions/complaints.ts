"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";
import { DEPARTMENTS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { createComplaintSchema, rateComplaintSchema, updateMyComplaintSchema } from "@/lib/schemas";
import { requireRole } from "@/server/auth";

type Fail = { ok: false; error: string; fieldErrors?: Record<string, string> };

function zodFail(error: { issues: { path: PropertyKey[]; message: string }[] }): Fail {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  return { ok: false, error: Object.values(fieldErrors)[0] ?? "Invalid input", fieldErrors };
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg"];

export async function createComplaint(formData: FormData): Promise<{ ok: true; id: string } | Fail> {
  const user = await requireRole(["student"]);
  const parsed = createComplaintSchema.safeParse({
    department: formData.get("department"),
    issueType: formData.get("issueType"),
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) return zodFail(parsed.error);

  const { department, issueType, title, description } = parsed.data;
  if (!DEPARTMENTS[department].issueTypes.includes(issueType)) {
    return { ok: false, error: "Invalid issue type", fieldErrors: { issueType: "Invalid issue type for this category" } };
  }

  // Optional image: validate first, upload only after everything else is valid.
  const file = formData.get("image");
  let imageUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    const imageError = !IMAGE_TYPES.includes(file.type)
      ? "Only PNG or JPG images are allowed"
      : file.size > MAX_IMAGE_BYTES
        ? "Image must be 4MB or smaller"
        : null;
    if (imageError) return { ok: false, error: imageError, fieldErrors: { image: imageError } };

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
      const blob = await put(`complaints/${randomUUID()}-${safeName}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      imageUrl = blob.url;
    } catch (e) {
      console.error("Blob upload failed:", e instanceof Error ? e.message : e);
      return { ok: false, error: "Image upload failed" };
    }
  }

  const complaint = await prisma.complaint.create({
    data: { title, description, department, issueType, status: "PENDING", studentId: user.id, imageUrl },
    select: { id: true },
  });
  revalidatePath("/complaints");
  return { ok: true, id: complaint.id };
}

export async function rateComplaint(
  id: string,
  rating: number,
  comment?: string,
): Promise<{ ok: true } | Fail> {
  const user = await requireRole(["student"]);
  const parsed = rateComplaintSchema.safeParse({ rating, comment });
  if (!parsed.success) return zodFail(parsed.error);

  const { count } = await prisma.complaint.updateMany({
    where: { id, studentId: user.id, status: "RESOLVED", rating: null },
    data: { rating: parsed.data.rating, ratingComment: parsed.data.comment || null },
  });
  if (count === 0) return { ok: false, error: "Can't rate this complaint" };

  revalidatePath(`/complaints/${id}`);
  revalidatePath("/complaints");
  return { ok: true };
}

function revalidateComplaint(id: string) {
  revalidatePath("/complaints");
  revalidatePath(`/complaints/${id}`);
  revalidatePath("/admin");
  revalidatePath("/admin/complaints");
  revalidatePath(`/admin/complaints/${id}`);
}

export async function updateMyComplaint(id: string, input: unknown): Promise<{ ok: true } | Fail> {
  const user = await requireRole(["student"]);
  const parsed = updateMyComplaintSchema.safeParse(input);
  if (!parsed.success) return zodFail(parsed.error);

  const existing = await prisma.complaint.findFirst({
    where: { id, studentId: user.id },
    select: { department: true, status: true },
  });
  if (!existing) return { ok: false, error: "Complaint not found" };
  if (existing.status !== "PENDING") return { ok: false, error: "Only pending complaints can be changed" };

  // Department comes from the stored complaint, never from the input.
  const { issueType, title, description } = parsed.data;
  if (!DEPARTMENTS[existing.department].issueTypes.includes(issueType)) {
    return { ok: false, error: "Invalid issue type", fieldErrors: { issueType: "Invalid issue type for this category" } };
  }

  const { count } = await prisma.complaint.updateMany({
    where: { id, studentId: user.id, status: "PENDING" },
    data: { issueType, title, description },
  });
  if (count === 0) return { ok: false, error: "Only pending complaints can be changed" };

  revalidateComplaint(id);
  return { ok: true };
}

export async function deleteMyComplaint(id: string): Promise<{ ok: true } | Fail> {
  const user = await requireRole(["student"]);
  const where = { id, studentId: user.id, status: "PENDING" as const };

  const existing = await prisma.complaint.findFirst({ where, select: { imageUrl: true } });
  const { count } = await prisma.complaint.deleteMany({ where });
  if (count === 0) return { ok: false, error: "Only your pending complaints can be deleted" };

  if (existing?.imageUrl) {
    try {
      await del(existing.imageUrl);
    } catch (e) {
      console.error("Blob delete failed:", e instanceof Error ? e.message : e);
    }
  }

  revalidateComplaint(id);
  return { ok: true };
}
