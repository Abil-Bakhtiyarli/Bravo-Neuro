import type { ProductCategory, ProductId, RiskLevel, RiskTableItem } from "./types";

export type RiskTableFilterValue = "all" | Exclude<RiskLevel, "low">;

export const DEFAULT_RISK_TABLE_FILTER: RiskTableFilterValue = "all";

export const categoryLabels: Record<ProductCategory, string> = {
  dairy: "Dairy",
  bakery: "Bakery",
  "fruits-vegetables": "Fruit & veg",
  drinks: "Drinks",
};

export function isRiskTableFilterValue(value: string | null | undefined): value is RiskTableFilterValue {
  return value === "all" || value === "medium" || value === "high" || value === "critical";
}

export function parseRiskTableFilterValue(
  value: string | null | undefined,
): RiskTableFilterValue {
  return isRiskTableFilterValue(value) ? value : DEFAULT_RISK_TABLE_FILTER;
}

export function normalizeRiskTableQuery(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export function filterRiskTableRows(
  rows: readonly RiskTableItem[],
  query: string,
  riskFilter: RiskTableFilterValue,
) {
  const normalizedQuery = normalizeRiskTableQuery(query).toLowerCase();

  return rows.filter((row) => {
    if (riskFilter !== "all" && row.riskLevel !== riskFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const categoryLabel = categoryLabels[row.category].toLowerCase();

    return (
      row.productName.toLowerCase().includes(normalizedQuery) ||
      categoryLabel.includes(normalizedQuery)
    );
  });
}

export function getSelectedRiskTableRow(
  rows: readonly RiskTableItem[],
  selectedProductId: string | null | undefined,
) {
  if (!selectedProductId) {
    return null;
  }

  return rows.find((row) => row.productId === selectedProductId) ?? null;
}

export function getVisibleSelectedProductId(
  rows: readonly RiskTableItem[],
  selectedProductId: string | null | undefined,
): ProductId | null {
  return getSelectedRiskTableRow(rows, selectedProductId)?.productId ?? null;
}

export function updateRiskTableSearchParams(
  current: URLSearchParams,
  updates: {
    product?: string | null;
    q?: string | null;
    risk?: RiskTableFilterValue | null;
  },
) {
  const next = new URLSearchParams(current.toString());

  if ("product" in updates) {
    if (updates.product) {
      next.set("product", updates.product);
    } else {
      next.delete("product");
    }
  }

  if ("q" in updates) {
    const normalizedQuery = normalizeRiskTableQuery(updates.q);

    if (normalizedQuery) {
      next.set("q", normalizedQuery);
    } else {
      next.delete("q");
    }
  }

  if ("risk" in updates) {
    const nextRisk = updates.risk ?? DEFAULT_RISK_TABLE_FILTER;

    if (nextRisk === DEFAULT_RISK_TABLE_FILTER) {
      next.delete("risk");
    } else {
      next.set("risk", nextRisk);
    }
  }

  return next;
}
