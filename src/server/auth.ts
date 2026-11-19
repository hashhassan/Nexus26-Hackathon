import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/lib/constants";

/** Returns the current session (or null) by reading request headers. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Redirects to /sign-in when logged out. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

export function isAdmin(role: string) {
  return role === "dept_admin" || role === "super_admin";
}

/**
 * Requires a logged-in user with one of the given roles.
 * Logged out -> /sign-in. Wrong role -> "/" (which redirects by role).
 */
export async function requireRole(roles: Role[]) {
  const { user } = await requireSession();
  const role = user.role as Role;
  if (!roles.includes(role)) redirect("/");
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    role,
    department: (user.department ?? null) as string | null,
  };
}
