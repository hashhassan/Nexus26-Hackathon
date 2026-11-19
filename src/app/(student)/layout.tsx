import { Bell, ClipboardList, PlusCircle, Settings } from "lucide-react";
import { AppShell, Sidebar, SidebarBrand, SidebarUserCard, type SidebarItem } from "@/components/shared";
import { getRoleLabel } from "@/lib/constants";
import { mockNotifications, mockStudent } from "@/lib/mock-data";
import { getSession } from "@/server/auth";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const user = session?.user ?? mockStudent;
  const unread = mockNotifications.filter((n) => n.unread).length;

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
