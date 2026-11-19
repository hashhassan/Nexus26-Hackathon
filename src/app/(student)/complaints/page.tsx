import Link from "next/link";
import {
  Building2,
  CircleCheck,
  CirclePlus,
  DraftingCompass,
  FolderOpen,
  HardHat,
  Headset,
  Hourglass,
  Plus,
  Star,
  Tag,
} from "lucide-react";
import type { ComplaintStatus } from "@/generated/prisma/client";
import { ComplaintRowActions } from "@/components/complaint/complaint-row-actions";
import { DepartmentIcon, EmptyState, StatCard, StatusBadge } from "@/components/shared";
import { DEPARTMENTS, STATUS_LABELS } from "@/lib/constants";
import { requireRole } from "@/server/auth";
import { getMyComplaintStats, getMyComplaints } from "@/server/queries/complaints";
import { cn } from "@/lib/utils";

const STATUSES = Object.keys(STATUS_LABELS) as ComplaintStatus[];

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export default async function ComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const user = await requireRole(["student"]);
  const { status } = await searchParams;
  const activeStatus = STATUSES.find((s) => s === status);

  const [stats, visible] = await Promise.all([
    getMyComplaintStats(user.id),
    getMyComplaints(user.id, activeStatus),
  ]);
  const counts: Record<ComplaintStatus, number> = {
    PENDING: stats.pending,
    IN_PROGRESS: stats.inProgress,
    RESOLVED: stats.resolved,
    REJECTED: stats.rejected,
  };
  const count = (s: ComplaintStatus) => counts[s];
  const mine = { length: stats.total };
  const firstName = user.name.split(" ")[0];

  const tabs = [
    { href: "/complaints", label: `All (${mine.length})`, active: !activeStatus },
    ...STATUSES.map((s) => ({
      href: `/complaints?status=${s}`,
      label: `${STATUS_LABELS[s]} (${count(s)})`,
      active: activeStatus === s,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-space-xl pb-space-xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-space-md pt-2 md:flex-row md:items-end">
        <div className="max-w-2xl space-y-space-xs">
          <div className="flex items-center gap-space-xs text-secondary">
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Student Academic Oversight</span>
            <span className="text-xs">•</span>
            <span className="font-label-sm text-label-sm text-secondary">Fall Term 2024</span>
          </div>
          <h1 className="font-display-lg text-display-lg font-normal tracking-tight text-on-surface">
            Good morning, {firstName}
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Track your filed campus reports, follow department resolutions, and submit official inquiries with
            real-time institutional accountability.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-space-sm">
          <Link
            href="/complaints/new"
            className="group inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover hover:shadow-md active:translate-y-0"
          >
            <Plus className="size-[18px] transition-transform duration-300 group-hover:rotate-90" />
            <span>New Complaint</span>
          </Link>
        </div>
      </div>

      {/* Architectural strip */}
      <div className="hidden items-center justify-between overflow-hidden rounded-2xl border border-border bg-surface-container-lowest px-space-lg py-3 shadow-sm lg:flex">
        <div className="flex items-center gap-space-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container text-primary">
            <DraftingCompass className="size-5" />
          </div>
          <div>
            <p className="font-label-md text-label-md font-semibold text-on-surface">
              Institutional Infrastructure Quality Monitor
            </p>
            <p className="font-body-md text-xs text-secondary">
              Active campus building sensors and dispatch systems reporting nominal latency.
            </p>
          </div>
        </div>
        <svg
          className="h-10 max-w-[340px] text-primary-container/25"
          fill="none"
          viewBox="0 0 380 40"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <line stroke="currentColor" strokeWidth="1.5" x1="0" x2="380" y1="35" y2="35" />
          <path d="M20 35V18L45 8L70 18V35" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
          <path d="M45 8V35" stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.8" />
          <path d="M90 35V22H130V35" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="110" cy="16" r="3" stroke="currentColor" strokeWidth="1" />
          <path d="M150 35V12L190 5L230 12V35" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
          <line stroke="currentColor" strokeWidth="1" x1="170" x2="170" y1="20" y2="28" />
          <line stroke="currentColor" strokeWidth="1" x1="190" x2="190" y1="17" y2="28" />
          <line stroke="currentColor" strokeWidth="1" x1="210" x2="210" y1="20" y2="28" />
          <path d="M250 35V20H290V35" stroke="currentColor" strokeWidth="1.2" />
          <path d="M310 35V15L340 7L370 15V35" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Filings" value={mine.length} icon={FolderOpen} trend="All-time archival filings" />
        <StatCard
          label="Pending"
          value={count("PENDING")}
          icon={Hourglass}
          trend="Awaiting registrar review"
          iconClassName="bg-secondary-container/50 text-on-secondary-fixed"
          trendClassName="text-on-secondary-fixed-variant"
          glowClassName="bg-secondary-container/30"
        />
        <StatCard
          label="In Progress"
          value={count("IN_PROGRESS")}
          icon={HardHat}
          trend="Dispatched to campus crews"
          iconClassName="bg-surface-container-high text-primary"
          dotClassName="animate-pulse bg-primary"
          glowClassName="bg-primary-fixed/20"
        />
        <StatCard
          label="Resolved"
          value={count("RESOLVED")}
          icon={CircleCheck}
          trend="Completed satisfactorily"
          iconClassName="bg-surface-container-low text-tertiary"
          dotClassName="bg-tertiary"
          glowClassName="bg-tertiary-fixed/30"
        />
      </div>

      {/* Filters + list */}
      <div className="space-y-space-md">
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-surface-container-lowest p-space-sm shadow-sm">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-lg px-space-md py-2 font-label-md text-label-md transition duration-200",
                tab.active
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-secondary hover:bg-surface-container-low hover:text-on-surface",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={CircleCheck}
            title="No complaints yet"
            description="You have no active reports or complaints filed under this filter. Campus operations and your learning spaces are operating smoothly."
            action={
              <Link
                href="/complaints/new"
                className="inline-flex items-center gap-space-xs rounded-xl bg-surface-container px-space-md py-2.5 font-label-md text-label-md text-on-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container hover:text-on-primary"
              >
                <CirclePlus className="size-[18px]" />
                <span>File your first report</span>
              </Link>
            }
          />
        ) : (
          <div className="space-y-space-md">
            {visible.map((c) => {
              const dept = DEPARTMENTS[c.department];
              return (
                <div
                  key={c.id}
                  className="group flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md lg:flex-row lg:items-center"
                >
                  <div className="flex min-w-0 items-start gap-space-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary transition-transform duration-200 group-hover:scale-105">
                      <DepartmentIcon department={c.department} className="size-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <StatusBadge status={c.status} />
                        <span className="font-label-sm text-label-sm text-secondary">
                          Submitted {dateFormat.format(c.createdAt)}
                        </span>
                      </div>
                      <h2 className="font-headline-md text-headline-md leading-snug text-on-surface transition-colors group-hover:text-primary">
                        {c.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 font-body-md text-body-md text-secondary">
                        <span className="inline-flex items-center gap-1 text-on-surface-variant">
                          <Building2 className="size-4" />
                          {dept.label} • {dept.adminName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-secondary">
                          <Tag className="size-4" />
                          {c.issueType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-space-md lg:justify-end lg:pl-space-md">
                    {c.status === "RESOLVED" && c.rating === null ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 font-label-md text-label-md text-on-surface transition duration-200 group-hover:bg-primary-container group-hover:text-on-primary">
                        <Star className="size-4 text-secondary group-hover:text-on-primary" />
                        <span>Rate resolution</span>
                      </span>
                    ) : null}
                    {c.rating !== null ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5 font-label-md text-label-md text-on-surface">
                        <Star className="size-4 fill-current text-primary" />
                        <span className="font-semibold">{c.rating.toFixed(1)}</span>
                        <span className="text-xs text-secondary">(Rated)</span>
                      </span>
                    ) : null}
                    <ComplaintRowActions id={c.id} status={c.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SLA + support */}
      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-3">
        <div className="space-y-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Service Level Agreement
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Campus Resolution Speed</h3>
            </div>
            <span className="rounded bg-surface-container-low px-2 py-1 font-label-sm text-label-sm font-semibold text-tertiary">
              94.2% on-time
            </span>
          </div>
          <p className="font-body-md text-body-md text-secondary">
            Academic tech and infrastructural grievances are routed through university dispatch tiers with mandatory
            48-hour response milestones.
          </p>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="font-medium text-on-surface">Facilities &amp; Infrastructure (4h avg)</span>
                <span className="text-secondary">98% compliance</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                <div className="h-full rounded-full bg-primary" style={{ width: "98%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="font-medium text-on-surface">Classroom &amp; Academic Tech (12h avg)</span>
                <span className="text-secondary">89% compliance</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                <div className="h-full rounded-full bg-primary-container" style={{ width: "89%" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between space-y-space-md rounded-xl bg-surface-container-low p-space-lg shadow-sm">
          <div className="space-y-space-xs">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-lowest text-primary">
              <Headset className="size-[18px]" />
            </div>
            <h4 className="font-headline-md text-headline-md text-on-surface">Ombudsman Direct Line</h4>
            <p className="font-body-md text-body-md text-secondary">
              Urgent safety hazard or unresolved complaint past 7 days? Reach the Student Dean&apos;s confidential
              office directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
