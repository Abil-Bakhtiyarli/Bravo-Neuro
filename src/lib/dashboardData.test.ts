import test from "node:test";
import assert from "node:assert/strict";

import { getBranchProductRecords } from "./dataLoader";
import {
  DashboardDataError,
  getAvailableBranchOptions,
  getDashboardData,
  getProductDetailData,
} from "./dashboardData";
import { generateRecommendationsForBranch } from "./recommendationEngine";
import { calculateWasteRiskForBranch } from "./riskScore";
import { summarizeBranchSavings } from "./savings";

function getKpiValue(
  dashboardData: ReturnType<typeof getDashboardData>,
  key: (typeof dashboardData.kpis)[number]["key"],
) {
  const kpi = dashboardData.kpis.find((item) => item.key === key);

  assert.ok(kpi, `Expected KPI ${key} to exist`);

  return kpi.value;
}

test("getAvailableBranchOptions returns seeded branches in stable order", () => {
  const branches = getAvailableBranchOptions();

  assert.deepEqual(
    branches.map((branch) => branch.branchId),
    ["ganjlik", "yasamal", "may28"],
  );
});

test("getDashboardData returns a serializable branch dashboard payload", () => {
  const dashboardData = getDashboardData("ganjlik");
  const serialized = JSON.parse(JSON.stringify(dashboardData));

  assert.deepEqual(serialized, dashboardData);
  assert.equal(dashboardData.branch.branchId, "ganjlik");
  assert.equal(dashboardData.generatedAt, "2026-05-15T00:00:00.000Z");
  assert.equal(dashboardData.riskTable.length, dashboardData.actionPlan.length);
  assert.deepEqual(dashboardData.topProductIds, dashboardData.riskTable.map((item) => item.productId));
});

test("dashboard KPI totals match the branch savings summary", () => {
  const records = calculateWasteRiskForBranch(getBranchProductRecords("ganjlik"));
  const recommendations = generateRecommendationsForBranch(records);
  const summary = summarizeBranchSavings(records, recommendations);
  const dashboardData = getDashboardData("ganjlik");

  assert.equal(getKpiValue(dashboardData, "possible-loss"), summary.totalPossibleLossAzN);
  assert.equal(getKpiValue(dashboardData, "recoverable-value"), summary.totalRecoveredValueAzN);
  assert.equal(getKpiValue(dashboardData, "net-saved-value"), summary.totalNetSavedValueAzN);
  assert.equal(getKpiValue(dashboardData, "risky-products"), recommendations.length);
  assert.equal(getKpiValue(dashboardData, "tasks-today"), recommendations.length);
  assert.equal(getKpiValue(dashboardData, "tasks-today"), dashboardData.actionPlan.length);
});

test("riskTable includes only medium, high, and critical products", () => {
  const dashboardData = getDashboardData("ganjlik");

  assert.ok(dashboardData.riskTable.length > 0);
  assert.ok(
    dashboardData.riskTable.every((item) => ["medium", "high", "critical"].includes(item.riskLevel)),
  );
});

test("riskTable stays priority-sorted by risk level, score, then expiry urgency", () => {
  const dashboardData = getDashboardData("ganjlik");
  const riskPriority = {
    critical: 3,
    high: 2,
    medium: 1,
    low: 0,
  } as const;

  for (let index = 0; index < dashboardData.riskTable.length - 1; index += 1) {
    const current = dashboardData.riskTable[index];
    const next = dashboardData.riskTable[index + 1];
    const currentPriority = riskPriority[current.riskLevel];
    const nextPriority = riskPriority[next.riskLevel];

    assert.ok(currentPriority >= nextPriority);

    if (currentPriority === nextPriority) {
      assert.ok(current.riskScore >= next.riskScore);

      if (current.riskScore === next.riskScore) {
        assert.ok(current.daysUntilExpiry <= next.daysUntilExpiry);
      }
    }
  }
});

test("action plan count stays aligned with recommendation-backed risk rows", () => {
  const dashboardData = getDashboardData("ganjlik");

  assert.equal(dashboardData.actionPlan.length, dashboardData.riskTable.length);
  assert.ok(dashboardData.actionPlan.every((item) => item.status === "pending"));
});

test("getProductDetailData aligns with the dashboard snapshot for a risky seeded product", () => {
  const dashboardData = getDashboardData("ganjlik");
  const riskRow = dashboardData.riskTable.find((item) => item.productId === "greek-yogurt-500g");

  assert.ok(riskRow);

  const detailData = getProductDetailData("ganjlik", "greek-yogurt-500g");

  assert.equal(detailData.branch.branchId, "ganjlik");
  assert.equal(detailData.product.productId, riskRow.productId);
  assert.equal(detailData.risk.roundedScore, riskRow.riskScore);
  assert.equal(detailData.recommendation?.summary, riskRow.recommendationSummary);
  assert.equal(detailData.savings?.netSavedValueAzN, riskRow.netSavedValueAzN);
  assert.ok(detailData.explanation);
});

test("unknown branch throws a DashboardDataError", () => {
  assert.throws(
    () => getDashboardData("missing-branch"),
    (error: unknown) =>
      error instanceof DashboardDataError &&
      error.code === "UNKNOWN_BRANCH" &&
      /Unknown branchId: missing-branch/.test(error.message),
  );
});

test("unknown product for a valid branch throws a DashboardDataError", () => {
  assert.throws(
    () => getProductDetailData("ganjlik", "missing-product"),
    (error: unknown) =>
      error instanceof DashboardDataError &&
      error.code === "UNKNOWN_PRODUCT" &&
      /Unknown productId for branch ganjlik: missing-product/.test(error.message),
  );
});

test("dashboard payload stays deterministic for the same branch and reference date", () => {
  const first = getDashboardData("ganjlik", { referenceDate: "2026-05-14" });
  const second = getDashboardData("ganjlik", { referenceDate: "2026-05-14" });

  assert.deepEqual(second, first);
});
