"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DepartmentBarChartProps = {
  data: { label: string; count: number }[];
};

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const rows = data.map((d) => ({ ...d, pill: `${d.count} (${total ? Math.round((d.count / total) * 100) : 0}%)` }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 28, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--color-surface-container)" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fontWeight: 500, fill: "var(--color-on-surface)" }}
          />
          <YAxis hide domain={[0, "dataMax + 1"]} />
          <Tooltip
            cursor={{ fill: "var(--color-surface-container-low)" }}
            formatter={(value) => [`${value} complaints`, "Volume"]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-flyout)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" fill="var(--color-primary-container)" radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={false}>
            <LabelList
              dataKey="pill"
              content={({ x, y, width, value }) => (
                <text
                  x={Number(x) + Number(width) / 2}
                  y={Number(y) - 8}
                  textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 600, fill: "var(--color-on-surface)" }}
                >
                  {String(value)}
                </text>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
