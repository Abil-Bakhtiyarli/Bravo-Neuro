"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAssistantBranchSnapshot = buildAssistantBranchSnapshot;
exports.buildAssistantContextSnapshot = buildAssistantContextSnapshot;
exports.buildBranchSnapshotCitation = buildBranchSnapshotCitation;
exports.buildProductDetailCitation = buildProductDetailCitation;
const dashboardData_1 = require("@/lib/dashboardData");
const DEFAULT_TOP_RISK_LIMIT = 5;
const DEFAULT_ACTION_LIMIT = 5;
const DEFAULT_SERIES_LIMIT = 6;
function buildPromptChips(branchName, selectedProduct) {
    const productPrompt = selectedProduct
        ? `Why is ${selectedProduct.product.name} risky in ${branchName}, and what is the best next action?`
        : `Which products need the fastest intervention in ${branchName} today?`;
    const comparePrompt = selectedProduct?.recommendation?.actionType === "transfer"
        ? `Compare transfer versus discount for ${selectedProduct.product.name} in ${branchName}.`
        : selectedProduct
            ? `Compare discount versus transfer for ${selectedProduct.product.name} in ${branchName}.`
            : `When should this branch transfer stock instead of discounting it?`;
    return [
        {
            id: "selected-risk",
            label: selectedProduct ? "Explain selected product" : "Explain top risk",
            prompt: productPrompt,
        },
        {
            id: "today-actions",
            label: "Today’s branch plan",
            prompt: `What should ${branchName} do today based on the current action queue?`,
        },
        {
            id: "compare-actions",
            label: "Compare actions",
            prompt: comparePrompt,
        },
    ];
}
function safeGetProductDetailData(branchId, productId) {
    if (!productId) {
        return null;
    }
    try {
        return (0, dashboardData_1.getProductDetailData)(branchId, productId);
    }
    catch (error) {
        if (error instanceof dashboardData_1.DashboardDataError && error.code === "UNKNOWN_PRODUCT") {
            return null;
        }
        throw error;
    }
}
function findRiskRow(riskTable, productId) {
    if (!productId) {
        return null;
    }
    return riskTable.find((row) => row.productId === productId) ?? null;
}
function findActionItem(actionPlan, productId) {
    if (!productId) {
        return null;
    }
    return actionPlan.find((item) => item.productId === productId) ?? null;
}
function buildAssistantBranchSnapshot(branchId, options) {
    const dashboardData = (0, dashboardData_1.getDashboardData)(branchId);
    return {
        branchId: dashboardData.branch.branchId,
        branchName: dashboardData.branch.branchName,
        generatedAt: dashboardData.generatedAt,
        kpis: dashboardData.kpis,
        topRiskProducts: dashboardData.riskTable.slice(0, options?.topRiskLimit ?? DEFAULT_TOP_RISK_LIMIT),
        actionPlan: dashboardData.actionPlan.slice(0, options?.actionLimit ?? DEFAULT_ACTION_LIMIT),
        monthlySavingsSeries: dashboardData.monthlySavingsSeries.slice(-(options?.seriesLimit ?? DEFAULT_SERIES_LIMIT)),
    };
}
function buildAssistantContextSnapshot(branchId, productId) {
    const dashboardData = (0, dashboardData_1.getDashboardData)(branchId);
    const selectedProduct = safeGetProductDetailData(branchId, productId);
    const resolvedProductId = selectedProduct?.product.productId ?? null;
    return {
        branch: {
            branchId: dashboardData.branch.branchId,
            branchName: dashboardData.branch.branchName,
            generatedAt: dashboardData.generatedAt,
            kpis: dashboardData.kpis,
            topRiskProducts: dashboardData.riskTable.slice(0, DEFAULT_TOP_RISK_LIMIT),
            actionPlan: dashboardData.actionPlan.slice(0, DEFAULT_ACTION_LIMIT),
            monthlySavingsSeries: dashboardData.monthlySavingsSeries.slice(-DEFAULT_SERIES_LIMIT),
        },
        selectedProduct,
        selectedProductRiskRow: findRiskRow(dashboardData.riskTable, resolvedProductId),
        selectedProductAction: findActionItem(dashboardData.actionPlan, resolvedProductId),
        promptChips: buildPromptChips(dashboardData.branch.branchName, selectedProduct),
    };
}
function buildBranchSnapshotCitation(branchId) {
    const dashboardData = (0, dashboardData_1.getDashboardData)(branchId);
    return {
        kind: "branch-kpi",
        label: `${dashboardData.branch.branchName} branch snapshot`,
        branchId,
    };
}
function buildProductDetailCitation(detail) {
    return {
        kind: "product-detail",
        label: detail.product.name,
        branchId: detail.branch.branchId,
        productId: detail.product.productId,
    };
}
