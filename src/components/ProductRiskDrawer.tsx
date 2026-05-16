"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  AlertTriangle,
  ArrowRightLeft,
  BadgePercent,
  Boxes,
  CalendarClock,
  CircleDollarSign,
  Package,
  Sparkles,
  TrendingUp,
  Warehouse,
  X,
} from "lucide-react";

import { categoryLabels } from "@/lib/riskTableInteraction";
import type {
  ProductDetailData,
  RiskComponentScore,
  RiskLevel,
} from "@/lib/types";
import { cn } from "@/lib/utils";

import RecommendationCard from "./RecommendationCard";
import { Button } from "./ui/button";

type ProductRiskDrawerProps = {
  detail: ProductDetailData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const riskLevelStyles: Record<
  RiskLevel,
  {
    badge: string;
    accent: string;
    panel: string;
    label: string;
  }
> = {
  critical: {
    badge: "border-rose-300/80 bg-rose-100 text-rose-800",
    accent: "bg-rose-500",
    panel: "from-rose-100/95 via-white to-rose-50/80",
    label: "Critical",
  },
  high: {
    badge: "border-amber-300/80 bg-amber-100 text-amber-800",
    accent: "bg-amber-500",
    panel: "from-amber-100/95 via-white to-amber-50/80",
    label: "High",
  },
  medium: {
    badge: "border-sky-300/80 bg-sky-100 text-sky-800",
    accent: "bg-sky-500",
    panel: "from-sky-100/95 via-white to-sky-50/80",
    label: "Medium",
  },
  low: {
    badge: "border-emerald-300/80 bg-emerald-100 text-emerald-800",
    accent: "bg-emerald-500",
    panel: "from-emerald-100/95 via-white to-emerald-50/80",
    label: "Low",
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDaysLabel(days: number) {
  if (days <= 0) {
    return "Expires today";
  }

  if (days === 1) {
    return "1 day left";
  }

  return `${days} days left`;
}

function formatCoverage(days: number | null) {
  if (days === null) {
    return "Coverage unavailable";
  }

  if (days <= 1) {
    return `${days.toFixed(1)} day`;
  }

  return `${days.toFixed(1)} days`;
}

function formatDriverContribution(driver: RiskComponentScore) {
  return `+${driver.weightedContribution.toFixed(1)} weighted points`;
}

function SnapshotCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/88 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
        </div>
        <span className="rounded-full border border-border/70 bg-card/90 p-2 text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{helper}</p>
    </div>
  );
}

function SavingsMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/88 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function ProductRiskDrawer({
  detail,
  open,
  onOpenChange,
}: ProductRiskDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-full justify-end outline-none sm:max-w-[46rem]">
          {detail ? (
            <div className="flex h-full w-full max-w-[46rem] flex-col border-l border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[-36px_0_70px_-42px_rgba(15,23,42,0.7)]">
              <div
                className={cn(
                  "border-b border-border/80 bg-gradient-to-br px-5 py-5 sm:px-6",
                  riskLevelStyles[detail.risk.riskLevel].panel,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <span className="rounded-full border border-border/80 bg-background/85 px-2.5 py-1">
                        Product detail drawer
                      </span>
                      <span className="rounded-full border border-border/80 bg-background/85 px-2.5 py-1">
                        {detail.branch.branchName}
                      </span>
                      <span className="rounded-full border border-border/80 bg-background/85 px-2.5 py-1">
                        {categoryLabels[detail.product.category]}
                      </span>
                    </div>
                    <Dialog.Title className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                      {detail.product.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-3 max-w-2xl text-sm leading-6 text-foreground/78">
                      Zoom into one risk story: why this item is exposed, which action is recommended,
                      and how much value the branch can still recover.
                    </Dialog.Description>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="rounded-2xl border border-border/75 bg-background/88 px-4 py-3 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Risk score
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {detail.risk.roundedScore}
                      </p>
                      <span
                        className={cn(
                          "mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                          riskLevelStyles[detail.risk.riskLevel].badge,
                        )}
                      >
                        {riskLevelStyles[detail.risk.riskLevel].label}
                      </span>
                    </div>
                    <Dialog.Close
                      render={
                        <Button
                          aria-label="Close product detail drawer"
                          size="icon-sm"
                          variant="outline"
                        >
                          <X className="size-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                <section>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        riskLevelStyles[detail.risk.riskLevel].accent,
                      )}
                    />
                    Operational snapshot
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <SnapshotCard
                      icon={Package}
                      label="Total stock"
                      value={`${detail.totalStock} units`}
                      helper={`Current on-hand stock across ${detail.lotCount} lot${detail.lotCount === 1 ? "" : "s"}.`}
                    />
                    <SnapshotCard
                      icon={CalendarClock}
                      label="Earliest expiry"
                      value={formatDaysLabel(detail.daysUntilEarliestExpiry)}
                      helper={detail.earliestExpiryDate}
                    />
                    <SnapshotCard
                      icon={Boxes}
                      label="Stock cover"
                      value={formatCoverage(detail.daysOfStockRemaining)}
                      helper="Expected branch coverage at current daily sales."
                    />
                    <SnapshotCard
                      icon={Warehouse}
                      label="Stock value"
                      value={formatCurrency(detail.stockValueAzN)}
                      helper="Retail value currently exposed on shelf and in backroom."
                    />
                    <SnapshotCard
                      icon={AlertTriangle}
                      label="Main driver count"
                      value={`${detail.risk.mainDrivers.length}`}
                      helper="Non-zero drivers feeding the current risk score."
                    />
                    <SnapshotCard
                      icon={Sparkles}
                      label="Latest expiry"
                      value={detail.latestExpiryDate}
                      helper="Longest-dated lot still in the current branch inventory."
                    />
                  </div>
                </section>

                <section className="mt-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <BadgePercent className="size-4" />
                    Top drivers
                  </div>
                  <div className="mt-4 space-y-3">
                    {detail.risk.mainDrivers.map((driver) => (
                      <div
                        key={driver.key}
                        className="rounded-2xl border border-border/70 bg-background/88 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{driver.label}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Weight {(driver.weight * 100).toFixed(0)}% | raw score {driver.rawScore}
                            </p>
                          </div>
                          <span className="rounded-full border border-border/75 bg-card/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75">
                            {formatDriverContribution(driver)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {detail.explanation ? (
                  <section className="mt-6">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <ArrowRightLeft className="size-4" />
                      Explanation
                    </div>
                    <div className="mt-4 rounded-3xl border border-border/75 bg-card/90 p-5">
                      <p className="text-sm leading-6 text-foreground/85">{detail.explanation.summary}</p>
                      <div className="mt-4 space-y-2">
                        {detail.explanation.driverHighlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="rounded-2xl border border-border/70 bg-background/88 px-3.5 py-3 text-sm leading-6 text-foreground/80"
                          >
                            {highlight}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-2xl border border-border/70 bg-background/88 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Recommendation rationale
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground/80">
                          {detail.explanation.recommendationRationale}
                        </p>
                      </div>
                    </div>
                  </section>
                ) : null}

                <section className="mt-6 grid gap-4 lg:grid-cols-2">
                  <RecommendationCard recommendation={detail.recommendation} />

                  <div className="rounded-3xl border border-border/75 bg-card/90 p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <TrendingUp className="size-4" />
                      Savings summary
                    </div>
                    {detail.savings ? (
                      <div className="mt-4 grid gap-3">
                        <SavingsMetric
                          label="Possible waste"
                          value={formatCurrency(detail.savings.possibleLossAzN)}
                        />
                        <SavingsMetric
                          label="Recovered value"
                          value={formatCurrency(detail.savings.recoveredValueAzN)}
                        />
                        <SavingsMetric
                          label="Net saved value"
                          value={formatCurrency(detail.savings.netSavedValueAzN)}
                        />
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">
                        Savings estimates are not available for this product yet.
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/70 bg-background/88 px-3.5 py-3 text-xs font-medium text-muted-foreground">
                      <CircleDollarSign className="size-4" />
                      Part 17 will promote this block into the dedicated savings comparison card.
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
