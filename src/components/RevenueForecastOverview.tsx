import { AlertTriangle, Compass, ShieldCheck, TrendingUp } from "lucide-react";

import type {
  ForecastDriverTone,
  RevenueForecastPageData,
} from "@/lib/operationsDemoData";
import { cn } from "@/lib/utils";

import RevenueForecastChart from "./RevenueForecastChart";

type RevenueForecastOverviewProps = {
  data: RevenueForecastPageData;
};

const toneStyles: Record<ForecastDriverTone, { badge: string; panel: string }> = {
  upside: {
    badge: "border-emerald-300/65 bg-emerald-100/60 text-emerald-900",
    panel: "text-emerald-900 bg-emerald-100/60",
  },
  risk: {
    badge: "border-rose-300/65 bg-rose-100/60 text-rose-900",
    panel: "text-rose-900 bg-rose-100/60",
  },
  watch: {
    badge: "border-sky-300/65 bg-sky-100/60 text-sky-900",
    panel: "text-sky-900 bg-sky-100/60",
  },
};

const icons = [TrendingUp, Compass, ShieldCheck, AlertTriangle] as const;

export default function RevenueForecastOverview({
  data,
}: RevenueForecastOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.summaryMetrics.map((metric, index) => {
          const Icon = icons[index] ?? TrendingUp;

          return (
            <article key={metric.label} className="demo-card animate-demo-fade-up p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground/80">{metric.label}</p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                    {metric.value}
                  </p>
                </div>
                <span className={cn("demo-surface-panel p-2.5", toneStyles[metric.tone].panel)}>
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{metric.helperText}</p>
            </article>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)] xl:items-start">
        <RevenueForecastChart branchName={data.branchName} points={data.chartPoints} />

        <section className="demo-card animate-demo-fade-up animate-demo-delay-3 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Forecast drivers
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Revenue assumptions to defend in the demo
          </h2>

          <div className="mt-5 space-y-3">
            {data.drivers.map((driver) => (
              <article
                key={driver.title}
                className="demo-surface-interactive demo-surface-interactive-hover rounded-2xl border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{driver.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {driver.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      toneStyles[driver.tone].badge,
                    )}
                  >
                    {driver.tone}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70">
                  {driver.impactLabel}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="demo-card animate-demo-fade-up animate-demo-delay-4 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Category breakdown
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
          Projected revenue by category
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Each category outlook is intentionally conservative and should read as a branch planning view, not a finance-grade forecast.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-3">Category</th>
                <th className="px-3">Projected revenue</th>
                <th className="px-3">Change</th>
                <th className="px-3">Confidence</th>
                <th className="px-3">Callout</th>
              </tr>
            </thead>
            <tbody>
              {data.categoryBreakdown.map((row) => (
                <tr key={row.category} className="demo-surface-panel">
                  <td className="rounded-l-2xl px-3 py-3 text-sm font-semibold text-foreground">
                    {row.category}
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground">
                    AZN {row.projectedRevenueAzN.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground">
                    {row.changePercent >= 0 ? "+" : ""}
                    {row.changePercent.toFixed(1)}%
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground">{row.confidencePercent}%</td>
                  <td className="rounded-r-2xl px-3 py-3 text-sm text-muted-foreground">
                    {row.callout}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
