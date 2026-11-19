import { NotificationsView } from "@/components/notifications/notifications-view";
import { mockNotifications, mockNow } from "@/lib/mock-data";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const { filter } = await searchParams;
  return (
    <NotificationsView
      notifications={mockNotifications}
      basePath="/complaints"
      filter={filter === "unread" ? "unread" : undefined}
      now={mockNow}
    />
  );
}
