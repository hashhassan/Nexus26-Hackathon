import { Landmark } from "lucide-react";

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-space-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
        <Landmark className="size-6" />
      </div>
      <span className="truncate font-headline-md text-headline-md font-semibold leading-tight text-on-surface">
        CampusConnect
      </span>
    </div>
  );
}
