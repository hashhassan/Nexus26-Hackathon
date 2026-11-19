"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Register" },
];

export function AuthTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-8 flex items-center rounded-xl bg-surface-container-low p-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 rounded-lg py-2 text-center font-title-md text-body-md transition duration-200",
              active
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-secondary hover:text-on-surface",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
