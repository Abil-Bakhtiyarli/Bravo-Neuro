"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActionsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const ActionPlanExperience_1 = __importDefault(require("@/components/ActionPlanExperience"));
const AppShell_1 = __importDefault(require("@/components/AppShell"));
const DetailPageHeader_1 = __importDefault(require("@/components/DetailPageHeader"));
const dashboardData_1 = require("@/lib/dashboardData");
const branchSelection_1 = require("@/lib/branchSelection");
async function ActionsPage({ searchParams, testStaticMode = false, }) {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    const resolvedSearchParams = await searchParams;
    const selectedBranchId = (0, branchSelection_1.resolveSelectedBranchId)(resolvedSearchParams.branch, branches.map((branch) => branch.branchId));
    const dashboardData = (0, dashboardData_1.getDashboardData)(selectedBranchId);
    const initialRequestedProductId = Array.isArray(resolvedSearchParams.product)
        ? resolvedSearchParams.product[0] ?? null
        : resolvedSearchParams.product ?? null;
    return ((0, jsx_runtime_1.jsx)(AppShell_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsx)(DetailPageHeader_1.default, { branches: branches, selectedBranchId: selectedBranchId, title: "Discount actions and execution plan", subtitle: "Priority queue for the current branch review.", generatedAt: dashboardData.generatedAt, staticMode: testStaticMode }), (0, jsx_runtime_1.jsx)(ActionPlanExperience_1.default, { branchId: selectedBranchId, tasks: dashboardData.actionPlan, productDetailsById: dashboardData.productDetailsById, initialRequestedProductId: initialRequestedProductId, staticMode: testStaticMode })] }) }));
}
