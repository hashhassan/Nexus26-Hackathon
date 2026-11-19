import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  /** Small supporting text under the value. */
  trend?: string;
  className?: string;
  /** "compact" is the admin dashboard KPI card. */
  variant?: "default" | "compact";
  /** Icon box colors, e.g. "bg-surface-container text-primary-container". */
  iconClassName?: string;
  /** Trend text color. */
  trendClassName?: string;
  /** Dot before the trend text. */
  dotClassName?: string;
  /** Blurred corner circle color (default variant only). */
  glowClassName?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
  variant = "default",
  iconClassName = "bg-surface-container text-primary-container",
  trendClassName = "text-secondary",
  dotClassName = "bg-secondary",
  glowClassName = "bg-surface-container/50",
}: StatCardProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-secondary">{label}</span>
          {Icon ? (
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconClassName)}>
              <Icon className="size-[18px]" />
            </div>
          ) : null}
        </div>
        <div className="mt-4">
          <div className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">{value}</div>
          {trend ? (
            <div className={cn("mt-1 flex items-center gap-1.5", trendClassName)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", dotClassName)} />
              <span className="truncate font-label-sm text-label-sm">{trend}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">{label}</span>
        {Icon ? (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconClassName)}>
            <Icon className="size-5" />
          </div>
        ) : null}
      </div>
      <div className="mt-space-md">
        <div className="font-display-md text-display-md font-normal leading-none tracking-tight text-on-surface">
          {value}
        </div>
        {trend ? (
          <div className={cn("mt-space-xs flex items-center gap-1.5", trendClassName)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", dotClassName)} />
            <span className="font-label-sm text-label-sm">{trend}</span>
          </div>
        ) : null}
      </div>
      <div className={cn("pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full blur-xl", glowClassName)} />
    </div>
  );
}
