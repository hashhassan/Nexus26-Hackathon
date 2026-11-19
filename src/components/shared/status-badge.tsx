import { STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Status = keyof typeof STATUS_LABELS;

const styles: Record<Status, string> = {
  PENDING: "bg-status-pending text-status-pending-fg",
  IN_PROGRESS: "bg-status-progress text-status-progress-fg",
  RESOLVED: "bg-status-resolved text-status-resolved-fg",
  REJECTED: "bg-status-rejected text-status-rejected-fg",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-label-sm text-label-sm font-semibold",
        styles[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
