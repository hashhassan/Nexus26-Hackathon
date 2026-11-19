"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

/** Search box that writes ?q= into the URL (debounced) and resets ?page. */
export function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.trim()) params.set("q", next.trim());
      else params.delete("q");
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, 300);
  }

  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-secondary" />
      <input
        type="search"
        aria-label="Search complaints"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-surface-container-low py-2 pl-9 pr-3 font-body-md text-body-md text-on-surface transition-all placeholder:text-secondary focus:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
      />
    </div>
  );
}
