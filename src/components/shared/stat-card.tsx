import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  /** Small supporting text, e.g. "+12% from last week". */
  trend?: string;
  className?: string;
};

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{label}</span>
          {Icon ? <Icon className="size-4" /> : null}
        </div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {trend ? <p className="text-xs text-muted-foreground">{trend}</p> : null}
      </CardContent>
    </Card>
  );
}
