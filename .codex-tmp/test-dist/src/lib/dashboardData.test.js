"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const dataLoader_1 = require("./dataLoader");
const dashboardData_1 = require("./dashboardData");
const recommendationEngine_1 = require("./recommendationEngine");
const riskScore_1 = require("./riskScore");
const savings_1 = require("./savings");
function getKpiValue(dashboardData, key) {
    const kpi = dashboardData.kpis.find((item) => item.key === key);
    strict_1.default.ok(kpi, `Expected KPI ${key} to exist`);
    return kpi.value;
}
(0, node_test_1.default)("getAvailableBranchOptions returns seeded branches in stable order", () => {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    strict_1.default.deepEqual(branches.map((branch) => branch.branchId), ["ganjlik", "yasamal", "may28"]);
});
(0, node_test_1.default)("getDashboardData returns a serializable branch dashboard payload", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const serialized = JSON.parse(JSON.stringify(dashboardData));
    strict_1.default.deepEqual(serialized, dashboardData);
    strict_1.default.equal(dashboardData.branch.branchId, "ganjlik");
    strict_1.default.equal(dashboardData.generatedAt, "2026-05-15T00:00:00.000Z");
    strict_1.default.equal(dashboardData.riskTable.length, dashboardData.actionPlan.length);
    strict_1.default.deepEqual(dashboardData.topProductIds, dashboardData.riskTable.map((item) => item.productId));
});
(0, node_test_1.default)("dashboard KPI totals match the branch savings summary", () => {
    const records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("ganjlik"));
    const recommendations = (0, recommendationEngine_1.generateRecommendationsForBranch)(records);
    const summary = (0, savings_1.summarizeBranchSavings)(records, recommendations);
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    strict_1.default.equal(getKpiValue(dashboardData, "possible-loss"), summary.totalPossibleLossAzN);
    strict_1.default.equal(getKpiValue(dashboardData, "recoverable-value"), summary.totalRecoveredValueAzN);
    strict_1.default.equal(getKpiValue(dashboardData, "net-saved-value"), summary.totalNetSavedValueAzN);
    strict_1.default.equal(getKpiValue(dashboardData, "risky-products"), recommendations.length);
    strict_1.default.equal(getKpiValue(dashboardData, "tasks-today"), recommendations.length);
    strict_1.default.equal(getKpiValue(dashboardData, "tasks-today"), dashboardData.actionPlan.length);
});
(0, node_test_1.default)("riskTable includes only medium, high, and critical products", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    strict_1.default.ok(dashboardData.riskTable.length > 0);
    strict_1.default.ok(dashboardData.riskTable.every((item) => ["medium", "high", "critical"].includes(item.riskLevel)));
});
(0, node_test_1.default)("action plan count stays aligned with recommendation-backed risk rows", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    strict_1.default.equal(dashboardData.actionPlan.length, dashboardData.riskTable.length);
    strict_1.default.ok(dashboardData.actionPlan.every((item) => item.status === "pending"));
});
(0, node_test_1.default)("getProductDetailData aligns with the dashboard snapshot for a risky seeded product", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const riskRow = dashboardData.riskTable.find((item) => item.productId === "greek-yogurt-500g");
    strict_1.default.ok(riskRow);
    const detailData = (0, dashboardData_1.getProductDetailData)("ganjlik", "greek-yogurt-500g");
    strict_1.default.equal(detailData.branch.branchId, "ganjlik");
    strict_1.default.equal(detailData.product.productId, riskRow.productId);
    strict_1.default.equal(detailData.risk.roundedScore, riskRow.riskScore);
    strict_1.default.equal(detailData.recommendation?.summary, riskRow.recommendationSummary);
    strict_1.default.equal(detailData.savings?.netSavedValueAzN, riskRow.netSavedValueAzN);
    strict_1.default.ok(detailData.explanation);
});
(0, node_test_1.default)("unknown branch throws a DashboardDataError", () => {
    strict_1.default.throws(() => (0, dashboardData_1.getDashboardData)("missing-branch"), (error) => error instanceof dashboardData_1.DashboardDataError &&
        error.code === "UNKNOWN_BRANCH" &&
        /Unknown branchId: missing-branch/.test(error.message));
});
(0, node_test_1.default)("unknown product for a valid branch throws a DashboardDataError", () => {
    strict_1.default.throws(() => (0, dashboardData_1.getProductDetailData)("ganjlik", "missing-product"), (error) => error instanceof dashboardData_1.DashboardDataError &&
        error.code === "UNKNOWN_PRODUCT" &&
        /Unknown productId for branch ganjlik: missing-product/.test(error.message));
});
(0, node_test_1.default)("dashboard payload stays deterministic for the same branch and reference date", () => {
    const first = (0, dashboardData_1.getDashboardData)("ganjlik", { referenceDate: "2026-05-14" });
    const second = (0, dashboardData_1.getDashboardData)("ganjlik", { referenceDate: "2026-05-14" });
    strict_1.default.deepEqual(second, first);
});
