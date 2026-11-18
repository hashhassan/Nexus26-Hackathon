import type { ReactNode } from "react";
import { RotateCcw, TriangleAlert, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  message: string;
  icon?: LucideIcon;
  /** Shows a retry button when provided. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Extra action, e.g. a "Go home" link button. */
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  icon: Icon = TriangleAlert,
  onRetry,
  retryLabel = "Try again",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 p-10 text-center", className)}>
      <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="size-5" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {onRetry ? (
          <Button onClick={onRetry}>
            <RotateCcw /> {retryLabel}
          </Button>
        ) : null}
        {action}
      </div>
    </div>
  );
}
