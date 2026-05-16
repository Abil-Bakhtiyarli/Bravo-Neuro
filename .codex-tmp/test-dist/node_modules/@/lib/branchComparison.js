"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighestRiskLevel = getHighestRiskLevel;
exports.buildBranchComparisonSummary = buildBranchComparisonSummary;
const dashboardKpiPresentation_1 = require("./dashboardKpiPresentation");
function getHighestRiskLevel(riskTable) {
    if (riskTable.some((row) => row.riskLevel === "critical")) {
        return "critical";
    }
    if (riskTable.some((row) => row.riskLevel === "high")) {
        return "high";
    }
    if (riskTable.some((row) => row.riskLevel === "medium")) {
        return "medium";
    }
    return "low";
}
function buildBranchComparisonSummary(branchData, isSelected) {
    const kpiItems = (0, dashboardKpiPresentation_1.buildDashboardKpiPresentationItems)(branchData);
    const protectedValueDisplay = kpiItems.find((item) => item.key === "net-saved-value")?.displayValue ?? "AZN 0.0";
    return {
        branchId: branchData.branch.branchId,
        branchName: branchData.branch.branchName,
        protectedValueDisplay,
        riskyProductsCount: branchData.riskTable.length,
        highestRiskLevel: getHighestRiskLevel(branchData.riskTable),
        topActionLabel: branchData.actionPlan[0]?.summary ?? "No action",
        isSelected,
    };
}
