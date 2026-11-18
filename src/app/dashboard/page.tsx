import { Activity, FolderOpen, Plus, Users } from "lucide-react";
import { requireSession } from "@/server/auth";
import { EmptyState, PageHeader, StatCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name || user.email}.`}
        actions={
          <Button>
            <Plus /> New
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Mock values */}
        <StatCard label="Total items" value={128} icon={FolderOpen} trend="+12% from last week" />
        <StatCard label="Active users" value={42} icon={Users} trend="+3 today" />
        <StatCard label="Activity" value="87%" icon={Activity} trend="Stable" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your account</CardTitle>
          <CardDescription>Read from the server session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span> {user.name}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> {user.email}
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span> {user.role}
          </p>
        </CardContent>
      </Card>

      <EmptyState
        className="mt-6"
        icon={FolderOpen}
        title="Nothing here yet"
        description="Items you create will show up here."
        action={
          <Button variant="outline">
            <Plus /> Create your first item
          </Button>
        }
      />
    </>
  );
}
