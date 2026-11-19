"use client";

import { useState } from "react";
import { Check, CircleCheck, FileText, IdCard, KeyRound, Lock, Power, Star, BarChart3, ShieldCheck, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { SignOutButton } from "@/components/shared";
import { changePasswordSchema, updateProfileSchema } from "@/lib/schemas";
import { cn, getInitials } from "@/lib/utils";

type Role = "student" | "dept_admin" | "super_admin";

type ProfileSettingsViewProps = {
  user: { name: string; email: string; createdAt: Date };
  role: Role;
  /** Department name, for dept_admin. */
  departmentLabel?: string;
  stats: {
    /** Filed (student) or handled (admin). */
    total: number;
    resolved: number;
    /** Rating given (student) or avg satisfaction (admin); null when nothing is rated. */
    avgRating: number | null;
    ratedCount: number;
  };
};

const memberSince = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const inputClass =
  "w-full rounded-lg bg-surface-container-lowest px-3.5 py-2.5 font-body-md text-body-md text-on-surface shadow-sm transition-shadow placeholder:text-secondary/60 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary-container)] aria-invalid:shadow-[0_0_0_2px_var(--color-error)]";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-label-md text-label-md font-semibold text-on-surface">
        {label}
      </label>
      {children}
      {error ? <span className="font-label-sm text-label-sm text-error">{error}</span> : null}
    </div>
  );
}

function roleBadge(role: Role, departmentLabel?: string) {
  if (role === "super_admin") return "Super Admin";
  if (role === "dept_admin") return `${departmentLabel ?? "Department"} Admin`;
  return "Student";
}

export function ProfileSettingsView({ user, role, departmentLabel, stats }: ProfileSettingsViewProps) {
  const isAdmin = role !== "student";
  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState<string>();
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const parsed = updateProfileSchema.safeParse({ name });
    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message);
      return;
    }
    setNameError(undefined);
    // Mock only: Better Auth updateUser arrives in Task 10b.
    toast.success("Profile updated");
  }

  function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    const parsed = changePasswordSchema.safeParse(pw);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
      setPwErrors(errors);
      return;
    }
    setPwErrors({});
    setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    // Mock only: Better Auth changePassword arrives in Task 10b.
    toast.success("Password updated");
  }

  const resolvedRate = stats.total ? Math.round((stats.resolved / stats.total) * 1000) / 10 : 0;
  const rating = stats.avgRating ?? 0;
  const activity = [
    {
      label: isAdmin ? "Complaints Handled" : "Complaints Filed",
      icon: FileText,
      value: String(stats.total),
      note: isAdmin ? "All-time reports in scope" : "All-time reports submitted",
      bar: "w-full bg-primary-container",
      width: 100,
    },
    {
      label: "Resolved",
      icon: CircleCheck,
      value: String(stats.resolved),
      chip: `${resolvedRate}% rate`,
      note: "Successful remediations",
      bar: "bg-secondary-container",
      width: resolvedRate,
    },
    {
      label: isAdmin ? "Avg. Satisfaction" : "Avg. Rating",
      icon: Star,
      value: stats.avgRating === null ? "–" : stats.avgRating.toFixed(1),
      stars: stats.avgRating === null ? undefined : Math.round(rating),
      note: `Across ${stats.ratedCount} evaluated ${stats.ratedCount === 1 ? "ticket" : "tickets"}`,
      bar: "bg-primary-container",
      width: (rating / 5) * 100,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            {isAdmin ? "Admin Console" : "Student Portal"}
          </span>
          <span className="text-[12px] text-secondary opacity-40">/</span>
          <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
            Account &amp; Security
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Profile &amp; Settings</h1>
        <p className="max-w-xl font-body-md text-body-md text-on-surface-variant">
          Manage your campus account details, review your activity, and update account security.
        </p>
      </header>

      {/* Card 1: Profile */}
      <section className="relative flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
            <IdCard className="size-[18px]" />
          </div>
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Profile Details</h2>
        </div>

        <div className="flex flex-col gap-5 rounded-xl bg-surface-container-low/70 p-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container font-display-md text-display-md font-medium text-on-primary shadow-sm">
              {getInitials(user.name)}
            </div>
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-lowest shadow-sm">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary">
                <Check className="size-2.5 text-on-primary" strokeWidth={3} />
              </span>
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-title-md text-title-md font-semibold text-on-surface">{user.name}</h3>
              <span className="rounded-full bg-primary px-2.5 py-0.5 font-label-sm text-label-sm font-medium tracking-wide text-on-primary">
                {roleBadge(role, departmentLabel)}
              </span>
            </div>
            <p className="font-body-md text-body-md text-secondary">{user.email}</p>
            <div className="mt-0.5 flex items-center gap-1 font-label-sm text-label-sm text-secondary">
              <CalendarDays className="size-3.5" />
              Member since {memberSince.format(user.createdAt)}
            </div>
          </div>
        </div>

        <form className="flex flex-col gap-5" onSubmit={saveProfile} noValidate>
          <Field id="full-name" label="Full name" error={nameError}>
            <input
              id="full-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!nameError}
              placeholder="Your full name"
              className={inputClass}
            />
          </Field>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="email-address" className="font-label-md text-label-md font-semibold text-on-surface">
                Email address
              </label>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary">
                <Lock className="size-3.5" /> Read-only
              </span>
            </div>
            <div className="relative">
              <input
                id="email-address"
                type="email"
                value={user.email}
                readOnly
                className="w-full cursor-not-allowed select-none rounded-lg bg-surface-container-low px-3.5 py-2.5 pr-10 font-body-md text-body-md text-on-surface-variant"
              />
              <ShieldCheck className="absolute right-3 top-3 size-[18px] text-secondary" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover"
            >
              <Check className="size-[18px]" />
              Save changes
            </button>
          </div>
        </form>
      </section>

      {/* Card 2: Activity */}
      <section className="flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-container/60 text-on-secondary-fixed-variant">
            <BarChart3 className="size-[18px]" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Your Activity</h2>
            <p className="font-body-md text-[13px] text-secondary">Lifetime summary of campus issue tracking</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {activity.map((m) => (
            <div key={m.label} className="flex flex-col justify-between rounded-xl bg-surface-container-low p-4">
              <div className="mb-2 flex items-center justify-between text-secondary">
                <span className="font-label-sm text-label-sm uppercase tracking-wider">{m.label}</span>
                <m.icon className="size-[18px] text-primary" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-md text-display-md font-semibold leading-tight text-on-surface">
                    {m.value}
                  </span>
                  {m.chip ? (
                    <span className="rounded bg-secondary-container px-1.5 py-0.5 font-label-sm text-label-sm font-semibold text-primary">
                      {m.chip}
                    </span>
                  ) : null}
                  {m.stars !== undefined ? (
                    <span className="flex items-center text-[14px] text-primary-container">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={cn(n > (m.stars ?? 0) && "text-outline-variant")}>
                          ★
                        </span>
                      ))}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-label-sm text-label-sm text-secondary">{m.note}</p>
              </div>
              <div className="mt-3 pt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                  <div className={cn("h-full rounded-full", m.bar)} style={{ width: `${m.width}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Card 3: Security */}
      <section className="flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <KeyRound className="size-[18px]" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Security &amp; Credentials</h2>
            <p className="font-body-md text-[13px] text-secondary">
              Update your account password. It must be at least 8 characters.
            </p>
          </div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={updatePassword} noValidate>
          {(
            [
              ["currentPassword", "Current password", "Enter existing password", "current-password"],
              ["newPassword", "New password", "Enter new password", "new-password"],
              ["confirmPassword", "Confirm new password", "Repeat new password", "new-password"],
            ] as const
          ).map(([key, label, placeholder, autoComplete]) => (
            <Field key={key} id={key} label={label} error={pwErrors[key]}>
              <input
                id={key}
                type="password"
                autoComplete={autoComplete}
                value={pw[key]}
                onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                aria-invalid={!!pwErrors[key]}
                placeholder={placeholder}
                className={inputClass}
              />
            </Field>
          ))}
          <div className="flex items-center justify-end pt-3">
            <button
              type="submit"
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary-container-hover"
            >
              <KeyRound className="size-[18px]" />
              Update password
            </button>
          </div>
        </form>
      </section>

      {/* Card 4: Session */}
      <section className="flex flex-col gap-5 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error-container text-on-error-container">
            <Power className="size-[18px]" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">Session &amp; Access</h2>
            <p className="font-body-md text-[13px] text-secondary">
              This ends your session on this device. You will be redirected to the sign-in page.
            </p>
          </div>
        </div>
        <div>
          <SignOutButton
            label="Sign out of this device"
            className="h-9 border-status-rejected-fg px-3.5 text-status-rejected-fg transition duration-200 hover:-translate-y-0.5 hover:bg-status-rejected hover:text-status-rejected-fg"
          />
        </div>
      </section>
    </div>
  );
}
