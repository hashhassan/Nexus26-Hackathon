"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type FilterSelectProps = {
  /** Search param key, e.g. "department". */
  param: string;
  /** Label of the "no filter" option, e.g. "All Departments". */
  allLabel: string;
  options: { value: string; label: string }[];
  /** Pass an element, e.g. <Building2 />. */
  icon?: ReactNode;
  ariaLabel: string;
};

/** Native select that writes its value into the URL search params (and resets ?page). */
export function FilterSelect({ param, allLabel, options, icon, ariaLabel }: FilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(param) ?? "";

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set(param, next);
    else params.delete(param);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="relative inline-flex items-center rounded-lg bg-surface-container-lowest shadow-sm transition duration-200 hover:bg-surface-container-low">
      {icon ? (
        <span className="pointer-events-none absolute left-3.5 text-secondary [&_svg]:size-[18px]">{icon}</span>
      ) : null}
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer appearance-none rounded-lg bg-transparent py-2 pr-9 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 ${icon ? "pl-10" : "pl-3.5"}`}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-[18px] text-outline" />
    </div>
  );
}
