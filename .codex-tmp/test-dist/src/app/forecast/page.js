"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ForecastPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppShell_1 = __importDefault(require("@/components/AppShell"));
const DetailPageHeader_1 = __importDefault(require("@/components/DetailPageHeader"));
const RevenueForecastOverview_1 = __importDefault(require("@/components/RevenueForecastOverview"));
const branchSelection_1 = require("@/lib/branchSelection");
const dashboardData_1 = require("@/lib/dashboardData");
const operationsDemoData_1 = require("@/lib/operationsDemoData");
async function ForecastPage({ searchParams, testStaticMode = false, }) {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    const resolvedSearchParams = await searchParams;
    const selectedBranchId = (0, branchSelection_1.resolveSelectedBranchId)(resolvedSearchParams.branch, branches.map((branch) => branch.branchId));
    const forecastData = (0, operationsDemoData_1.getRevenueForecastPageData)(selectedBranchId);
    return ((0, jsx_runtime_1.jsx)(AppShell_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsx)(DetailPageHeader_1.default, { branches: branches, selectedBranchId: selectedBranchId, title: "Revenue forecast", subtitle: "Forward-looking branch revenue view built from current run rate, category mix, and operational risk signals.", generatedAt: forecastData.generatedAt, staticMode: testStaticMode }), (0, jsx_runtime_1.jsx)(RevenueForecastOverview_1.default, { data: forecastData })] }) }));
}
