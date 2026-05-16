import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import DashboardDemoExperience from "@/components/DashboardDemoExperience";
import { getDashboardData } from "@/lib/dashboardData";

test("DashboardDemoExperience renders selected product before the risk table and the chart after it", () => {
  const dashboardData = getDashboardData("ganjlik");
  const markup = renderToStaticMarkup(
    <DashboardDemoExperience
      branchId="ganjlik"
      branchName={dashboardData.branch.branchName}
      tasks={dashboardData.actionPlan}
      rows={dashboardData.riskTable}
      productDetailsById={dashboardData.productDetailsById}
      monthlySavingsSeries={dashboardData.monthlySavingsSeries}
    />,
  );

  const selectedProductIndex = markup.indexOf("Selected product");
  const riskTableIndex = markup.indexOf("Products needing attention");
  const chartIndex = markup.indexOf("Monthly savings trend");

  assert.notEqual(selectedProductIndex, -1);
  assert.notEqual(riskTableIndex, -1);
  assert.notEqual(chartIndex, -1);
  assert.ok(selectedProductIndex < riskTableIndex);
  assert.ok(riskTableIndex < chartIndex);
});

test("DashboardDemoExperience keeps the open-detail action visible when a product is selected", () => {
  const dashboardData = getDashboardData("ganjlik");
  const selectedProductId = dashboardData.riskTable[0]?.productId;

  assert.ok(selectedProductId);

  const markup = renderToStaticMarkup(
    <DashboardDemoExperience
      branchId="ganjlik"
      branchName={dashboardData.branch.branchName}
      tasks={dashboardData.actionPlan}
      rows={dashboardData.riskTable}
      productDetailsById={dashboardData.productDetailsById}
      monthlySavingsSeries={dashboardData.monthlySavingsSeries}
    />,
  );

  assert.match(markup, /Open product detail/);
});
