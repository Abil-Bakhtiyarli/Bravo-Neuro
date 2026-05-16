import {
  ArrowRightLeft,
  BadgePercent,
  PackageMinus,
  ScanSearch,
  Store,
  Truck,
} from "lucide-react";

import type {
  ProductRecommendation,
  RecommendationActionType,
  RecommendationReasonCode,
} from "@/lib/types";

const actionPresentation: Record<
  RecommendationActionType,
  {
    badge: string;
    title: string;
    icon: typeof BadgePercent;
    accent: string;
  }
> = {
  discount: {
    badge: "Dynamic discount",
    title: "Launch markdown today",
    icon: BadgePercent,
    accent: "border-rose-200 bg-rose-50 text-rose-700",
  },
  transfer: {
    badge: "Stock transfer",
    title: "Move stock to faster branch",
    icon: Truck,
    accent: "border-sky-200 bg-sky-50 text-sky-700",
  },
  "reorder-adjustment": {
    badge: "Reorder adjustment",
    title: "Trim the next replenishment",
    icon: PackageMinus,
    accent: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "shelf-action": {
    badge: "Shelf action",
    title: "Improve front-of-store visibility",
    icon: Store,
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  investigation: {
    badge: "Investigation",
    title: "Validate the branch signal",
    icon: ScanSearch,
    accent: "border-violet-200 bg-violet-50 text-violet-700",
  },
};

const reasonCodeLabels: Record<RecommendationReasonCode, string> = {
  "near-expiry": "Near expiry",
  "high-risk-score": "High risk score",
  "excess-stock": "Excess stock",
  "faster-branch-demand": "Faster branch demand",
  "transfer-feasible": "Transfer is feasible",
  oversupply: "Oversupply",
  "waste-trend": "Waste trend",
  "visibility-boost": "Visibility boost",
  "data-conflict": "Data conflict",
  "unclear-primary-action": "Primary action is unclear",
};

type RecommendationCardProps = {
  recommendation: ProductRecommendation | null;
};

type MetricItem = {
  label: string;
  value: string;
};

function formatPercent(value: number) {
  return `${value}%`;
}

function formatMultiplier(value: number) {
  return `${value.toFixed(2)}x`;
}

function formatUnits(value: number) {
  const roundedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${roundedValue} units`;
}

function buildMetrics(recommendation: ProductRecommendation): MetricItem[] {
  switch (recommendation.actionType) {
    case "discount":
      return [
        {
          label: "Base markdown",
          value: formatPercent(recommendation.discountPercent),
        },
        {
          label: "Fallback markdown",
          value: formatPercent(recommendation.fallbackDiscountPercent),
        },
        {
          label: "Target by tomorrow",
          value: formatUnits(recommendation.targetUnitsByTomorrow),
        },
        {
          label: "Expected with markdown",
          value: formatUnits(recommendation.expectedUnitsByTomorrow),
        },
      ];
    case "transfer":
      return [
        {
          label: "Destination branch",
          value: recommendation.destinationBranchName,
        },
        {
          label: "Transfer quantity",
          value: formatUnits(recommendation.transferQuantity),
        },
        {
          label: "Sales speed lift",
          value: formatMultiplier(recommendation.salesSpeedMultiplier),
        },
      ];
    case "reorder-adjustment":
      return [
        {
          label: "Next order move",
          value: recommendation.adjustment === "pause" ? "Pause order" : "Reduce order",
        },
        {
          label: "Suggested multiplier",
          value: formatMultiplier(recommendation.suggestedOrderMultiplier),
        },
      ];
    case "shelf-action":
      return [
        {
          label: "Target placement",
          value: recommendation.targetPlacement,
        },
      ];
    case "investigation":
      return recommendation.checks.map((check, index) => ({
        label: `Follow-up ${index + 1}`,
        value: check,
      }));
    default:
      return [];
  }
}

function MetricTile({ label, value }: MetricItem) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/88 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{value}</p>
    </div>
  );
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  if (!recommendation) {
    return (
      <div className="rounded-3xl border border-border/75 bg-card/90 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <ArrowRightLeft className="size-4" />
          Recommended action
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          This product does not need a primary action in the current branch snapshot.
        </p>
      </div>
    );
  }

  const presentation = actionPresentation[recommendation.actionType];
  const Icon = presentation.icon;
  const metrics = buildMetrics(recommendation);

  return (
    <div className="rounded-3xl border border-border/75 bg-card/90 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <ArrowRightLeft className="size-4" />
        Recommended action
      </div>

      <div className="mt-4 rounded-3xl border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${presentation.accent}`}
            >
              {presentation.badge}
            </span>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
              {presentation.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-foreground/85">{recommendation.summary}</p>
          </div>
          <span className="rounded-2xl border border-border/70 bg-background/88 p-3 text-muted-foreground">
            <Icon className="size-5" />
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <MetricTile key={`${metric.label}:${metric.value}`} {...metric} />
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border/70 bg-background/88 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Support signals
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommendation.reasonCodes.map((reasonCode) => (
              <span
                key={reasonCode}
                className="rounded-full border border-border/70 bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground/75"
              >
                {reasonCodeLabels[reasonCode]}
              </span>
            ))}
          </div>
          {recommendation.actionType === "investigation" ? (
            <p className="mt-3 text-sm leading-6 text-foreground/80">
              These follow-ups stay explicit because the branch signal is not reliable enough to
              auto-commit to markdown, transfer, reorder, or shelf execution.
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-foreground/80">
              This card surfaces the specific move the manager should execute first, without
              re-running recommendation logic in the UI.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
