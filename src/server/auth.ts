import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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

/**
 * Requires a logged-in user with the given role.
 * Logged out -> /sign-in. Wrong role -> /dashboard (swap for a throw if preferred).
 */
export async function requireRole(role: string) {
  const session = await requireSession();
  if (session.user.role !== role) redirect("/dashboard");
  return session;
}
