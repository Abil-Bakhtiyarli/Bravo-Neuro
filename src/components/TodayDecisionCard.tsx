import { ArrowRightLeft, BadgePercent, ChartColumnIncreasing, ChevronRight, ScanSearch, Store } from "lucide-react";

import type { ActionPlanItem, ProductDetailData, RiskTableItem } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

type TodayDecisionCardProps = {
  primaryTask: ActionPlanItem | null;
  fallbackRiskRow: RiskTableItem | null;
  detail: ProductDetailData | null;
  onOpenProduct: (productId: string) => void;
};

const actionTypeMeta = {
  discount: {
    icon: BadgePercent,
    label: "Dynamic discount",
    badge: "border-rose-200/90 bg-rose-50/90 text-rose-700",
  },
  transfer: {
    icon: ArrowRightLeft,
    label: "Stock transfer",
    badge: "border-violet-200/90 bg-violet-50/90 text-violet-700",
  },
  "reorder-adjustment": {
    icon: ChartColumnIncreasing,
    label: "Reorder adjustment",
    badge: "border-cyan-200/90 bg-cyan-50/90 text-cyan-700",
  },
  "shelf-action": {
    icon: Store,
    label: "Shelf action",
    badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
  },
  investigation: {
    icon: ScanSearch,
    label: "Investigation",
    badge: "border-slate-300/90 bg-slate-100/90 text-slate-700",
  },
} as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TodayDecisionCard({
  primaryTask,
  fallbackRiskRow,
  detail,
  onOpenProduct,
}: TodayDecisionCardProps) {
  const productId = primaryTask?.productId ?? fallbackRiskRow?.productId ?? null;

  if (!productId) {
    return (
      <section className="rounded-[2rem] border border-border/80 bg-card/92 p-5 shadow-[0_18px_54px_-42px_rgba(15,23,42,0.52)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Today&apos;s AI decision
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          No action needed
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This branch currently has no medium, high, or critical products requiring intervention.
        </p>
      </section>
    );
  }

  const actionType = primaryTask?.actionType ?? fallbackRiskRow?.actionType ?? null;
  const actionMeta = actionType ? actionTypeMeta[actionType] : null;
  const ActionIcon = actionMeta?.icon ?? Store;
  const productName = primaryTask?.productName ?? fallbackRiskRow?.productName ?? detail?.product.name ?? "Selected product";
  const summary = primaryTask?.summary ?? fallbackRiskRow?.recommendationSummary ?? detail?.recommendation?.summary ?? "Review product detail";
  const riskLevel = primaryTask?.riskLevel ?? fallbackRiskRow?.riskLevel ?? detail?.risk.riskLevel ?? "medium";
  const netSavedValue =
    detail?.savings?.netSavedValueAzN ??
    primaryTask?.expectedNetSavedValueAzN ??
    fallbackRiskRow?.netSavedValueAzN ??
    0;

  return (
    <section className="animate-demo-fade-up animate-demo-delay-1 rounded-3xl border border-emerald-300/70 bg-[linear-gradient(180deg,rgba(227,246,237,0.92),rgba(241,247,244,0.96))] p-5 shadow-[0_18px_36px_-28px_rgba(5,150,105,0.22)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Today&apos;s AI decision
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{productName}</h2>
          <p className="mt-3 max-w-2xl text-sm text-foreground/80">{summary}</p>
        </div>

        {actionMeta ? (
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
              actionMeta.badge,
            )}
          >
            <ActionIcon className="size-4" />
            {actionMeta.label}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="demo-surface-panel p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Risk level
          </p>
          <p className="mt-2 text-lg font-semibold capitalize text-foreground">{riskLevel}</p>
        </div>
        <div className="demo-surface-panel p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Expected net saved
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">{formatCurrency(netSavedValue)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-300/65 pt-5">
        <p className="text-sm text-foreground/70">Open the full proof and confirm the next move.</p>
        <Button type="button" onClick={() => onOpenProduct(productId)}>
          View product
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
