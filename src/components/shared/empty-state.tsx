import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional action, e.g. a link or <Button>. */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center space-y-space-md overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl py-16 text-center shadow-sm",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <svg fill="none" height="300" stroke="currentColor" viewBox="0 0 100 100" width="400" aria-hidden>
          <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
          <polygon points="50,15 85,75 15,75" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container-low text-secondary">
        <Icon className="size-8" />
      </div>
      <div className="relative z-10 max-w-md space-y-space-xs">
        <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
        {description ? <p className="font-body-md text-body-md text-secondary">{description}</p> : null}
      </div>
      {action ? <div className="relative z-10">{action}</div> : null}
    </div>
  );
}
