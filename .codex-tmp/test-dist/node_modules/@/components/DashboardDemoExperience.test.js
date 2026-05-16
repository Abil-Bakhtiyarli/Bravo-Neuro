"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const DashboardDemoExperience_1 = __importDefault(require("@/components/DashboardDemoExperience"));
const dashboardData_1 = require("@/lib/dashboardData");
(0, node_test_1.default)("DashboardDemoExperience renders selected product before the risk table and the chart after it", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DashboardDemoExperience_1.default, { branchId: "ganjlik", branchName: dashboardData.branch.branchName, tasks: dashboardData.actionPlan, rows: dashboardData.riskTable, productDetailsById: dashboardData.productDetailsById, monthlySavingsSeries: dashboardData.monthlySavingsSeries, staticMode: true }));
    const selectedProductIndex = markup.indexOf("Selected product");
    const riskTableIndex = markup.indexOf("Products needing attention");
    const chartIndex = markup.indexOf("Monthly savings trend");
    strict_1.default.notEqual(selectedProductIndex, -1);
    strict_1.default.notEqual(riskTableIndex, -1);
    strict_1.default.notEqual(chartIndex, -1);
    strict_1.default.ok(selectedProductIndex < riskTableIndex);
    strict_1.default.ok(riskTableIndex < chartIndex);
});
(0, node_test_1.default)("DashboardDemoExperience keeps the open-detail action visible when a product is selected", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const selectedProductId = dashboardData.riskTable[0]?.productId;
    strict_1.default.ok(selectedProductId);
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DashboardDemoExperience_1.default, { branchId: "ganjlik", branchName: dashboardData.branch.branchName, tasks: dashboardData.actionPlan, rows: dashboardData.riskTable, productDetailsById: dashboardData.productDetailsById, monthlySavingsSeries: dashboardData.monthlySavingsSeries, initialRequestedProductId: selectedProductId, staticMode: true }));
    strict_1.default.match(markup, /Open product detail/);
});
