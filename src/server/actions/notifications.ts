"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/server/auth";
import { READ_COOKIE, getReadIds } from "@/server/queries/notifications";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export async function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  await requireSession();
  if (typeof id !== "string" || !id || id.length > 64) return { ok: false };
  const ids = await getReadIds();
  if (!ids.includes(id)) {
    // Keep only the latest 200 ids.
    const next = [...ids, id].slice(-200);
    (await cookies()).set(READ_COOKIE, JSON.stringify(next), cookieOptions);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
