import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppShellProps = {
  /** Usually <Navbar />. Rendered on top. */
  navbar?: ReactNode;
  /** Optional sidebar slot, usually <Sidebar />. Stacks above content on mobile. */
  sidebar?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AppShell({ navbar, sidebar, children, className }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {navbar}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row">
        {sidebar ? <aside className="shrink-0">{sidebar}</aside> : null}
        <main className={cn("min-w-0 flex-1", className)}>{children}</main>
      </div>
    </div>
  );
}
