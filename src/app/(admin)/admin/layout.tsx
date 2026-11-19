import { Bell, LayoutDashboard, ListChecks, Settings } from "lucide-react";
import { AppShell, Sidebar, SidebarBrand, SidebarUserCard, type SidebarItem } from "@/components/shared";
import { getRoleLabel } from "@/lib/constants";
import { requireRole } from "@/server/auth";
import { getUnreadCount } from "@/server/queries/notifications";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["dept_admin", "super_admin"]);
  const unread = await getUnreadCount(user);

  const items: SidebarItem[] = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/admin/complaints", label: "Complaints", icon: <ListChecks /> },
    { href: "/admin/notifications", label: "Notifications", icon: <Bell />, badge: unread },
    { href: "/admin/profile", label: "Profile & Settings", icon: <Settings /> },
  ];

  return (
    <AppShell
      sidebar={
        <Sidebar
          items={items}
          title="Navigation"
          brand={<SidebarBrand />}
          footer={
            <SidebarUserCard
              name={user.name}
              roleLabel={getRoleLabel(user.role, user.department)}
              href="/admin/profile"
            />
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
