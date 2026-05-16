import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import type { RiskTableItem } from "@/lib/types";

import RiskTable from "./RiskTable";

const rows: RiskTableItem[] = [
  {
    branchId: "ganjlik",
    productId: "greek-yogurt-500g",
    productName: "Greek Yogurt 500g",
    category: "dairy",
    riskLevel: "critical",
    riskScore: 92,
    daysUntilExpiry: 1,
    totalStock: 18,
    daysOfStockRemaining: 3.2,
    actionType: "discount",
    recommendationSummary: "Discount today to move near-expiry stock.",
    netSavedValueAzN: 12,
    possibleLossAzN: 18,
  },
];

test("RiskTable renders selected rows with accessible interactive state", () => {
  const markup = renderToStaticMarkup(
    <RiskTable
      rows={rows}
      searchValue=""
      riskFilter="all"
      selectedProductId="greek-yogurt-500g"
      onSearchChange={() => undefined}
      onRiskFilterChange={() => undefined}
      onSelectProduct={() => undefined}
    />,
  );

  assert.match(markup, /aria-selected="true"/);
  assert.match(markup, /tabindex="0"/);
  assert.match(markup, /Selected for detail/);
});

test("RiskTable keeps visible badge labels and action framing", () => {
  const markup = renderToStaticMarkup(
    <RiskTable
      rows={rows}
      searchValue="yogurt"
      riskFilter="critical"
      selectedProductId={null}
      onSearchChange={() => undefined}
      onRiskFilterChange={() => undefined}
      onSelectProduct={() => undefined}
    />,
  );

  assert.match(markup, /Critical/);
  assert.match(markup, /Dynamic discount/);
  assert.match(markup, /Search product or category/);
  assert.match(markup, /Rows in view/);
});
