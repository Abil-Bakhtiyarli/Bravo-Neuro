"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useOptionalAppRouter } from "@/lib/optionalAppRouter";
import type { BranchDashboardData } from "@/lib/types";
import {
  filterRiskTableRows,
  getVisibleSelectedProductId,
  parseRiskTableFilterValue,
  type RiskTableFilterValue,
  updateRiskTableSearchParams,
} from "@/lib/riskTableInteraction";

import ProductRiskDrawer from "./ProductRiskDrawer";
import RiskTable from "./RiskTable";

type RiskTableExperienceProps = {
  rows: BranchDashboardData["riskTable"];
  productDetailsById: BranchDashboardData["productDetailsById"];
  initialRequestedProductId?: string | null;
  initialQuery?: string;
  initialRiskFilter?: RiskTableFilterValue;
};

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export default function RiskTableExperience({
  rows,
  productDetailsById,
  initialRequestedProductId = null,
  initialQuery = "",
  initialRiskFilter = "all",
}: RiskTableExperienceProps) {
  const pathname = usePathname();
  const router = useOptionalAppRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? initialQuery;
  const requestedRiskFilter = searchParams?.get("risk");
  const riskFilter = requestedRiskFilter
    ? parseRiskTableFilterValue(requestedRiskFilter)
    : initialRiskFilter;
  const requestedProductId = searchParams?.get("product") ?? initialRequestedProductId;
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

    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams?.toString() ?? ""), {
      product: selectedProductId,
    });

    router?.replace(buildUrl(pathname, nextParams), { scroll: false });
  }, [pathname, requestedProductId, router, searchParams, selectedProductId]);

  function handleSelectProduct(productId: string) {
    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams?.toString() ?? ""), {
      product: productId,
    });

    router?.push(buildUrl(pathname, nextParams), { scroll: false });
  }

  function handleSearchChange(nextQuery: string) {
    const nextFilteredRows = filterRiskTableRows(rows, nextQuery, riskFilter);
    const nextSelectedProductId = getVisibleSelectedProductId(nextFilteredRows, requestedProductId);
    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams?.toString() ?? ""), {
      q: nextQuery,
      product: nextSelectedProductId,
    });

    router?.replace(buildUrl(pathname, nextParams), { scroll: false });
  }

  function handleRiskFilterChange(nextRiskFilter: "all" | "medium" | "high" | "critical") {
    const nextFilteredRows = filterRiskTableRows(rows, query, nextRiskFilter);
    const nextSelectedProductId = getVisibleSelectedProductId(nextFilteredRows, requestedProductId);
    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams?.toString() ?? ""), {
      risk: nextRiskFilter,
      product: nextSelectedProductId,
    });

    router?.replace(buildUrl(pathname, nextParams), { scroll: false });
  }

  function handleDrawerOpenChange(open: boolean) {
    if (open) {
      return;
    }

    const nextParams = updateRiskTableSearchParams(new URLSearchParams(searchParams?.toString() ?? ""), {
      product: null,
    });

    router?.replace(buildUrl(pathname, nextParams), { scroll: false });
  }

  return (
    <>
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
        open={selectedDetail !== null}
        onOpenChange={handleDrawerOpenChange}
      />
    </>
  );
}
