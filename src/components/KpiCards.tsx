import type { LucideIcon } from "lucide-react";

export type KpiCardTone = "warning" | "success" | "neutral" | "info";

export type KpiCardItem = {
  key: string;
  label: string;
  displayValue: string;
  helperText: string;
  statusBadge: string;
  icon: LucideIcon;
  accentTone?: KpiCardTone;
};

export type KpiCardsProps = {
  items: readonly KpiCardItem[];
};

const toneStyles: Record<KpiCardTone, { badge: string; icon: string; ring: string }> = {
  warning: {
    badge:
      "border-amber-200/90 bg-amber-50/90 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    icon: "bg-amber-50/80 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
    ring: "from-amber-200/70 via-amber-100/30 to-transparent",
  },
  success: {
    badge:
      "border-emerald-200/90 bg-emerald-50/90 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    icon: "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
    ring: "from-emerald-200/70 via-emerald-100/30 to-transparent",
  },
  neutral: {
    badge:
      "border-border/80 bg-muted/80 text-foreground/75 dark:bg-muted/60 dark:text-foreground/80",
    icon: "bg-background/85 text-foreground/80 dark:bg-muted/60 dark:text-foreground/80",
    ring: "from-slate-200/65 via-slate-100/25 to-transparent",
  },
  info: {
    badge:
      "border-sky-200/90 bg-sky-50/90 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
    icon: "bg-sky-50/80 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200",
    ring: "from-sky-200/70 via-sky-100/30 to-transparent",
  },
};

export default function KpiCards({ items }: KpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const tone = item.accentTone ?? "neutral";
        const styles = toneStyles[tone];

        return (
          <article
            key={item.key}
            className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)]"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${styles.ring}`}
              aria-hidden="true"
            />

            <div className="relative flex min-h-[12.5rem] flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    KPI signal
                  </p>
                  <h2 className="mt-2 text-sm font-medium text-foreground/85">
                    {item.label}
                  </h2>
                </div>
                <div
                  className={`rounded-2xl border border-border/80 p-2.5 shadow-sm ${styles.icon}`}
                >
                  <Icon className="size-4" />
                </div>
              </div>

              <div className="mt-6 flex items-start justify-between gap-4">
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {item.displayValue}
                </p>
                <span
                  className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles.badge}`}
                >
                  {item.statusBadge}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {item.helperText}
              </p>

              <div className="mt-auto pt-5">
                <div className="h-px bg-border/70" />
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Mock KPI card for Part 10
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
