"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SetupProgressChartProps = {
  data: Array<{
    label: string;
    value: number;
  }>;
};

export default function SetupProgressChart({
  data,
}: SetupProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} domain={[0, 100]} width={32} />
        <Tooltip cursor={{ fill: "rgba(24, 24, 27, 0.05)" }} />
        <Bar
          dataKey="value"
          radius={[10, 10, 0, 0]}
          fill="var(--color-primary)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
