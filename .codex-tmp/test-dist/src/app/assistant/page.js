"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AssistantPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppShell_1 = __importDefault(require("@/components/AppShell"));
const AssistantExperience_1 = __importDefault(require("@/components/AssistantExperience"));
const DetailPageHeader_1 = __importDefault(require("@/components/DetailPageHeader"));
const context_1 = require("@/lib/assistant/context");
const branchSelection_1 = require("@/lib/branchSelection");
const dashboardData_1 = require("@/lib/dashboardData");
async function AssistantPage({ searchParams, testStaticMode = false, }) {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    const resolvedSearchParams = await searchParams;
    const selectedBranchId = (0, branchSelection_1.resolveSelectedBranchId)(resolvedSearchParams.branch, branches.map((branch) => branch.branchId));
    const requestedProductId = Array.isArray(resolvedSearchParams.product)
        ? resolvedSearchParams.product[0] ?? null
        : resolvedSearchParams.product ?? null;
    const contextSnapshot = (0, context_1.buildAssistantContextSnapshot)(selectedBranchId, requestedProductId);
    return ((0, jsx_runtime_1.jsx)(AppShell_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsx)(DetailPageHeader_1.default, { branches: branches, selectedBranchId: selectedBranchId, title: "AI assistant", subtitle: "Grounded branch analysis limited to the current Bravo snapshot and selected product context.", generatedAt: contextSnapshot.branch.generatedAt, preservedSearchParamKeys: ["product"], staticMode: testStaticMode }), (0, jsx_runtime_1.jsx)(AssistantExperience_1.default, { branchId: selectedBranchId, initialProductId: requestedProductId, contextSnapshot: contextSnapshot, staticMode: testStaticMode })] }) }));
}
