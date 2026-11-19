"use client";

import { useState } from "react";
import { Ban, ChevronDown, ListChecks, Lock, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared";
import { STATUS_LABELS } from "@/lib/constants";
import { updateComplaintSchema } from "@/lib/schemas";
import { updateComplaint } from "@/server/actions/admin-complaints";

type Status = keyof typeof STATUS_LABELS;
const STATUSES = Object.keys(STATUS_LABELS) as Status[];

const fieldClass =
  "w-full rounded-lg bg-surface-container-low p-3 font-body-md text-body-md text-on-surface transition-all placeholder:text-secondary/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 aria-invalid:ring-2 aria-invalid:ring-error";

export function ActionPanel({ complaintId, status: currentStatus }: { complaintId: string; status: Status }) {
  const [pending, setPending] = useState(false);
  const closed = currentStatus === "RESOLVED" || currentStatus === "REJECTED";
  const [status, setStatus] = useState<Status>(currentStatus);
  const [remark, setRemark] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonTouched, setReasonTouched] = useState(false);

  const reasonCheck = updateComplaintSchema.safeParse({ status: "REJECTED", remark: reason });
  const reasonError = reasonCheck.success ? undefined : reasonCheck.error.issues[0]?.message;

  async function send(nextStatus: Status, nextRemark: string, successMessage: string) {
    if (pending) return false;
    setPending(true);
    const result = await updateComplaint(complaintId, { status: nextStatus, remark: nextRemark });
    setPending(false);
    if (!result.ok) {
      if (result.fieldErrors) setErrors(result.fieldErrors);
      toast.error(result.error);
      return false;
    }
    toast.success(successMessage);
    return true;
  }

  async function save(nextStatus: Status, successMessage: string) {
    const parsed = updateComplaintSchema.safeParse({ status: nextStatus, remark });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    if (await send(nextStatus, parsed.data.remark, successMessage)) setRemark("");
  }

  async function confirmReject() {
    if (await send("REJECTED", reason, "Complaint rejected")) {
      setReason("");
      setReasonTouched(false);
    }
  }

  return (
    <section className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-container via-primary to-secondary" />
      <div className="flex items-center justify-between pb-space-xs pt-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <span className="block font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Internal Control
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Dispatch Action</h2>
          </div>
        </div>
        <span className="rounded bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-primary-fixed">
          Staff View
        </span>
      </div>

      {closed ? (
        <div className="flex items-start gap-2.5 rounded-lg bg-surface-container-low p-3 text-secondary">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <p className="font-body-md text-body-md">
            Closed. This complaint was {STATUS_LABELS[currentStatus].toLowerCase()}, so no further updates can be made.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ticket-status" className="font-label-sm text-label-sm font-medium uppercase tracking-wider text-secondary">
              Update Ticket Status
            </label>
            <div className="relative">
              <select
                id="ticket-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full cursor-pointer appearance-none rounded-lg bg-surface-container-low px-3 py-2.5 pr-8 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary">
                <ChevronDown className="size-5" />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="official-remark" className="font-label-sm text-label-sm font-medium uppercase tracking-wider text-secondary">
              Official Remark or Closing Note
            </label>
            <textarea
              id="official-remark"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              aria-invalid={!!errors.remark}
              placeholder="Enter official department response or closing note for the student record..."
              className={fieldClass}
            />
            {errors.remark ? <span className="font-label-sm text-[11px] text-error">{errors.remark}</span> : null}
          </div>

          <div className="flex flex-col gap-2 pt-space-xs">
            <button
              type="button"
              onClick={() => save(status, "Update saved")}
              disabled={pending}
              className="inline-flex w-full disabled:pointer-events-none disabled:opacity-50 items-center justify-center gap-2 rounded-xl bg-primary-container px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover active:translate-y-0"
            >
              <Save className="size-[18px]" />
              Save update
            </button>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => save("RESOLVED", "Complaint marked as resolved")}
                disabled={pending}
                className="inline-flex w-full disabled:pointer-events-none disabled:opacity-50 items-center justify-center gap-2 rounded-xl bg-status-resolved-fg px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 sm:flex-1"
              >
                <ListChecks className="size-[18px]" />
                Mark Resolved
              </button>
              <button
                type="button"
                onClick={() => setRejectOpen(true)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-status-rejected-fg px-3.5 py-2.5 font-label-md text-label-md text-status-rejected-fg transition duration-200 hover:-translate-y-0.5 hover:bg-status-rejected active:translate-y-0 sm:w-auto"
              >
                <Ban className="size-[18px]" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          <ConfirmDialog
            open={rejectOpen}
            onOpenChange={(open) => {
              setRejectOpen(open);
              if (!open) setReasonTouched(false);
            }}
            title="Reject this complaint?"
            description="The student will see your reason. This closes the complaint."
            confirmLabel="Reject complaint"
            destructive
            confirmDisabled={!reasonCheck.success || pending}
            onConfirm={confirmReject}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reject-reason" className="font-label-sm text-label-sm font-medium uppercase tracking-wider text-secondary">
                Reason for rejection
              </label>
              <textarea
                id="reject-reason"
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setReasonTouched(true);
                }}
                aria-invalid={reasonTouched && !!reasonError}
                placeholder="Explain why this complaint is being rejected..."
                className={fieldClass}
              />
              {reasonTouched && reasonError ? (
                <span className="font-label-sm text-[11px] text-error">{reasonError}</span>
              ) : null}
            </div>
          </ConfirmDialog>
        </>
      )}
    </section>
  );
}
