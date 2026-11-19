import { NotificationsView } from "@/components/notifications/notifications-view";
import { mockAdminNotifications, mockNow } from "@/lib/mock-data";

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const { filter } = await searchParams;
  return (
    <NotificationsView
      notifications={mockAdminNotifications}
      basePath="/admin/complaints"
      filter={filter === "unread" ? "unread" : undefined}
      now={mockNow}
    />
  );
}
