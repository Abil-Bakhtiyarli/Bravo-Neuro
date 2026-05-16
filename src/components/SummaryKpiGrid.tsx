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
    badge: "border-amber-200/90 bg-amber-50/90 text-amber-700",
    icon: "bg-amber-50/80 text-amber-700",
  },
  success: {
    badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
    icon: "bg-emerald-50/80 text-emerald-700",
  },
  neutral: {
    badge: "border-border/80 bg-background/88 text-foreground/75",
    icon: "bg-background/88 text-foreground/80",
  },
  info: {
    badge: "border-sky-200/90 bg-sky-50/90 text-sky-700",
    icon: "bg-sky-50/80 text-sky-700",
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
            className="animate-demo-fade-up rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground/80">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                  {item.displayValue}
                </p>
              </div>
              <span className={`rounded-2xl border border-border/70 p-2.5 ${styles.icon}`}>
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
