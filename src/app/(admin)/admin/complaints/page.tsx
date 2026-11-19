import Link from "next/link";
import { ChevronLeft, ChevronRight, RotateCcw, SearchX, Tag, Building2, ToggleRight } from "lucide-react";
import type { ComplaintStatus } from "@/generated/prisma/client";
import { FilterSelect } from "@/components/admin/filter-select";
import { SearchInput } from "@/components/admin/search-input";
import { DepartmentIcon, EmptyState, StatusBadge } from "@/components/shared";
import { DEPARTMENTS, DEPARTMENT_KEYS, STATUS_LABELS } from "@/lib/constants";
import { mockComplaints } from "@/lib/mock-data";
import { cn, getInitials } from "@/lib/utils";

const PAGE_SIZE = 10;
const STATUSES = Object.keys(STATUS_LABELS) as ComplaintStatus[];
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

type Params = { q?: string; department?: string; status?: string; page?: string };

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export default async function AdminComplaintsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const department = DEPARTMENT_KEYS.find((k) => k === params.department);
  const status = STATUSES.find((s) => s === params.status);

  const filtered = mockComplaints
    .filter((c) => !department || c.department === department)
    .filter((c) => !status || c.status === status)
    .filter((c) => !q || c.title.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1), totalPages);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = (page - 1) * PAGE_SIZE + rows.length;
  const pendingCount = mockComplaints.filter((c) => c.status === "PENDING").length;

  function pageHref(p: number) {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (department) next.set("department", department);
    if (status) next.set("status", status);
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `/admin/complaints?${qs}` : "/admin/complaints";
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-space-lg pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-sm pt-2">
        <div className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          <span>Academic Administration</span>
          <span className="text-outline-variant">/</span>
          <span className="font-semibold text-primary">Incident Management</span>
        </div>
        <div className="flex max-w-2xl flex-col gap-1">
          <div className="flex flex-wrap items-center gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">Complaints</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-0.5 font-label-md text-label-md text-on-surface-variant">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {mockComplaints.length} total cases, {pendingCount} pending triage
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Review, triage, and manage student grievances across university facilities, IT infrastructure, academics,
            and dining services.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="flex flex-wrap items-center gap-space-xs">
          <SearchInput placeholder="Search by title..." />
          <FilterSelect
            param="department"
            ariaLabel="Filter by category"
            allLabel="All Categories"
            icon={<Building2 />}
            options={DEPARTMENT_KEYS.map((k) => ({ value: k, label: DEPARTMENTS[k].label }))}
          />
          <FilterSelect
            param="status"
            ariaLabel="Filter by status"
            allLabel="Status: All"
            icon={<ToggleRight />}
            options={STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
          />
          <Link
            href="/admin/complaints"
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-error-container/40 hover:text-error"
          >
            <RotateCcw className="size-4" />
            <span>Clear filters</span>
          </Link>
        </div>
        <div className="font-label-sm text-label-sm text-on-surface-variant">
          Showing <span className="font-semibold text-on-surface">{filtered.length === 0 ? 0 : `${from}–${to}`}</span>{" "}
          of <span className="font-semibold text-on-surface">{filtered.length}</span> complaints
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No complaints found matching your criteria"
          description="Try clearing filters, checking for spelling errors, or searching for a different keyword."
          action={
            <Link
              href="/admin/complaints"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover"
            >
              <RotateCcw className="size-4" />
              Reset all filters
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  <th className="px-4 py-3">ID</th>
                  <th className="min-w-[280px] px-4 py-3">Subject</th>
                  <th className="min-w-[160px] px-4 py-3">Student</th>
                  <th className="min-w-[150px] px-4 py-3">Department</th>
                  <th className="min-w-[120px] px-4 py-3">Logged</th>
                  <th className="min-w-[110px] px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {rows.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-surface-container-low">
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="font-mono text-label-md font-semibold text-primary">
                        #{c.id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-title-md text-title-md text-on-surface transition-colors group-hover:text-primary">
                          {c.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 font-body-md text-body-md text-on-surface-variant">
                          <Tag className="size-3.5 text-outline" />
                          {c.issueType}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-fixed font-label-sm text-label-sm font-semibold text-on-secondary-fixed">
                          {getInitials(c.student.name)}
                        </div>
                        <span className="font-label-md text-label-md font-medium leading-tight text-on-surface">
                          {c.student.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container px-2 py-1 font-label-md text-label-md text-on-surface">
                        <DepartmentIcon department={c.department} className="size-4 text-secondary" />
                        {DEPARTMENTS[c.department].label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-label-md text-label-md text-on-surface-variant">
                      {dateFormat.format(c.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/complaints/${c.id}`}
                        className="inline-flex items-center rounded-lg bg-surface-container px-3 py-1.5 font-label-md text-label-md text-on-surface transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container hover:text-on-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 bg-surface-container-low px-4 py-3 sm:flex-row">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Showing <span className="font-semibold text-on-surface">{from}</span> to{" "}
              <span className="font-semibold text-on-surface">{to}</span> of{" "}
              <span className="font-semibold text-on-surface">{filtered.length}</span> results
            </span>
            <nav aria-label="Pagination" className="flex items-center gap-1">
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface-container-lowest px-3 py-1.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container"
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-label-md text-label-md text-outline">
                  <ChevronLeft className="size-4" />
                  Previous
                </span>
              )}
              {pageList(page, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`gap-${i}`} className="px-1 text-secondary">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg font-label-md text-label-md transition-colors",
                      p === page
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-container-lowest text-on-surface hover:bg-surface-container",
                    )}
                  >
                    {p}
                  </Link>
                ),
              )}
              {page < totalPages ? (
                <Link
                  href={pageHref(page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface-container-lowest px-3 py-1.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-label-md text-label-md text-outline">
                  Next
                  <ChevronRight className="size-4" />
                </span>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
