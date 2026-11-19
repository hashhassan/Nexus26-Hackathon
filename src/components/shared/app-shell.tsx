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
  // Sidebar without a navbar: fixed left rail (w-64) with the page on the right.
  if (sidebar && !navbar) {
    return (
      <div className="min-h-screen bg-background text-foreground md:pl-64">
        <aside className="z-40 border-b border-border bg-card md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
          {sidebar}
        </aside>
        <main className={cn("mx-auto w-full max-w-[1440px] px-gutter py-space-xl md:px-margin", className)}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {navbar}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row">
        {sidebar ? <aside className="shrink-0 md:w-56">{sidebar}</aside> : null}
        <main className={cn("min-w-0 flex-1", className)}>{children}</main>
      </div>
    </div>
  );
}
