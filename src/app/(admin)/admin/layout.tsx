import { Bell, LayoutDashboard, ListChecks, Settings } from "lucide-react";
import { AppShell, Sidebar, SidebarBrand, SidebarUserCard, type SidebarItem } from "@/components/shared";
import { getRoleLabel } from "@/lib/constants";
import { mockAdminNotifications, mockAdmins } from "@/lib/mock-data";
import { getSession } from "@/server/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // No guards until Task 7: fall back to the mock super admin when logged out.
  const user = session?.user ?? mockAdmins[0];
  const unread = mockAdminNotifications.filter((n) => n.unread).length;

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
