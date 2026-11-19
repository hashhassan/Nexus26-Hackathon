"use client";

import { CheckCheck } from "lucide-react";
import { toast } from "sonner";

export function MarkAllReadButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      // Mock only: the cookie-based action arrives in Task 10b.
      onClick={() => toast.success("All notifications marked as read")}
      className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3.5 py-2 font-label-md text-label-md text-on-surface-variant transition duration-200 hover:bg-surface-container hover:text-on-surface disabled:pointer-events-none disabled:opacity-50"
    >
      <CheckCheck className="size-[18px]" />
      <span>Mark all as read</span>
    </button>
  );
}
