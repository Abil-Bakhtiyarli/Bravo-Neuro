import {
  AlertTriangle,
  BanknoteArrowDown,
  CalendarClock,
  PackageSearch,
  TrendingUp,
} from "lucide-react";

import type {
  DashboardKpiPresentationIconKey,
  DashboardKpiPresentationItem,
  DashboardKpiPresentationTone,
} from "@/lib/dashboardKpiPresentation";

type SummaryKpiGridProps = {
  items: readonly DashboardKpiPresentationItem[];
};

const iconByKey: Record<DashboardKpiPresentationIconKey, typeof AlertTriangle> = {
  "possible-loss": AlertTriangle,
  "recoverable-value": BanknoteArrowDown,
  "net-saved-value": TrendingUp,
  "risky-products": PackageSearch,
  "tasks-today": CalendarClock,
};

const toneStyles: Record<DashboardKpiPresentationTone, { badge: string; icon: string }> = {
  warning: {
    badge: "border-amber-300/60 bg-amber-100/55 text-amber-800",
    icon: "bg-amber-100/60 text-amber-800",
  },
  success: {
    badge: "border-emerald-300/60 bg-emerald-100/55 text-emerald-800",
    icon: "bg-emerald-100/60 text-emerald-800",
  },
  neutral: {
    badge: "border-border/90 bg-muted/76 text-foreground/78",
    icon: "bg-muted/82 text-foreground/80",
  },
  info: {
    badge: "border-sky-300/60 bg-sky-100/55 text-sky-800",
    icon: "bg-sky-100/60 text-sky-800",
  },
};

export default function SummaryKpiGrid({ items }: SummaryKpiGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = iconByKey[item.key];
        const styles = toneStyles[item.accentTone];

        return (
          <article
            key={item.key}
            className="demo-card animate-demo-fade-up p-5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground/80">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                  {item.displayValue}
                </p>
              </div>
              <span className={`demo-surface-panel p-2.5 ${styles.icon}`}>
                <Icon className="size-4" />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="line-clamp-2 text-sm text-muted-foreground">{item.helperText}</p>
              <span
                className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${styles.badge}`}
              >
                {item.statusBadge}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
