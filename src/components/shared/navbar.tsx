"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

type NavbarProps = {
  /** Brand / logo area (left). */
  brand?: ReactNode;
  /** Primary navigation links. */
  links?: NavLink[];
  /** Right-hand area, e.g. user name + sign-out button, or sign-in links. */
  userArea?: ReactNode;
  className?: string;
};

export function Navbar({ brand, links = [], userArea, className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className={cn("border-b bg-background", className)}>
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
        <div className="font-semibold">{brand}</div>
        <ul className="flex flex-1 items-center gap-4 overflow-x-auto">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground",
                    active ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">{userArea}</div>
      </nav>
    </header>
  );
}
