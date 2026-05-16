"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRightLeft,
  BadgePercent,
  Boxes,
  CalendarClock,
  ChartColumnIncreasing,
  ChevronRight,
  ScanSearch,
  Sparkles,
  Store,
} from "lucide-react";

import {
  filterRiskTableRows,
  getVisibleSelectedProductId,
  parseRiskTableFilterValue,
  updateRiskTableSearchParams,
} from "@/lib/riskTableInteraction";
import type {
  ActionPlanItem,
  BranchDashboardData,
  BranchId,
  ProductDetailData,
  RecommendationActionType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

import DailyActionPlan from "./DailyActionPlan";
import MonthlySavingsChart from "./MonthlySavingsChart";
import ProductRiskDrawer from "./ProductRiskDrawer";
import RiskTable from "./RiskTable";
import { Button } from "./ui/button";

type DashboardDemoExperienceProps = {
  branchId: BranchId;
  branchName: string;
  tasks: readonly ActionPlanItem[];
  rows: BranchDashboardData["riskTable"];
  productDetailsById: BranchDashboardData["productDetailsById"];
  monthlySavingsSeries: BranchDashboardData["monthlySavingsSeries"];
};

const actionTypeMeta: Record<
  RecommendationActionType,
  {
    icon: typeof BadgePercent;
    label: string;
    badge: string;
  }
> = {
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
};

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

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
    return `${days.toFixed(1)} day of cover`;
  }

  return `${days.toFixed(1)} days of cover`;
}

function SelectedProductPanel({
  detail,
  onOpenDrawer,
}: {
  detail: ProductDetailData | null;
  onOpenDrawer: () => void;
}) {
  if (!detail || !detail.recommendation || !detail.savings) {
    return (
      <section className="demo-card p-5 sm:p-6">
        <p className="demo-muted-label">Selected product</p>
        <h2 className="mt-3 demo-section-title">Choose a product to review</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Pick a task or watchlist row to load the selected product story and open the full proof drawer.
        </p>
      </section>
    );
  }

  const actionMeta = actionTypeMeta[detail.recommendation.actionType];
  const ActionIcon = actionMeta.icon;

  return (
    <section className="demo-card animate-demo-slide-in-right p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="demo-muted-label">Selected product</p>
          <h2 className="mt-3 demo-section-title">{detail.product.name}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Review the current risk, the first action to take today, and the value still recoverable for this branch.
          </p>
        </div>
        <div className="rounded-2xl border border-border/75 bg-background/90 px-4 py-3 text-right">
          <p className="demo-muted-label">Risk score</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {detail.risk.roundedScore}
          </p>
          <p className="mt-1 text-sm font-medium capitalize text-foreground/75">
            {detail.risk.riskLevel}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border/75 bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
          {detail.branch.branchName}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
            actionMeta.badge,
          )}
        >
          <ActionIcon className="size-3.5" />
          {actionMeta.label}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-background/88 p-4">
          <p className="demo-muted-label">Immediate risk</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground/85">
            <li className="flex items-center gap-2">
              <CalendarClock className="size-4 text-muted-foreground" />
              {formatDaysLabel(detail.daysUntilEarliestExpiry)}
            </li>
            <li className="flex items-center gap-2">
              <Boxes className="size-4 text-muted-foreground" />
              {detail.totalStock} units on hand
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-muted-foreground" />
              {formatCoverage(detail.daysOfStockRemaining)}
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/88 p-4">
          <p className="demo-muted-label">Expected impact</p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Possible waste
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatCurrency(detail.savings.possibleLossAzN)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Net saved
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatCurrency(detail.savings.netSavedValueAzN)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border/70 bg-card/90 p-4">
        <p className="demo-muted-label">Recommended action</p>
        <p className="mt-3 text-base font-semibold text-foreground">{detail.recommendation.summary}</p>
        {detail.explanation ? (
          <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/80">
            {detail.explanation.driverHighlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <Sparkles className="mt-1 size-4 shrink-0 text-muted-foreground" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
        <p className="text-sm text-muted-foreground">
          Open the full product drawer for methodology, savings detail, and recommendation proof.
        </p>
        <Button type="button" onClick={onOpenDrawer}>
          Open product detail
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export default function DashboardDemoExperience({
  branchId,
  branchName,
  tasks,
  rows,
  productDetailsById,
  monthlySavingsSeries,
}: DashboardDemoExperienceProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null);
  const query = searchParams.get("q") ?? "";
  const riskFilter = parseRiskTableFilterValue(searchParams.get("risk"));
  const requestedProductId = searchParams.get("product");
  const filteredRows = useMemo(
    () => filterRiskTableRows(rows, query, riskFilter),
    [query, riskFilter, rows],
  );
  const selectedProductId = useMemo(
    () => getVisibleSelectedProductId(filteredRows, requestedProductId),
    [filteredRows, requestedProductId],
  );
  const selectedDetail = selectedProductId ? (productDetailsById[selectedProductId] ?? null) : null;

  useEffect(() => {
    if (requestedProductId === selectedProductId) {
      return;
    }

    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams.toString()), {
      product: selectedProductId,
    });

    window.history.replaceState(null, "", buildUrl(pathname, nextParams));
  }, [pathname, requestedProductId, searchParams, selectedProductId]);

  function handleSelectProduct(productId: string) {
    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams.toString()), {
      product: productId,
    });

    window.history.pushState(null, "", buildUrl(pathname, nextParams));
  }

  function handleSearchChange(nextQuery: string) {
    const nextFilteredRows = filterRiskTableRows(rows, nextQuery, riskFilter);
    const nextSelectedProductId = getVisibleSelectedProductId(nextFilteredRows, requestedProductId);
    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams.toString()), {
      q: nextQuery,
      product: nextSelectedProductId,
    });

    window.history.replaceState(null, "", buildUrl(pathname, nextParams));
  }

  function handleRiskFilterChange(nextRiskFilter: "all" | "medium" | "high" | "critical") {
    const nextFilteredRows = filterRiskTableRows(rows, query, nextRiskFilter);
    const nextSelectedProductId = getVisibleSelectedProductId(nextFilteredRows, requestedProductId);
    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams.toString()), {
      risk: nextRiskFilter,
      product: nextSelectedProductId,
    });

    window.history.replaceState(null, "", buildUrl(pathname, nextParams));
  }

  function handleDrawerOpenChange(open: boolean) {
    setDrawerProductId(open ? selectedProductId : null);
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(24rem,0.9fr)] xl:items-start">
        <DailyActionPlan
          branchId={branchId}
          tasks={tasks}
          selectedProductId={selectedProductId}
          onSelectTask={handleSelectProduct}
        />
        <div className="min-w-0 space-y-6">
          <SelectedProductPanel
            detail={selectedDetail}
            onOpenDrawer={() => setDrawerProductId(selectedProductId)}
          />
          <MonthlySavingsChart branchName={branchName} series={monthlySavingsSeries} />
        </div>
      </div>
      <RiskTable
        rows={filteredRows}
        searchValue={query}
        riskFilter={riskFilter}
        selectedProductId={selectedProductId}
        onSearchChange={handleSearchChange}
        onRiskFilterChange={handleRiskFilterChange}
        onSelectProduct={handleSelectProduct}
      />
      <ProductRiskDrawer
        detail={selectedDetail}
        open={drawerProductId === selectedProductId && selectedDetail !== null}
        onOpenChange={handleDrawerOpenChange}
      />
    </>
  );
}
