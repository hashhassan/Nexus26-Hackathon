import Link from "next/link";
import { ArrowRight, Building2, CircleCheck, CircleX, FolderOpen, HardHat, Hourglass } from "lucide-react";
import { DepartmentBarChart } from "@/components/admin/department-bar-chart";
import { FilterSelect } from "@/components/admin/filter-select";
import { StatusDonutChart, type StatusSlice } from "@/components/admin/status-donut-chart";
import { StatCard, StatusBadge } from "@/components/shared";
import { DEPARTMENTS, DEPARTMENT_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { requireRole } from "@/server/auth";
import { getDashboardData } from "@/server/queries/dashboard";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string | string[] }>;
}) {
  const viewer = await requireRole(["dept_admin", "super_admin"]);
  const isSuper = viewer.role === "super_admin";
  const { department } = await searchParams;
  const requested = isSuper && typeof department === "string" ? department : undefined;
  const ownDepartment = DEPARTMENT_KEYS.find((k) => k === viewer.department);

  const { stats, satisfaction, chart, recurring, recent } = await getDashboardData(viewer, requested);
  const maxRecurring = Math.max(1, ...recurring.map((i) => i.count));
  const avgText = satisfaction.average === null ? "—" : satisfaction.average.toFixed(1);

  const slices: StatusSlice[] = [
    { key: "RESOLVED", label: "Resolved", count: stats.resolved, color: "var(--color-status-resolved-fg)" },
    { key: "IN_PROGRESS", label: "In Progress", count: stats.inProgress, color: "var(--color-status-progress-fg)" },
    { key: "PENDING", label: "Pending", count: stats.pending, color: "var(--color-status-pending-fg)" },
    { key: "REJECTED", label: "Rejected", count: stats.rejected, color: "var(--color-status-rejected-fg)" },
  ];
  const resolvedShare = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const filledStars = Math.round(satisfaction.average ?? 0);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-space-lg pb-space-xl">
      {/* Header */}
      <section className="flex flex-col gap-space-md pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            Institutional Administration &amp; Analytics • Fall Semester 2024
          </span>
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-2.5 py-1 text-on-surface">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-container" />
            <span className="font-label-sm text-label-sm font-medium text-on-surface-variant">
              Live Sync: 99.8% uptime
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
          <div className="flex flex-col">
            <h1 className="font-display-md text-display-md tracking-tight text-on-surface">Overview</h1>
            <p className="mt-1 max-w-2xl font-body-md text-body-md text-on-surface-variant">
              Real-time campus resolution metrics, cross-department incident triage, and satisfaction ratings.
            </p>
          </div>
          {isSuper ? (
            <FilterSelect
              param="department"
              ariaLabel="Filter by department"
              allLabel="All Departments"
              icon={<Building2 />}
              options={DEPARTMENT_KEYS.map((k) => ({ value: k, label: DEPARTMENTS[k].label }))}
            />
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3.5 py-2 font-label-md text-label-md text-on-surface shadow-sm">
              <Building2 className="size-[18px] text-secondary" />
              <span>{ownDepartment ? DEPARTMENTS[ownDepartment].adminName : "Department Admin"}</span>
            </div>
          )}
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          variant="compact"
          label="Total Complaints"
          value={stats.total}
          icon={FolderOpen}
          trend="All filed complaints"
          iconClassName="bg-surface-container-high text-primary-container"
        />
        <StatCard
          variant="compact"
          label="Pending Review"
          value={stats.pending}
          icon={Hourglass}
          trend="Awaiting triage"
          iconClassName="bg-surface-container-high text-secondary"
          trendClassName="text-on-surface-variant"
        />
        <StatCard
          variant="compact"
          label="In Progress"
          value={stats.inProgress}
          icon={HardHat}
          trend="Active dispatch"
          iconClassName="bg-secondary-fixed text-on-secondary-fixed-variant"
          trendClassName="text-on-surface-variant"
        />
        <StatCard
          variant="compact"
          label="Resolved"
          value={stats.resolved}
          icon={CircleCheck}
          trend={`${resolvedShare}% of total`}
          iconClassName="bg-surface-container-low text-primary-container"
          trendClassName="text-primary-container"
          dotClassName="bg-primary-container"
        />
        <StatCard
          variant="compact"
          label="Rejected"
          value={stats.rejected}
          icon={CircleX}
          trend="Duplicate / Non-actionable"
          iconClassName="bg-error-container text-on-error-container"
        />
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-low p-space-lg shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-secondary-fixed/50 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-semibold text-on-surface">Avg. Satisfaction</span>
            <span className="inline-flex items-center rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-sm text-label-sm font-bold text-primary-container">
              {avgText} ★
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
                {avgText}
              </span>
              <span className="font-label-md text-label-md text-secondary">/ 5.0</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[13px] text-primary-container">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={cn(n > filledStars && "text-outline-variant")}>
                  ★
                </span>
              ))}
            </div>
            <div className="mt-1 font-label-sm text-label-sm text-secondary">
              {satisfaction.count} student {satisfaction.count === 1 ? "rating" : "ratings"}
            </div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="flex items-center justify-between pb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {isSuper ? "Complaints by Department" : "Complaints by Issue Type"}
              </h2>
              <p className="mt-0.5 font-label-md text-label-md text-secondary">
                {isSuper
                  ? "Volume load across administrative operational units"
                  : "Volume load across the issue types of your department"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm font-medium text-secondary">
              <span className="h-2 w-2 rounded-full bg-primary-container" /> Volume
            </span>
          </div>
          <DepartmentBarChart data={chart} />
        </div>

        <div className="flex flex-col rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="flex items-center justify-between pb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Status Breakdown</h2>
              <p className="mt-0.5 font-label-md text-label-md text-secondary">
                Distribution across resolution lifecycle stages
              </p>
            </div>
            <span className="rounded-md bg-surface-container-low px-2.5 py-1 font-label-sm text-label-sm font-semibold text-secondary">
              {stats.total} Cases
            </span>
          </div>
          <div className="my-auto">
            <StatusDonutChart data={slices} />
          </div>
        </div>
      </section>

      {/* Recurring + recent */}
      <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="flex items-center justify-between pb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Top Recurring Issues</h2>
              <p className="mt-0.5 font-label-md text-label-md text-secondary">
                High-frequency problems prioritized by report frequency
              </p>
            </div>
            <span className="rounded-md bg-surface-container-low px-2 py-1 font-label-sm text-label-sm text-secondary">
              Ranked
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-space-md">
            {recurring.map((issue, i) => (
              <div
                key={`${issue.department}-${issue.issueType}`}
                className="flex flex-col gap-1.5 rounded-xl bg-surface-container-low/60 p-space-sm transition-colors hover:bg-surface-container-low"
              >
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-label-sm text-label-sm font-bold",
                        i === 0 ? "bg-primary-container text-on-primary" : "bg-surface-container-high text-on-surface",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="truncate font-title-md text-title-md text-on-surface">{issue.issueType}</span>
                    <span className="hidden rounded-full bg-secondary-fixed px-2 py-0.5 font-label-sm text-label-sm text-on-secondary-fixed-variant sm:inline-block">
                      {DEPARTMENTS[issue.department].label}
                    </span>
                  </div>
                  <span className="shrink-0 font-label-md text-label-md font-bold text-on-surface">
                    {issue.count} reports
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className={cn("h-full rounded-full", i < 3 ? "bg-primary-container" : "bg-secondary")}
                    style={{ width: `${Math.round((issue.count / maxRecurring) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {recurring.length === 0 ? (
              <p className="font-body-md text-body-md text-secondary">No recurring issues yet.</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="flex items-center justify-between pb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Recent Complaints</h2>
              <p className="mt-0.5 font-label-md text-label-md text-secondary">
                Live activity stream logged across campus nodes
              </p>
            </div>
            <Link
              href="/admin/complaints"
              className="inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-primary-container hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {recent.map((c) => (
              <Link
                key={c.id}
                href={`/admin/complaints/${c.id}`}
                className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-surface-container-low"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-title-md text-title-md text-on-surface transition-colors group-hover:text-primary">
                    {c.title}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">
                    {DEPARTMENTS[c.department].label} • {dateFormat.format(c.createdAt)}
                  </span>
                </div>
                <StatusBadge status={c.status} className="ml-3 whitespace-nowrap" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
