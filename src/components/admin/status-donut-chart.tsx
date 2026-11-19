"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type StatusSlice = { key: string; label: string; count: number; color: string };

export function StatusDonutChart({ data }: { data: StatusSlice[] }) {
  const total = data.reduce((sum, s) => sum + s.count, 0);
  // Recharts draws nothing for an all-zero dataset, so show a neutral ring instead.
  const slices = total > 0 ? data : [{ key: "none", label: "No data", count: 1, color: "var(--color-surface-container-high)" }];

  return (
    <div className="flex w-full flex-col items-center gap-space-lg pt-2 sm:flex-row">
      <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="count"
              nameKey="label"
              innerRadius={58}
              outerRadius={82}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((s) => (
                <Cell key={s.key} fill={s.color} />
              ))}
            </Pie>
            {total > 0 ? (
              <Tooltip
                formatter={(value, name) => [`${value} complaints`, name]}
                contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }}
              />
            ) : null}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline-lg text-headline-lg font-bold leading-none text-on-surface">{total}</span>
          <span className="mt-0.5 font-label-sm text-label-sm uppercase tracking-wider text-secondary">Total</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {data.map((s) => (
          <div key={s.key} className="flex items-center justify-between rounded-lg bg-surface-container-low p-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-label-md text-label-md font-semibold text-on-surface">{s.label}</span>
            </div>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {s.count}{" "}
              <span className="font-normal text-secondary">({total ? Math.round((s.count / total) * 100) : 0}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
