"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import type { MonthlySavingsSeriesPoint } from "@/lib/types";

type MonthlySavingsChartProps = {
  branchName: string;
  series: readonly MonthlySavingsSeriesPoint[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

export default function MonthlySavingsChart({
  branchName,
  series,
}: MonthlySavingsChartProps) {
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  if (series.length === 0) {
    return (
      <section className="rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Monthly savings trend
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          Monthly net saved value
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Monthly branch history is not available for this view yet.
        </p>
      </section>
    );
  }

  const latestMonth = series[series.length - 1];
  const sixMonthTotal = series.reduce((total, point) => total + point.netSavedValueAzN, 0);

  return (
    <section className="rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Monthly savings trend
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Monthly net saved value
          </h2>
        </div>
        <span className="rounded-full border border-border/80 bg-background/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
          {branchName}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Six-month branch recovery trend from the seeded operations history.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-2xl border border-border/70 bg-background/88 px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Latest month
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {latestMonth.monthLabel} {formatCurrency(latestMonth.netSavedValueAzN)}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/88 px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Six-month total
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">{formatCurrency(sixMonthTotal)}</p>
        </div>
      </div>

      <div className="mt-4 h-56 min-w-0 rounded-3xl border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-3">
        {isChartReady ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={series} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(71, 85, 105, 0.9)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                formatter={(value) => [formatCurrency(Number(value ?? 0)), "Net saved"]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(203, 213, 225, 0.85)",
                  boxShadow: "0 16px 38px -24px rgba(15,23,42,0.45)",
                }}
              />
              <Bar
                dataKey="netSavedValueAzN"
                radius={[12, 12, 0, 0]}
                fill="var(--color-chart-1)"
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div aria-hidden="true" className="h-full w-full rounded-[1.25rem] bg-white/40" />
        )}
      </div>
    </section>
  );
}
