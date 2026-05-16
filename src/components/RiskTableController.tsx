"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import type { RiskTableItem } from "@/lib/types";
import {
  filterRiskTableRows,
  getVisibleSelectedProductId,
  parseRiskTableFilterValue,
  updateRiskTableSearchParams,
} from "@/lib/riskTableInteraction";

import RiskTable from "./RiskTable";

type RiskTableControllerProps = {
  rows: readonly RiskTableItem[];
};

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export default function RiskTableController({ rows }: RiskTableControllerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  return (
    <RiskTable
      rows={filteredRows}
      searchValue={query}
      riskFilter={riskFilter}
      selectedProductId={selectedProductId}
      onSearchChange={handleSearchChange}
      onRiskFilterChange={handleRiskFilterChange}
      onSelectProduct={handleSelectProduct}
    />
  );
}
