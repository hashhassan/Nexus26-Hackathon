"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markNotificationRead } from "@/server/actions/notifications";

type NotificationLinkProps = {
  id: string;
  unread: boolean;
  /** Complaint detail page. */
  href: string;
  /** The notifications page without a filter (the "All" tab). */
  allHref: string;
  /** True when the Unread tab is showing. */
  inUnreadTab: boolean;
  className?: string;
  children: ReactNode;
};

/** Marks the notification read on click. Unread tab -> back to All; All tab -> open the complaint. */
export function NotificationLink({ id, unread, href, allHref, inUnreadTab, className, children }: NotificationLinkProps) {
  const router = useRouter();

  async function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let ctrl/cmd/middle clicks open a new tab as usual.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (unread) await markNotificationRead(id);
    router.push(inUnreadTab ? allHref : href);
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
