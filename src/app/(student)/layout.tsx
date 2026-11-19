import { Bell, ClipboardList, PlusCircle, Settings } from "lucide-react";
import { AppShell, Sidebar, SidebarBrand, SidebarUserCard, type SidebarItem } from "@/components/shared";
import { getRoleLabel } from "@/lib/constants";
import { requireRole } from "@/server/auth";
import { getUnreadCount } from "@/server/queries/notifications";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["student"]);
  const unread = await getUnreadCount(user);

  const items: SidebarItem[] = [
    { href: "/complaints", label: "My Complaints", icon: <ClipboardList /> },
    { href: "/complaints/new", label: "New Complaint", icon: <PlusCircle /> },
    { href: "/notifications", label: "Notifications", icon: <Bell />, badge: unread },
    { href: "/profile", label: "Profile & Settings", icon: <Settings /> },
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
              href="/profile"
            />
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
