import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Check, Eye, FileText, Image as ImageIcon, Tag, Activity } from "lucide-react";
import type { Complaint, ComplaintStatus, ComplaintUpdate, User } from "@/generated/prisma/client";
import { DepartmentIcon, StatusBadge } from "@/components/shared";
import { DEPARTMENTS } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import { ActionPanel } from "./action-panel";
import { RatingCard } from "./rating-card";

export type ComplaintDetailData = Complaint & {
  student: Pick<User, "id" | "name">;
  updates: (ComplaintUpdate & { admin: Pick<User, "id" | "name"> })[];
};

type ComplaintDetailProps = {
  complaint: ComplaintDetailData;
  viewer: "student" | "admin";
};

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});
const dateTimeYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

type Step = { label: string; at?: Date; state: "done" | "current" | "future" };

/** Submitted -> In Progress -> Resolved | Rejected, built from the complaint's updates. */
function buildSteps(complaint: ComplaintDetailData): Step[] {
  const { status, updates, createdAt } = complaint;
  const reached = (s: ComplaintStatus) => updates.find((u) => u.status === s)?.createdAt;
  const terminal = status === "RESOLVED" || status === "REJECTED";

  const steps: Step[] = [{ label: "Submitted", at: createdAt, state: status === "PENDING" ? "current" : "done" }];

  if (status === "IN_PROGRESS" || status === "RESOLVED" || reached("IN_PROGRESS")) {
    steps.push({
      label: "In Progress",
      at: reached("IN_PROGRESS"),
      state: status === "IN_PROGRESS" ? "current" : "done",
    });
  }

  if (status === "REJECTED") {
    steps.push({ label: "Rejected", at: reached("REJECTED"), state: "done" });
  } else {
    steps.push({ label: "Resolved", at: reached("RESOLVED"), state: terminal ? "done" : "future" });
  }
  return steps;
}

export function ComplaintDetail({ complaint, viewer }: ComplaintDetailProps) {
  const dept = DEPARTMENTS[complaint.department];
  const backHref = viewer === "admin" ? "/admin/complaints" : "/complaints";
  const steps = buildSteps(complaint);
  const currentIndex = steps.findIndex((s) => s.state === "current");
  const stepNumber = currentIndex === -1 ? steps.length : currentIndex + 1;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col pb-space-xl">
      {/* Breadcrumb */}
      <div className="mb-space-md flex items-center gap-2 pt-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-[18px]" />
          Complaints
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={complaint.status} />
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
              <DepartmentIcon department={complaint.department} className="size-3.5" />
              {dept.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm text-on-surface">
              <Building2 className="size-3.5" />
              {dept.adminName}
            </span>
          </div>
          <h1 className="mt-1 font-headline-lg text-headline-lg font-medium tracking-tight text-on-surface">
            {complaint.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-space-lg gap-y-2 pt-space-xs font-label-md text-label-md text-secondary">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container font-label-sm text-label-sm text-on-primary">
                {getInitials(complaint.student.name)}
              </div>
              <span>
                Submitted by <strong className="font-medium text-on-surface">{complaint.student.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Calendar className="size-[17px] text-secondary" />
              <span>{dateTimeYear.format(complaint.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        {/* LEFT */}
        <div className="flex min-w-0 flex-col gap-space-lg lg:col-span-8">
          <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <FileText className="size-5" />
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Issue Description &amp; Context</h2>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Section 01</span>
            </div>
            <p className="whitespace-pre-line font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {complaint.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5 font-label-md text-label-md text-on-surface">
                <Tag className="size-[18px] text-primary" />
                <span>{complaint.issueType}</span>
              </div>
            </div>

            {complaint.imageUrl ? (
              <div className="mt-space-xs flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Attached Visual Evidence (1 File)
                </span>
                <div className="group relative flex flex-col items-center gap-space-md overflow-hidden rounded-xl bg-surface-container-low p-3 transition-all hover:bg-surface-container sm:flex-row">
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-surface-container-high sm:w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={complaint.imageUrl}
                      alt="Attached evidence"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex w-full min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="size-5 text-primary" />
                      <span className="truncate font-label-md text-label-md font-semibold text-on-surface">
                        Attached image
                      </span>
                    </div>
                    <a
                      href={complaint.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:underline"
                    >
                      <Eye className="size-4" />
                      Preview Full View
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface">Activity &amp; Department Responses</h2>
                <span className="rounded-full bg-primary-container px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-primary">
                  {complaint.updates.length} {complaint.updates.length === 1 ? "Entry" : "Entries"}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Ordered chronologically</span>
            </div>
            {complaint.updates.length === 0 ? (
              <div className="rounded-xl bg-surface-container-lowest p-space-md font-body-md text-body-md text-secondary shadow-sm">
                No responses yet. The department will reply here.
              </div>
            ) : (
              complaint.updates.map((u) => (
                <div
                  key={u.id}
                  className="flex items-start gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-label-md text-label-md text-on-primary">
                    {getInitials(u.admin.name)}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-label-md text-label-md font-semibold text-on-surface">{u.admin.name}</span>
                        <span className="rounded-full bg-secondary-fixed px-2 py-0.5 font-label-sm text-label-sm font-medium text-on-secondary-fixed">
                          {dept.adminName}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary">{dateTime.format(u.createdAt)}</span>
                    </div>
                    <p className="mt-1.5 font-body-md text-body-md leading-relaxed text-on-surface-variant">{u.remark}</p>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <Activity className="size-5" />
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Resolution Progress</h2>
              </div>
              <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-label-sm text-secondary">
                Step {stepNumber} of {steps.length}
              </span>
            </div>
            <div className="relative my-2 flex flex-col gap-6 pl-6">
              <div className="absolute bottom-4 left-2.5 top-3 w-0.5 bg-surface-container-high" />
              {steps.map((step) => (
                <div key={step.label} className={cn("relative flex items-start gap-3", step.state === "future" && "opacity-60")}>
                  {step.state === "done" ? (
                    <div className="absolute -left-6 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
                      <Check className="size-[13px]" strokeWidth={3} />
                    </div>
                  ) : step.state === "current" ? (
                    <div className="absolute -left-6 top-0.5 z-10 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-primary-container text-on-primary ring-4 ring-primary-fixed/50">
                      <span className="h-2 w-2 rounded-full bg-surface-container-lowest" />
                    </div>
                  ) : (
                    <div className="absolute -left-6 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-high text-secondary">
                      <span className="h-2 w-2 rounded-full border border-secondary" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-label-md text-label-md font-semibold",
                          step.state === "current" ? "text-primary" : "text-on-surface",
                        )}
                      >
                        {step.label}
                      </span>
                      {step.state === "current" ? (
                        <span className="font-label-sm text-label-sm font-semibold text-primary">Active</span>
                      ) : null}
                    </div>
                    {step.at ? (
                      <span className="mt-0.5 font-label-sm text-label-sm text-secondary">{dateTime.format(step.at)}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {viewer === "student" ? (
            complaint.status === "RESOLVED" ? (
              <RatingCard rating={complaint.rating} ratingComment={complaint.ratingComment} />
            ) : null
          ) : (
            <ActionPanel status={complaint.status} />
          )}
        </div>
      </div>
    </div>
  );
}
