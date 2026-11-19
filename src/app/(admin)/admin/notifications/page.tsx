import { NotificationsView } from "@/components/notifications/notifications-view";
import { requireRole } from "@/server/auth";
import { getNotifications } from "@/server/queries/notifications";

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const viewer = await requireRole(["dept_admin", "super_admin"]);
  const { filter } = await searchParams;
  return (
    <NotificationsView
      notifications={await getNotifications(viewer)}
      basePath="/admin/complaints"
      filter={filter === "unread" ? "unread" : undefined}
    />
  );
}
