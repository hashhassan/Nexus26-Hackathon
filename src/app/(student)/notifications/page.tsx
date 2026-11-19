import { NotificationsView } from "@/components/notifications/notifications-view";
import { requireRole } from "@/server/auth";
import { getNotifications } from "@/server/queries/notifications";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const viewer = await requireRole(["student"]);
  const { filter } = await searchParams;
  return (
    <NotificationsView
      notifications={await getNotifications(viewer)}
      basePath="/complaints"
      filter={filter === "unread" ? "unread" : undefined}
    />
  );
}
