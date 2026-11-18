import { LayoutDashboard, LayoutGrid } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AppShell, Sidebar, type SidebarItem } from "@/components/shared";

const items: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard /> },
  // Dev-only: /dev/components is hidden in production.
  ...(process.env.NODE_ENV !== "production"
    ? [{ href: "/dev/components", label: "Components", icon: <LayoutGrid /> }]
    : []),
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navbar={<AppHeader />} sidebar={<Sidebar items={items} title="Navigation" />}>
      {children}
    </AppShell>
  );
}
