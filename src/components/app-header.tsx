import Link from "next/link";
import { getSession } from "@/server/auth";
import { Navbar, SignOutButton, type NavLink } from "@/components/shared";
import { Button } from "@/components/ui/button";

/** App-level navbar: wires the shared Navbar to the current session. */
export async function AppHeader() {
  const session = await getSession();

  const links: NavLink[] = session ? [{ href: "/", label: "Dashboard" }] : [];

  return (
    <Navbar
      brand={<Link href="/">Nexus26</Link>}
      links={links}
      userArea={
        session ? (
          <>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.name || session.user.email}
            </span>
            <SignOutButton />
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/sign-in" />}>
              Sign in
            </Button>
            <Button size="sm" nativeButton={false} render={<Link href="/sign-up" />}>
              Sign up
            </Button>
          </>
        )
      }
    />
  );
}
