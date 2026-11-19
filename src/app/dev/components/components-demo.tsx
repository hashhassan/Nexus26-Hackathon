"use client";

import { useState } from "react";
import { Activity, Inbox, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  InputField,
  LoadingState,
  Navbar,
  PageHeader,
  SelectField,
  Sidebar,
  StatCard,
  TextareaField,
} from "@/components/shared";
import { Button } from "@/components/ui/button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function ComponentsDemo() {
  const [lastAction, setLastAction] = useState("none");

  return (
    <div className="space-y-10">
      <PageHeader
        title="Shared components"
        description="Dev-only preview. This page returns 404 in production."
        actions={
          <Button>
            <Plus /> New
          </Button>
        }
      />

      <Section title="AppShell">
        <p className="text-sm text-muted-foreground">
          This whole page is rendered inside AppShell (navbar on top, centered max-width content).
        </p>
      </Section>

      <Section title="Navbar">
        <div className="overflow-hidden rounded-lg border">
          <Navbar
            brand="Brand"
            links={[
              { href: "/", label: "Home" },
              { href: "/dev/components", label: "Components" },
            ]}
            userArea={<Button size="sm">Action</Button>}
          />
        </div>
      </Section>

      <Section title="Sidebar (collapsible on mobile)">
        <div className="rounded-lg border p-3">
          <Sidebar
            title="Demo menu"
            items={[
              { href: "/", label: "Dashboard", icon: <Activity /> },
              { href: "/dev/components", label: "Components", icon: <Users /> },
            ]}
          />
        </div>
      </Section>

      <Section title="PageHeader">
        <div className="rounded-lg border p-4">
          <PageHeader
            className="mb-0"
            title="Projects"
            description="A title, description and actions slot."
            actions={<Button variant="outline">Secondary</Button>}
          />
        </div>
      </Section>

      <Section title="StatCard">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Users" value={1204} icon={Users} trend="+8% this month" />
          <StatCard label="Activity" value="87%" icon={Activity} />
          <StatCard label="No icon" value="42" trend="Plain card" />
        </div>
      </Section>

      <Section title="EmptyState">
        <EmptyState
          icon={Inbox}
          title="No messages"
          description="When you get messages they will appear here."
          action={<Button variant="outline">Compose</Button>}
        />
      </Section>

      <Section title="LoadingState: cards">
        <LoadingState variant="cards" count={3} />
      </Section>
      <Section title="LoadingState: list">
        <LoadingState variant="list" count={3} />
      </Section>
      <Section title="LoadingState: table">
        <LoadingState variant="table" count={4} />
      </Section>

      <Section title="ErrorState">
        <div className="rounded-lg border">
          <ErrorState
            message="We could not load this data."
            onRetry={() => toast.info("Retry clicked")}
          />
        </div>
      </Section>

      <Section title="ConfirmDialog">
        <div className="flex flex-wrap items-center gap-3">
          <ConfirmDialog
            trigger={<Button variant="outline">Default confirm</Button>}
            title="Publish changes?"
            description="This will make your changes visible."
            confirmLabel="Publish"
            onConfirm={() => setLastAction("published")}
          />
          <ConfirmDialog
            trigger={
              <Button variant="destructive">
                <Trash2 /> Delete
              </Button>
            }
            title="Delete this item?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            destructive
            onConfirm={() => setLastAction("deleted")}
          />
          <span className="text-sm text-muted-foreground">Last confirmed: {lastAction}</span>
        </div>
      </Section>

      <Section title="Form fields">
        <form className="grid max-w-md gap-4" onSubmit={(e) => e.preventDefault()}>
          <InputField label="Name" name="demo-name" placeholder="Jane Doe" description="Helper text." />
          <InputField label="Email" name="demo-email" defaultValue="not-an-email" error="Enter a valid email address" />
          <TextareaField label="Bio" name="demo-bio" placeholder="Tell us about yourself" />
          <SelectField
            label="Role"
            name="demo-role"
            placeholder="Choose a role"
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
          />
        </form>
      </Section>
    </div>
  );
}
