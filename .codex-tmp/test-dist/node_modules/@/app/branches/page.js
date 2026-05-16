"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BranchesPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppShell_1 = __importDefault(require("@/components/AppShell"));
const BranchComparisonCard_1 = __importDefault(require("@/components/BranchComparisonCard"));
const DetailPageHeader_1 = __importDefault(require("@/components/DetailPageHeader"));
const branchComparison_1 = require("@/lib/branchComparison");
const branchSelection_1 = require("@/lib/branchSelection");
const dashboardData_1 = require("@/lib/dashboardData");
async function BranchesPage({ searchParams, testStaticMode = false, }) {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    const resolvedSearchParams = await searchParams;
    const selectedBranchId = (0, branchSelection_1.resolveSelectedBranchId)(resolvedSearchParams.branch, branches.map((branch) => branch.branchId));
    const selectedDashboardData = (0, dashboardData_1.getDashboardData)(selectedBranchId);
    const branchComparisons = branches.map((branch) => (0, branchComparison_1.buildBranchComparisonSummary)((0, dashboardData_1.getDashboardData)(branch.branchId), branch.branchId === selectedBranchId));
    return ((0, jsx_runtime_1.jsx)(AppShell_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsx)(DetailPageHeader_1.default, { branches: branches, selectedBranchId: selectedBranchId, title: "Branch comparison", subtitle: "Compare current risk, protected value, and top action by branch.", generatedAt: selectedDashboardData.generatedAt, staticMode: testStaticMode }), (0, jsx_runtime_1.jsx)(BranchComparisonCard_1.default, { comparisons: branchComparisons })] }) }));
}
