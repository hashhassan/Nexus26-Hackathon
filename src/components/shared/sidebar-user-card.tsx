import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

type SidebarUserCardProps = {
  name: string;
  /** "Student", a department name, or "Super Admin". */
  roleLabel: string;
  /** Where the name/avatar area links to (the profile page). */
  href?: string;
};

export function SidebarUserCard({ name, roleLabel, href }: SidebarUserCardProps) {
  const identity = (
    <>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-label-md text-label-md text-on-primary">
        {getInitials(name)}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-label-md text-label-md font-medium text-on-surface">{name}</span>
        <span className="w-fit rounded-full bg-surface-container px-1.5 py-0.5 font-label-sm text-label-sm text-secondary">
          {roleLabel}
        </span>
      </div>
    </>
  );

  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-space-sm">
      {href ? (
        <Link
          href={href}
          aria-label="Profile & Settings"
          className="-m-1 flex min-w-0 items-center gap-space-sm rounded-lg p-1 transition-colors duration-200 hover:bg-surface-container"
        >
          {identity}
        </Link>
      ) : (
        <div className="flex min-w-0 items-center gap-space-sm">{identity}</div>
      )}
      <SignOutButton iconOnly />
    </div>
  );
}
