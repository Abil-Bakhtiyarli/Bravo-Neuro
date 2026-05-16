import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";

import { buildSavingsComparisonViewModel } from "@/lib/savingsComparison";
import type { ProductRecommendation, RecommendationSavings } from "@/lib/types";

type SavingsCardProps = {
  recommendation: ProductRecommendation | null;
  savings: RecommendationSavings | null;
  unitPriceAzN: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatUnits(value: number) {
  const roundedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${roundedValue} units`;
}

function ComparisonPanel({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof TrendingDown;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/88 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <span className="rounded-2xl border border-border/70 bg-card/90 p-2.5 text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground/78">{helper}</p>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/88 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{value}</p>
    </div>
  );
}

export default function SavingsCard({ recommendation, savings, unitPriceAzN }: SavingsCardProps) {
  if (!recommendation || !savings) {
    return (
      <div className="rounded-3xl border border-border/75 bg-card/90 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <CircleDollarSign className="size-4" />
          Savings comparison
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          A dedicated before-and-after savings comparison is not available for this product yet.
        </p>
      </div>
    );
  }

  const comparison = buildSavingsComparisonViewModel(recommendation, savings);
  const averageValuePerRecoveredUnit =
    comparison.estimatedRecoveredUnits > 0
      ? comparison.grossRecoveredValueAzN / comparison.estimatedRecoveredUnits
      : unitPriceAzN;

  return (
    <div className="rounded-3xl border border-border/75 bg-card/90 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <CircleDollarSign className="size-4" />
        Savings comparison
      </div>

      <div className="mt-4 rounded-3xl border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <ComparisonPanel
            icon={TrendingDown}
            label="Without action"
            value={formatCurrency(comparison.beforeActionLossAzN)}
            helper={`${formatUnits(comparison.unitsAtRisk)} remain exposed to waste if the branch does nothing.`}
          />
          <ComparisonPanel
            icon={TrendingUp}
            label="With action"
            value={formatCurrency(comparison.netSavedValueAzN)}
            helper={`${formatCurrency(comparison.afterActionResidualLossAzN)} stays exposed after the recommended move.`}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <MetricTile
            label="Recovered value"
            value={formatCurrency(comparison.grossRecoveredValueAzN)}
          />
          <MetricTile label="Action cost" value={formatCurrency(comparison.totalActionCostAzN)} />
          <MetricTile
            label="Waste avoided"
            value={formatUnits(comparison.estimatedWasteUnitsAvoided)}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-border/70 bg-background/88 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Method
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">{comparison.methodology}</p>
          <p className="mt-3 text-sm leading-6 text-foreground/80">
            Recovered units are valued at{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(averageValuePerRecoveredUnit)}
            </span>{" "}
            per unit for this action scenario.
          </p>
        </div>
      </div>
    </div>
  );
}
