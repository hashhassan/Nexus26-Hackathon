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
};

type SidebarProps = {
  items: SidebarItem[];
  /** Label for the mobile toggle button. */
  title?: string;
  className?: string;
};

export function Sidebar({ items, title = "Menu", className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label={title} className={cn("w-full md:w-56", className)}>
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
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors [&_svg]:size-4",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
