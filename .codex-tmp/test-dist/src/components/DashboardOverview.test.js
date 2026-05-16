"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const DashboardOverview_1 = __importDefault(require("@/components/DashboardOverview"));
const branchComparison_1 = require("@/lib/branchComparison");
const dashboardData_1 = require("@/lib/dashboardData");
const dashboardKpiPresentation_1 = require("@/lib/dashboardKpiPresentation");
function buildBranchComparisons(selectedBranchId) {
    return (0, dashboardData_1.getAvailableBranchOptions)().map((branch) => (0, branchComparison_1.buildBranchComparisonSummary)((0, dashboardData_1.getDashboardData)(branch.branchId), branch.branchId === selectedBranchId));
}
(0, node_test_1.default)("DashboardOverview renders the compact overview surfaces", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DashboardOverview_1.default, { branches: (0, dashboardData_1.getAvailableBranchOptions)(), selectedBranchId: "ganjlik", generatedAt: dashboardData.generatedAt, branchName: dashboardData.branch.branchName, kpiItems: (0, dashboardKpiPresentation_1.buildDashboardKpiPresentationItems)(dashboardData).filter((item) => item.key === "risky-products" ||
            item.key === "net-saved-value" ||
            item.key === "possible-loss" ||
            item.key === "tasks-today"), actionPlan: dashboardData.actionPlan, riskTable: dashboardData.riskTable, productDetailsById: dashboardData.productDetailsById, monthlySavingsSeries: dashboardData.monthlySavingsSeries, branchComparisons: buildBranchComparisons("ganjlik"), staticMode: true }));
    strict_1.default.match(markup, /Branch overview/);
    strict_1.default.match(markup, /Monthly net saved value/);
    strict_1.default.match(markup, /Today&#x27;s AI decision/);
    strict_1.default.match(markup, /Top risk products/);
    strict_1.default.match(markup, /Branch comparison/);
    strict_1.default.match(markup, /View product/);
});
(0, node_test_1.default)("DashboardOverview keeps the shared product detail modal mounted", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DashboardOverview_1.default, { branches: (0, dashboardData_1.getAvailableBranchOptions)(), selectedBranchId: "ganjlik", generatedAt: dashboardData.generatedAt, branchName: dashboardData.branch.branchName, kpiItems: (0, dashboardKpiPresentation_1.buildDashboardKpiPresentationItems)(dashboardData).filter((item) => item.key === "risky-products" ||
            item.key === "net-saved-value" ||
            item.key === "possible-loss" ||
            item.key === "tasks-today"), actionPlan: dashboardData.actionPlan, riskTable: dashboardData.riskTable, productDetailsById: dashboardData.productDetailsById, monthlySavingsSeries: dashboardData.monthlySavingsSeries, branchComparisons: buildBranchComparisons("ganjlik"), initialRequestedProductId: dashboardData.riskTable[0]?.productId ?? null, staticMode: true }));
    strict_1.default.match(markup, /Top risk products/);
    strict_1.default.match(markup, /View product/);
});
