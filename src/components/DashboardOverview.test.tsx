import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import DashboardOverview from "@/components/DashboardOverview";
import { buildBranchComparisonSummary, type BranchComparisonSummary } from "@/lib/branchComparison";
import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";
import { buildDashboardKpiPresentationItems } from "@/lib/dashboardKpiPresentation";

function buildBranchComparisons(selectedBranchId: string): BranchComparisonSummary[] {
  return getAvailableBranchOptions().map((branch) =>
    buildBranchComparisonSummary(
      getDashboardData(branch.branchId),
      branch.branchId === selectedBranchId,
    ),
  );
}

test("DashboardOverview renders the compact overview surfaces", () => {
  const dashboardData = getDashboardData("ganjlik");
  const markup = renderToStaticMarkup(
    <DashboardOverview
      branches={getAvailableBranchOptions()}
      selectedBranchId="ganjlik"
      generatedAt={dashboardData.generatedAt}
      branchName={dashboardData.branch.branchName}
      kpiItems={buildDashboardKpiPresentationItems(dashboardData).filter(
        (item) =>
          item.key === "risky-products" ||
          item.key === "net-saved-value" ||
          item.key === "possible-loss" ||
          item.key === "tasks-today",
      )}
      actionPlan={dashboardData.actionPlan}
      riskTable={dashboardData.riskTable}
      productDetailsById={dashboardData.productDetailsById}
      monthlySavingsSeries={dashboardData.monthlySavingsSeries}
      branchComparisons={buildBranchComparisons("ganjlik")}
      staticMode
    />,
  );

  assert.match(markup, /Branch overview/);
  assert.match(markup, /Monthly net saved value/);
  assert.match(markup, /Today&#x27;s AI decision/);
  assert.match(markup, /Top risk products/);
  assert.match(markup, /Branch comparison/);
  assert.match(markup, /View product/);
});

test("DashboardOverview keeps the shared product detail modal mounted", () => {
  const dashboardData = getDashboardData("ganjlik");
  const markup = renderToStaticMarkup(
    <DashboardOverview
      branches={getAvailableBranchOptions()}
      selectedBranchId="ganjlik"
      generatedAt={dashboardData.generatedAt}
      branchName={dashboardData.branch.branchName}
      kpiItems={buildDashboardKpiPresentationItems(dashboardData).filter(
        (item) =>
          item.key === "risky-products" ||
          item.key === "net-saved-value" ||
          item.key === "possible-loss" ||
          item.key === "tasks-today",
      )}
      actionPlan={dashboardData.actionPlan}
      riskTable={dashboardData.riskTable}
      productDetailsById={dashboardData.productDetailsById}
      monthlySavingsSeries={dashboardData.monthlySavingsSeries}
      branchComparisons={buildBranchComparisons("ganjlik")}
      initialRequestedProductId={dashboardData.riskTable[0]?.productId ?? null}
      staticMode
    />,
  );

  assert.match(markup, /Top risk products/);
  assert.match(markup, /View product/);
});
