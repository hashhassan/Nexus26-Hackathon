import { AppHeader } from "@/components/app-header";
import { AppShell, PageHeader } from "@/components/shared";

export default function Home() {
  return (
    <AppShell navbar={<AppHeader />}>
      <PageHeader title="Nexus26" description="Hackathon project template." />
    </AppShell>
  );
}
