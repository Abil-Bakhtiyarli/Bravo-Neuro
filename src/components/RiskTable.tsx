import { Search, SlidersHorizontal } from "lucide-react";

import { categoryLabels, type RiskTableFilterValue } from "@/lib/riskTableInteraction";
import type { RecommendationActionType, RiskLevel, RiskTableItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export type RiskTableProps = {
  rows: readonly RiskTableItem[];
  searchValue: string;
  riskFilter: RiskTableFilterValue;
  selectedProductId: string | null;
  onSearchChange: (value: string) => void;
  onRiskFilterChange: (value: RiskTableFilterValue) => void;
  onSelectProduct: (productId: string) => void;
};

const riskLevelStyles: Record<
  RiskLevel,
  {
    badge: string;
    rail: string;
    label: string;
  }
> = {
  critical: {
    badge: "border-rose-200/90 bg-rose-50/95 text-rose-700",
    rail: "bg-rose-500",
    label: "Critical",
  },
  high: {
    badge: "border-amber-200/90 bg-amber-50/95 text-amber-700",
    rail: "bg-amber-500",
    label: "High",
  },
  medium: {
    badge: "border-sky-200/90 bg-sky-50/95 text-sky-700",
    rail: "bg-sky-500",
    label: "Medium",
  },
  low: {
    badge: "border-emerald-200/90 bg-emerald-50/95 text-emerald-700",
    rail: "bg-emerald-500",
    label: "Low",
  },
};

const actionStyles: Record<
  RecommendationActionType,
  {
    badge: string;
    label: string;
  }
> = {
  discount: {
    badge: "border-rose-200/90 bg-rose-50/90 text-rose-700",
    label: "Dynamic discount",
  },
  transfer: {
    badge: "border-violet-200/90 bg-violet-50/90 text-violet-700",
    label: "Stock transfer",
  },
  "reorder-adjustment": {
    badge: "border-cyan-200/90 bg-cyan-50/90 text-cyan-700",
    label: "Reorder adjustment",
  },
  "shelf-action": {
    badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
    label: "Shelf action",
  },
  investigation: {
    badge: "border-slate-300/90 bg-slate-100/90 text-slate-700",
    label: "Investigation",
  },
};

function formatExpiry(daysUntilExpiry: number) {
  if (daysUntilExpiry <= 0) {
    return "Expires today";
  }

  if (daysUntilExpiry === 1) {
    return "1 day left";
  }

  return `${daysUntilExpiry} days left`;
}

function formatStock(totalStock: number) {
  return `${totalStock} units`;
}

function formatCoverage(daysOfStockRemaining: number | null) {
  if (daysOfStockRemaining === null) {
    return "Coverage unavailable";
  }

  if (daysOfStockRemaining <= 1) {
    return `${daysOfStockRemaining.toFixed(1)} day of cover`;
  }

  return `${daysOfStockRemaining.toFixed(1)} days of cover`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getExpiryTone(daysUntilExpiry: number) {
  if (daysUntilExpiry <= 1) {
    return "text-rose-700";
  }

  if (daysUntilExpiry <= 3) {
    return "text-amber-700";
  }

  return "text-foreground/80";
}

export default function RiskTable({
  rows,
  searchValue,
  riskFilter,
  selectedProductId,
  onSearchChange,
  onRiskFilterChange,
  onSelectProduct,
}: RiskTableProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card/92 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.55)]">
      <div className="flex flex-col gap-5 border-b border-border/80 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="rounded-full border border-border/80 bg-accent/75 px-2.5 py-1">
                Risk watchlist
              </span>
              <span className="rounded-full border border-dashed border-border/80 px-2.5 py-1">
                Branch risk queue
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Product risk table
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Products needing attention
              </h2>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Review the selected branch&apos;s products in priority order, then open the detail
              to confirm the risk story and action economics.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[34rem]">
            <div className="rounded-2xl border border-border/75 bg-background/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Search
              </p>
              <label className="mt-2 flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm text-muted-foreground focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/10">
                <Search className="size-4" />
                <input
                  aria-label="Search product or category"
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Search product or category"
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </label>
            </div>
            <div className="rounded-2xl border border-border/75 bg-background/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Rows in view
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm text-foreground/80">
                <span>{rows.length} products</span>
                <SlidersHorizontal className="size-4 text-muted-foreground" />
              </div>
            </div>
            <div className="rounded-2xl border border-border/75 bg-background/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Risk level
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm text-foreground/80">
                <select
                  aria-label="Filter by risk level"
                  className="w-full bg-transparent outline-none"
                  value={riskFilter}
                  onChange={(event) => onRiskFilterChange(event.target.value as RiskTableFilterValue)}
                >
                  <option value="all">All active risk rows</option>
                  <option value="critical">Critical only</option>
                  <option value="high">High only</option>
                  <option value="medium">Medium only</option>
                </select>
                <SlidersHorizontal className="size-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-3 pb-3 sm:px-4 sm:pb-4">
        <table className="min-w-[64rem] border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <th className="px-3 pt-3 pb-1">Product</th>
              <th className="px-3 pt-3 pb-1">Category</th>
              <th className="px-3 pt-3 pb-1">Stock</th>
              <th className="px-3 pt-3 pb-1">Expiry</th>
              <th className="px-3 pt-3 pb-1">Risk</th>
              <th className="px-3 pt-3 pb-1">Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const risk = riskLevelStyles[row.riskLevel];
              const action = actionStyles[row.actionType];
              const isSelected = row.productId === selectedProductId;

              return (
                <tr
                  key={`${row.branchId}:${row.productId}`}
                  tabIndex={0}
                  aria-selected={isSelected}
                  data-selected={isSelected ? "true" : "false"}
                  className={cn(
                    "group cursor-pointer outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
                    isSelected && "translate-y-[-1px]",
                  )}
                  onClick={() => onSelectProduct(row.productId)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectProduct(row.productId);
                    }
                  }}
                >
                  <td
                    className={cn(
                      "relative overflow-hidden rounded-l-2xl border-y border-l px-3 py-4 align-middle shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200",
                      isSelected
                        ? "border-foreground/30 bg-accent/80"
                        : "border-border/75 bg-background/85 group-hover:bg-background",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-3 left-0 w-1 rounded-full",
                        risk.rail,
                      )}
                      aria-hidden="true"
                    />
                    <div className="min-w-[14rem] pl-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">{row.productName}</p>
                        {isSelected ? (
                          <span className="rounded-full border border-foreground/20 bg-background/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
                            Selected for detail
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Score {row.riskScore} | possible waste {formatCurrency(row.possibleLossAzN)}
                      </p>
                    </div>
                  </td>
                  <td
                    className={cn(
                      "border-y px-3 py-4 text-sm text-foreground/80 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200",
                      isSelected
                        ? "border-foreground/30 bg-accent/80"
                        : "border-border/75 bg-background/85 group-hover:bg-background",
                    )}
                  >
                    {categoryLabels[row.category]}
                  </td>
                  <td
                    className={cn(
                      "border-y px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200",
                      isSelected
                        ? "border-foreground/30 bg-accent/80"
                        : "border-border/75 bg-background/85 group-hover:bg-background",
                    )}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {formatStock(row.totalStock)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCoverage(row.daysOfStockRemaining)}
                      </p>
                    </div>
                  </td>
                  <td
                    className={cn(
                      "border-y px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200",
                      isSelected
                        ? "border-foreground/30 bg-accent/80"
                        : "border-border/75 bg-background/85 group-hover:bg-background",
                    )}
                  >
                    <div className="space-y-1">
                      <p className={cn("text-sm font-medium", getExpiryTone(row.daysUntilExpiry))}>
                        {formatExpiry(row.daysUntilExpiry)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Intervention window before the next expiry check
                      </p>
                    </div>
                  </td>
                  <td
                    className={cn(
                      "border-y px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200",
                      isSelected
                        ? "border-foreground/30 bg-accent/80"
                        : "border-border/75 bg-background/85 group-hover:bg-background",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                        risk.badge,
                      )}
                    >
                      {risk.label}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "rounded-r-2xl border-y border-r px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200",
                      isSelected
                        ? "border-foreground/30 bg-accent/80"
                        : "border-border/75 bg-background/85 group-hover:bg-background",
                    )}
                  >
                    <div className="flex min-w-[16rem] flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                            action.badge,
                          )}
                        >
                          {action.label}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Estimated outcome
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-foreground/80">
                        {row.recommendationSummary}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Estimated net saved {formatCurrency(row.netSavedValueAzN)}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No products match the current search and risk filter. Clear the search text or widen the risk level to rebuild the queue.
          </div>
        ) : null}
      </div>
    </div>
  );
}
