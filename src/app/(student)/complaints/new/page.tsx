import { NewComplaintForm } from "@/components/shared";

export default function NewComplaintPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col pb-space-xl">
      <header className="mb-space-lg flex flex-col gap-2 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
            Student Dashboard
          </span>
          <span className="text-[12px] text-secondary opacity-60">/</span>
          <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">
            New Institutional Filing
          </span>
        </div>
        <h1 className="mt-1 font-headline-lg text-display-md font-normal tracking-tight text-on-surface">
          Report an issue
        </h1>
        <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
          Select an operational unit or academic division to automatically triage and route your inquiry directly to
          authorized faculty leads and facilities coordinators.
        </p>
      </header>
      <NewComplaintForm />
    </div>
  );
}
