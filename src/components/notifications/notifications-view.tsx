import Link from "next/link";
import { BellRing, CircleCheck, Clock, FilePlus2, Hash, MessageSquare, XCircle, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { STATUS_LABELS } from "@/lib/constants";
import type { NotificationItem } from "@/server/queries/notifications";
import { cn } from "@/lib/utils";
import { NotificationLink } from "./notification-link";

type NotificationsViewProps = {
  notifications: NotificationItem[];
  /** "/complaints" (student) or "/admin/complaints" (admin). */
  basePath: string;
  filter?: "unread";
  /** Reference time for "ago" labels and Today/Earlier grouping. Defaults to the current time. */
  now?: Date;
};

const dayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function timeAgo(date: Date, now: Date) {
  const minutes = Math.max(1, Math.round((now.getTime() - date.getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return dayFormat.format(date);
}

const sameDay = (a: Date, b: Date) => a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);

function iconFor(n: NotificationItem): { Icon: LucideIcon; tone: string } {
  if (n.kind === "new") return { Icon: FilePlus2, tone: "bg-secondary-container/60 text-primary" };
  if (n.kind === "remark") return { Icon: MessageSquare, tone: "bg-tertiary-fixed text-tertiary" };
  if (n.status === "RESOLVED") return { Icon: CircleCheck, tone: "bg-secondary-container text-on-secondary-fixed" };
  if (n.status === "REJECTED") return { Icon: XCircle, tone: "bg-error-container text-on-error-container" };
  return { Icon: Clock, tone: "bg-secondary-container/60 text-primary" };
}

function Message({ n }: { n: NotificationItem }) {
  const title = (
    <span className="font-medium text-on-surface underline decoration-outline-variant decoration-1 underline-offset-4">
      “{n.complaintTitle}”
    </span>
  );
  const actor = `${n.departmentLabel} Administration`;
  if (n.kind === "new") {
    return (
      <>
        <span className="font-semibold text-primary">{n.actorName}</span> submitted {title} to{" "}
        <span className="font-semibold text-primary">{n.departmentLabel}</span>
      </>
    );
  }
  if (n.kind === "remark") {
    return (
      <>
        <span className="font-semibold text-primary">{actor}</span> added a remark on {title}
      </>
    );
  }
  return (
    <>
      <span className="font-semibold text-primary">{actor}</span> marked {title} as{" "}
      <span
        className={cn(
          "font-semibold",
          n.status === "REJECTED" ? "text-error" : n.status === "RESOLVED" ? "text-on-secondary-fixed" : "text-primary",
        )}
      >
        {STATUS_LABELS[n.status]}
      </span>
    </>
  );
}

function Row({
  n,
  basePath,
  now,
  allHref,
  inUnreadTab,
}: {
  n: NotificationItem;
  basePath: string;
  now: Date;
  allHref: string;
  inUnreadTab: boolean;
}) {
  const { Icon, tone } = iconFor(n);
  return (
    <NotificationLink
      id={n.id}
      unread={n.unread}
      href={`${basePath}/${n.complaintId}`}
      allHref={allHref}
      inUnreadTab={inUnreadTab}
      className="group relative block rounded-xl bg-surface-container-lowest p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
            n.unread ? tone : "bg-surface-container-low text-secondary",
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className={cn("font-body-md text-body-md", n.unread ? "text-on-surface" : "text-on-surface-variant")}>
              <Message n={n} />
            </div>
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              <time className="font-label-sm text-label-sm text-secondary">{timeAgo(n.createdAt, now)}</time>
              {n.unread ? <span aria-label="Unread" className="h-2 w-2 rounded-full bg-primary" /> : null}
            </div>
          </div>
          <div className="line-clamp-2 rounded-lg bg-surface-container-low/70 p-3 font-body-md text-body-md italic text-on-surface-variant">
            “{n.remark}”
          </div>
          <div className="flex items-center gap-3 pt-1 font-label-sm text-label-sm text-secondary">
            <span className="flex items-center gap-1">
              <Hash className="size-[15px]" />
              {n.complaintId.slice(-6).toUpperCase()}
            </span>
            <span>•</span>
            <span>{n.departmentLabel}</span>
          </div>
        </div>
      </div>
    </NotificationLink>
  );
}

export function NotificationsView({ notifications, basePath, filter, now = new Date() }: NotificationsViewProps) {
  const isAdmin = basePath.startsWith("/admin");
  const notificationsPath = isAdmin ? "/admin/notifications" : "/notifications";
  const unreadCount = notifications.filter((n) => n.unread).length;

  const visible = (filter === "unread" ? notifications.filter((n) => n.unread) : notifications)
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const today = visible.filter((n) => sameDay(n.createdAt, now));
  const earlier = visible.filter((n) => !sameDay(n.createdAt, now));
  const todayUnread = today.filter((n) => n.unread).length;

  const tabs = [
    { href: notificationsPath, label: "All", count: notifications.length, active: !filter },
    { href: `${notificationsPath}?filter=unread`, label: "Unread", count: unreadCount, active: filter === "unread" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-6">
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              {isAdmin ? "Admin Console" : "Student Portal"}
            </span>
            <span className="text-xs font-semibold text-secondary/40">/</span>
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
              Activity &amp; Alerts
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-normal tracking-tight text-on-surface">Notifications</h1>
          <p className="max-w-xl font-body-md text-body-md text-secondary">
            {isAdmin
              ? "Stay updated on newly submitted complaints routed to your department."
              : "Stay updated on real-time department remarks, investigation status shifts, and ticket resolutions."}
          </p>
        </div>
      </div>

      <div className="inline-flex w-fit rounded-lg bg-surface-container-low p-1 shadow-sm" role="tablist">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            role="tab"
            aria-selected={tab.active}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-4 py-1.5 font-label-md text-label-md transition duration-150",
              tab.active
                ? "bg-primary-container text-on-primary shadow-sm"
                : "text-secondary hover:text-on-surface",
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                tab.active
                  ? "bg-white/20 opacity-90"
                  : tab.label === "Unread" && tab.count > 0
                    ? "bg-error-container font-semibold text-on-error-container"
                    : "bg-surface-container text-secondary",
              )}
            >
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={BellRing}
          title="You're all caught up"
          description={
            isAdmin
              ? "No unread alerts. We'll notify you as soon as a new complaint is routed to your department."
              : "No unread alerts or ticket updates. We'll notify you as soon as department staff review or update your filed inquiries."
          }
          action={
            <Link
              href={basePath}
              className="inline-flex items-center gap-2 rounded-xl bg-surface-container px-4 py-2.5 font-label-md text-label-md text-on-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container hover:text-on-primary"
            >
              {isAdmin ? "Check Complaints" : "Check My Complaints"}
            </Link>
          }
        />
      ) : (
        <div className="mt-2 flex flex-col gap-8">
          {today.length > 0 ? (
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
                  Today — {dayFormat.format(now)}
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-secondary/50" />
                <span className="font-label-sm text-label-sm text-secondary">{todayUnread} unread updates</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {today.map((n) => (
                  <Row key={n.id} n={n} basePath={basePath} now={now} allHref={notificationsPath} inUnreadTab={filter === "unread"} />
                ))}
              </div>
            </section>
          ) : null}
          {earlier.length > 0 ? (
            <section className="flex flex-col gap-3">
              <div className="px-1">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
                  Earlier
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {earlier.map((n) => (
                  <Row key={n.id} n={n} basePath={basePath} now={now} allHref={notificationsPath} inUnreadTab={filter === "unread"} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
