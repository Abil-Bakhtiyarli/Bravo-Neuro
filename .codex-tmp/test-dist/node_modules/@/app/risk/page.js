"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RiskPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppShell_1 = __importDefault(require("@/components/AppShell"));
const DetailPageHeader_1 = __importDefault(require("@/components/DetailPageHeader"));
const RiskTableExperience_1 = __importDefault(require("@/components/RiskTableExperience"));
const dashboardData_1 = require("@/lib/dashboardData");
const riskTableInteraction_1 = require("@/lib/riskTableInteraction");
const branchSelection_1 = require("@/lib/branchSelection");
async function RiskPage({ searchParams, testStaticMode = false }) {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    const resolvedSearchParams = await searchParams;
    const selectedBranchId = (0, branchSelection_1.resolveSelectedBranchId)(resolvedSearchParams.branch, branches.map((branch) => branch.branchId));
    const dashboardData = (0, dashboardData_1.getDashboardData)(selectedBranchId);
    const initialRequestedProductId = Array.isArray(resolvedSearchParams.product)
        ? resolvedSearchParams.product[0] ?? null
        : resolvedSearchParams.product ?? null;
    const initialQuery = Array.isArray(resolvedSearchParams.q)
        ? resolvedSearchParams.q[0] ?? ""
        : resolvedSearchParams.q ?? "";
    const initialRisk = (0, riskTableInteraction_1.parseRiskTableFilterValue)(Array.isArray(resolvedSearchParams.risk)
        ? resolvedSearchParams.risk[0] ?? "all"
        : resolvedSearchParams.risk ?? "all");
    return ((0, jsx_runtime_1.jsx)(AppShell_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsx)(DetailPageHeader_1.default, { branches: branches, selectedBranchId: selectedBranchId, title: "Risk products", subtitle: "Branch-level expiry, stock, and waste-risk queue.", generatedAt: dashboardData.generatedAt, preservedSearchParamKeys: ["q", "risk"], staticMode: testStaticMode }), (0, jsx_runtime_1.jsx)(RiskTableExperience_1.default, { rows: dashboardData.riskTable, productDetailsById: dashboardData.productDetailsById, initialRequestedProductId: initialRequestedProductId, initialQuery: initialQuery, initialRiskFilter: initialRisk })] }) }));
}
