"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  href: string;
  label: string;
  /** Pass an element, e.g. <Home />, so it can cross the server/client boundary. */
  icon?: ReactNode;
  /** Small count badge, hidden when 0 or missing. */
  badge?: number;
};

type SidebarProps = {
  items: SidebarItem[];
  /** Label for the mobile toggle button. */
  title?: string;
  /** Rendered above the nav, e.g. <SidebarBrand />. */
  brand?: ReactNode;
  /** Rendered below the nav, e.g. <SidebarUserCard />. */
  footer?: ReactNode;
  className?: string;
};

export function Sidebar({ items, title = "Menu", brand, footer, className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Longest matching href wins, so /admin is not active on /admin/complaints.
  const activeHref = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className={cn("flex w-full flex-col md:h-full", className)}>
      {brand ? (
        <div className="border-b border-border/60 px-space-md pb-space-md pt-space-lg">{brand}</div>
      ) : null}
      <nav aria-label={title} className="px-space-md py-space-sm md:flex-1">
        <Button
          variant="outline"
          className="w-full justify-between md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex items-center gap-2">
            <Menu /> {title}
          </span>
          <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
        </Button>
        <ul className={cn("mt-2 flex-col gap-1 md:mt-0 md:flex", open ? "flex" : "hidden")}>
          {items.map((item) => {
            const active = item.href === activeHref;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-space-sm rounded-lg px-space-md py-space-sm font-label-md text-label-md transition duration-200",
                    active
                      ? "bg-primary-container font-semibold text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                  )}
                >
                  <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:scale-110 [&_svg]:size-5">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                  {item.badge ? (
                    <span className="ml-auto rounded-full bg-error-container px-1.5 py-0.5 font-label-sm text-label-sm text-on-error-container">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {footer ? <div className="border-t border-border p-space-md">{footer}</div> : null}
    </div>
  );
}
