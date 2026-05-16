"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppShell_1 = __importDefault(require("@/components/AppShell"));
const DashboardOverview_1 = __importDefault(require("@/components/DashboardOverview"));
const branchComparison_1 = require("@/lib/branchComparison");
const branchSelection_1 = require("@/lib/branchSelection");
const dashboardData_1 = require("@/lib/dashboardData");
const dashboardKpiPresentation_1 = require("@/lib/dashboardKpiPresentation");
async function Home({ searchParams }) {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    const selectedBranchId = (0, branchSelection_1.resolveSelectedBranchId)((await searchParams).branch, branches.map((branch) => branch.branchId));
    const dashboardData = (0, dashboardData_1.getDashboardData)(selectedBranchId);
    const kpiItems = (0, dashboardKpiPresentation_1.buildDashboardKpiPresentationItems)(dashboardData)
        .filter((item) => item.key === "risky-products" ||
        item.key === "net-saved-value" ||
        item.key === "possible-loss" ||
        item.key === "tasks-today");
    const branchComparisons = branches.map((branch) => (0, branchComparison_1.buildBranchComparisonSummary)((0, dashboardData_1.getDashboardData)(branch.branchId), branch.branchId === selectedBranchId));
    return ((0, jsx_runtime_1.jsx)(AppShell_1.default, { children: (0, jsx_runtime_1.jsx)(DashboardOverview_1.default, { branches: branches, selectedBranchId: selectedBranchId, generatedAt: dashboardData.generatedAt, branchName: dashboardData.branch.branchName, kpiItems: kpiItems, actionPlan: dashboardData.actionPlan, riskTable: dashboardData.riskTable, productDetailsById: dashboardData.productDetailsById, monthlySavingsSeries: dashboardData.monthlySavingsSeries, branchComparisons: branchComparisons }) }));
}
