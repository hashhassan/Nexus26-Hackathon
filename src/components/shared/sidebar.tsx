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
      <nav aria-label={title} className="px-space-md py-space-sm">
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
      {/* Decorative card, fills the gap above the user card. Hidden on small screens. */}
      <div aria-hidden className="mt-auto hidden px-space-md pb-space-md md:block">
        <div className="overflow-hidden rounded-xl bg-surface-container-low p-space-md transition duration-200 hover:shadow-md">
          <svg
            viewBox="0 0 240 100"
            fill="none"
            className="h-24 w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ground */}
            <line x1="0" y1="88" x2="240" y2="88" className="stroke-outline-variant" strokeWidth="1.5" />
            {/* path */}
            <path d="M96 88L84 100M144 88L156 100" className="stroke-outline-variant" strokeWidth="1" />
            {/* library block */}
            <path d="M10 88V56H56V88" className="stroke-primary-container" strokeWidth="1.3" />
            <path d="M10 56L33 44L56 56" className="stroke-primary-container" strokeLinejoin="round" strokeWidth="1.3" />
            <path d="M22 88V72H30V88M38 88V72H46V88" className="stroke-outline" strokeWidth="1" />
            {/* main hall with clock tower */}
            <path d="M72 88V46H168V88" className="stroke-primary-container" strokeWidth="1.3" />
            <path d="M108 46V22H132V46" className="stroke-primary-container" strokeWidth="1.3" />
            <path d="M104 22L120 8L136 22" className="stroke-primary-container" strokeLinejoin="round" strokeWidth="1.3" />
            <circle cx="120" cy="32" r="4" className="stroke-outline" strokeWidth="1" />
            <path d="M84 88V60M96 88V60M144 88V60M156 88V60" className="stroke-outline" strokeWidth="1" />
            <path d="M112 88V70H128V88" className="stroke-outline" strokeWidth="1" />
            {/* lab block */}
            <path d="M184 88V50H230V88" className="stroke-primary-container" strokeWidth="1.3" />
            <path d="M192 62H202M212 62H222M192 76H202M212 76H222" className="stroke-outline" strokeWidth="1" />
            {/* tree */}
            <path d="M172 88V74" className="stroke-outline" strokeWidth="1.2" />
            <circle cx="172" cy="68" r="7" className="stroke-secondary" strokeWidth="1.2" />
          </svg>
          <p className="mt-space-sm font-headline-md text-title-md text-on-surface">Every voice, heard.</p>
          <p className="mt-0.5 font-label-sm text-label-sm normal-case tracking-normal text-secondary">
            Report. Track. Resolved.
          </p>
        </div>
      </div>
      {footer ? <div className="border-t border-border p-space-md">{footer}</div> : null}
    </div>
  );
}
