import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/server/auth";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  redirect(isAdmin(session.user.role) ? "/admin" : "/complaints");
}
