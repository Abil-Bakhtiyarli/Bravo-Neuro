"use client";

import { useEffect, useMemo } from "react";
import {
  usePathname,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";

import type { BranchComparisonSummary } from "@/lib/branchComparison";
import type { DashboardKpiPresentationItem } from "@/lib/dashboardKpiPresentation";
import { useOptionalAppRouter } from "@/lib/optionalAppRouter";
import type { Branch, BranchDashboardData, BranchId } from "@/lib/types";

import BranchComparisonCard from "./BranchComparisonCard";
import CompactDashboardHeader from "./CompactDashboardHeader";
import MonthlySavingsChart from "./MonthlySavingsChart";
import ProductRiskDrawer from "./ProductRiskDrawer";
import SummaryKpiGrid from "./SummaryKpiGrid";
import TodayDecisionCard from "./TodayDecisionCard";
import TopRiskProductsCard from "./TopRiskProductsCard";

type DashboardOverviewProps = {
  branches: Branch[];
  selectedBranchId: BranchId;
  generatedAt: string;
  branchName: string;
  kpiItems: readonly DashboardKpiPresentationItem[];
  actionPlan: BranchDashboardData["actionPlan"];
  riskTable: BranchDashboardData["riskTable"];
  productDetailsById: BranchDashboardData["productDetailsById"];
  monthlySavingsSeries: BranchDashboardData["monthlySavingsSeries"];
  branchComparisons: readonly BranchComparisonSummary[];
  initialRequestedProductId?: string | null;
  staticMode?: boolean;
};

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function updateProductSearchParam(
  current: ReadonlyURLSearchParams,
  productId: string | null,
) {
  const next = new URLSearchParams(current.toString());

  if (productId) {
    next.set("product", productId);
  } else {
    next.delete("product");
  }

  return next;
}

export default function DashboardOverview({
  branches,
  selectedBranchId,
  generatedAt,
  branchName,
  kpiItems,
  actionPlan,
  riskTable,
  productDetailsById,
  monthlySavingsSeries,
  branchComparisons,
  initialRequestedProductId = null,
  staticMode = false,
}: DashboardOverviewProps) {
  const pathname = usePathname();
  const router = useOptionalAppRouter();
  const searchParams = useSearchParams();
  const requestedProductId = searchParams?.get("product") ?? initialRequestedProductId;
  const selectedDetail = useMemo(() => {
    if (!requestedProductId) {
      return null;
    }

    return productDetailsById[requestedProductId] ?? null;
  }, [productDetailsById, requestedProductId]);

  useEffect(() => {
    if (!requestedProductId || selectedDetail) {
      return;
    }

    const nextParams = updateProductSearchParam(
      searchParams ?? new URLSearchParams(),
      null,
    );
    router?.replace(buildUrl(pathname, nextParams), { scroll: false });
  }, [pathname, requestedProductId, router, searchParams, selectedDetail]);

  function handleOpenProduct(productId: string) {
    const nextParams = updateProductSearchParam(
      searchParams ?? new URLSearchParams(),
      productId,
    );
    router?.push(buildUrl(pathname, nextParams), { scroll: false });
  }

  function handleDrawerOpenChange(open: boolean) {
    if (open) {
      return;
    }

    const nextParams = updateProductSearchParam(
      searchParams ?? new URLSearchParams(),
      null,
    );
    router?.replace(buildUrl(pathname, nextParams), { scroll: false });
  }

  return (
    <div className="flex flex-col gap-6">
      <CompactDashboardHeader
        branches={branches}
        selectedBranchId={selectedBranchId}
        generatedAt={generatedAt}
        staticMode={staticMode}
      />

      <SummaryKpiGrid items={kpiItems} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.95fr)] xl:items-start">
        <MonthlySavingsChart branchName={branchName} series={monthlySavingsSeries} />
        <TodayDecisionCard
          primaryTask={actionPlan[0] ?? null}
          fallbackRiskRow={riskTable[0] ?? null}
          detail={
            actionPlan[0]
              ? (productDetailsById[actionPlan[0].productId] ?? null)
              : riskTable[0]
                ? (productDetailsById[riskTable[0].productId] ?? null)
                : null
          }
          onOpenProduct={handleOpenProduct}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] xl:items-start">
        <TopRiskProductsCard
          rows={riskTable}
          productDetailsById={productDetailsById}
          selectedProductId={selectedDetail?.product.productId ?? null}
          onOpenProduct={handleOpenProduct}
        />
        <BranchComparisonCard comparisons={branchComparisons} />
      </div>

      <ProductRiskDrawer
        detail={selectedDetail}
        open={selectedDetail !== null}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}
