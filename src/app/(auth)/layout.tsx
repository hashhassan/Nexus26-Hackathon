import { BadgeCheck, Building2, Landmark, Lock, NotebookPen, Route, ShieldCheck } from "lucide-react";
import { AuthTabs } from "@/components/shared";

const features = [
  { icon: <NotebookPen className="size-5" />, title: "Submit", step: "01", text: "File complaints & feedback in seconds with category tagging." },
  { icon: <Route className="size-5" />, title: "Track", step: "02", text: "Real-time ticket milestone tracking and department routing." },
  { icon: <BadgeCheck className="size-5" />, title: "Resolve", step: "03", text: "Direct resolutions, feedback verification, and closed-loop updates." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 bg-surface font-body-md text-on-surface lg:grid-cols-2">
        {/* LEFT HALF */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-primary-container p-8 text-on-primary sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-on-primary-fixed/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-12 h-80 w-80 rounded-full bg-tertiary-container/30 blur-2xl" />

          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest/10 backdrop-blur-sm">
                <Landmark className="size-6 text-surface-container-lowest" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md leading-none tracking-tight text-surface-container-lowest">
                  CampusConnect
                </span>
                <span className="mt-1 font-label-sm text-label-sm uppercase tracking-widest text-on-primary-container">
                  Institutional Portal
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-10 max-w-xl lg:my-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/10 px-3 py-1 font-label-sm text-label-sm text-on-primary-container">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-fixed" />
              Academic Accountability Network
            </div>
            <h1 className="max-w-lg font-display-lg text-display-lg font-normal leading-tight tracking-tight text-surface-container-lowest">
              Every voice on campus, heard.
            </h1>
            <p className="mt-4 font-body-lg text-body-lg font-normal leading-relaxed text-surface-container-high/90">
              A unified, transparent platform for student inquiries, facility reports, and administrative resolution.
            </p>
            <div className="mt-10 flex flex-col gap-5">
              {features.map((f) => (
                <div key={f.title} className="group flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest/10 text-surface-container-lowest transition-transform duration-200 group-hover:scale-105">
                    {f.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 font-title-md text-title-md font-medium text-surface-container-lowest">
                      {f.title}
                      <span className="font-label-sm text-label-sm font-normal text-on-primary-container">{f.step}</span>
                    </span>
                    <p className="mt-0.5 font-body-md text-body-md text-surface-container-high/80">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-surface-container-lowest/15 pt-8 font-label-md text-label-md text-on-primary-container">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <span>Official University Student Affairs &amp; Campus Operations Network</span>
            </div>
            <span className="hidden font-label-sm text-label-sm text-surface-container-high/60 sm:inline">v2.4.1</span>
          </div>
        </div>

        {/* RIGHT HALF */}
        <div className="flex flex-col items-center justify-center bg-surface p-6 sm:p-10 lg:p-14">
          <div className="flex w-full max-w-md flex-col rounded-xl bg-surface-container-lowest p-7 shadow-sm sm:p-10">
            <AuthTabs />
            {children}
            <div className="mt-8 flex flex-col gap-2.5 border-t border-surface-container pt-6">
              <div className="flex items-center gap-2 font-body-md text-body-md text-secondary">
                <Lock className="size-4 text-outline" />
                <span>Department admins use their provided credentials.</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 font-label-md text-label-md text-outline">
            <Building2 className="size-3.5" />
            <span>Secure Identity Provider • Standard University Policy Compliant</span>
          </div>
        </div>
    </div>
  );
}
