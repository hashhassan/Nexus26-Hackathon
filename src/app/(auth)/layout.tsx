import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/shared";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navbar={<AppHeader />}>
      <div className="mx-auto w-full max-w-sm py-6">{children}</div>
    </AppShell>
  );
}
