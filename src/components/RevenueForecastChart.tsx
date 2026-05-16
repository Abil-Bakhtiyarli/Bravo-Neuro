"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenueForecastPageData } from "@/lib/operationsDemoData";

type RevenueForecastChartProps = {
  branchName: string;
  points: RevenueForecastPageData["chartPoints"];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

export default function RevenueForecastChart({
  branchName,
  points,
}: RevenueForecastChartProps) {
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsChartReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="demo-card animate-demo-fade-up animate-demo-delay-2 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Revenue view
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Four-week branch forecast
          </h2>
        </div>
        <span className="demo-surface-chip px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
          {branchName}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Projected weekly revenue is anchored to the current branch run rate and adjusted with conservative demand assumptions.
      </p>

      <div className="demo-surface-panel mt-5 h-72 min-w-0 rounded-3xl bg-[linear-gradient(180deg,rgba(237,242,247,0.94),rgba(229,235,241,0.92))] p-3">
        {isChartReady ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis
                dataKey="weekLabel"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(71, 85, 105, 0.9)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={72}
                tick={{ fill: "rgba(71, 85, 105, 0.9)", fontSize: 12 }}
                tickFormatter={(value) => `AZN ${Number(value).toFixed(0)}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                formatter={(value, name) => [
                  formatCurrency(Number(value ?? 0)),
                  name === "projectedRevenueAzN" ? "Projected" : "Baseline",
                ]}
                labelFormatter={(label) => `Period: ${label}`}
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(180, 192, 205, 0.9)",
                  background: "rgba(239, 244, 248, 0.98)",
                  boxShadow: "0 12px 28px -20px rgba(15,23,42,0.28)",
                }}
              />
              <Legend />
              <Bar
                dataKey="projectedRevenueAzN"
                name="Projected"
                radius={[12, 12, 0, 0]}
                fill="var(--color-chart-1)"
                maxBarSize={34}
              />
              <Line
                type="monotone"
                dataKey="baselineRevenueAzN"
                name="Baseline"
                stroke="var(--color-chart-3)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div aria-hidden="true" className="h-full w-full rounded-[1.25rem] bg-slate-200/45" />
        )}
      </div>
    </section>
  );
}
