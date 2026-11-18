import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/shared";
import { ComponentsDemo } from "./components-demo";

export default function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <AppShell navbar={<AppHeader />}>
      <ComponentsDemo />
    </AppShell>
  );
}
