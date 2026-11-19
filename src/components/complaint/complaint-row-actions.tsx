"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared";
import { cn } from "@/lib/utils";
import { deleteMyComplaint } from "@/server/actions/complaints";

const base =
  "inline-flex items-center rounded-lg px-3 py-1.5 font-label-md text-label-md transition duration-200";
const enabled = "hover:-translate-y-0.5";
const muted = "pointer-events-none cursor-not-allowed opacity-50";
const NOT_PENDING = "Only pending complaints can be changed";

/** View / Update / Delete buttons for one row on the student's complaints list. */
export function ComplaintRowActions({ id, status }: { id: string; status: string }) {
  const [open, setOpen] = useState(false);
  const pending = status === "PENDING";

  async function confirmDelete() {
    const result = await deleteMyComplaint(id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Complaint deleted");
  }

  return (
    <div className="flex items-center gap-space-xs">
      <Link
        href={`/complaints/${id}`}
        className={cn(
          base,
          enabled,
          "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary",
        )}
      >
        View
      </Link>

      {pending ? (
        <Link
          href={`/complaints/${id}/edit`}
          className={cn(
            base,
            enabled,
            "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary",
          )}
        >
          Update
        </Link>
      ) : (
        <span aria-disabled="true" title={NOT_PENDING} className={cn(base, "bg-surface-container text-on-surface", muted)}>
          Update
        </span>
      )}

      <button
        type="button"
        disabled={!pending}
        title={pending ? undefined : NOT_PENDING}
        onClick={() => setOpen(true)}
        className={cn(
          base,
          "cursor-pointer border border-status-rejected-fg text-status-rejected-fg",
          pending ? cn(enabled, "hover:bg-status-rejected") : muted,
        )}
      >
        Delete
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this complaint?"
        description="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
