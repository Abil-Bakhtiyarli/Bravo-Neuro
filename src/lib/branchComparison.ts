import { buildDashboardKpiPresentationItems } from "./dashboardKpiPresentation";
import type { BranchDashboardData, RiskLevel } from "./types";

export type BranchComparisonSummary = {
  branchId: string;
  branchName: string;
  protectedValueDisplay: string;
  riskyProductsCount: number;
  highestRiskLevel: Exclude<RiskLevel, "low"> | "low";
  topActionLabel: string;
  isSelected: boolean;
};

export function getHighestRiskLevel(
  riskTable: BranchDashboardData["riskTable"],
): Exclude<RiskLevel, "low"> | "low" {
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

export function buildBranchComparisonSummary(
  branchData: BranchDashboardData,
  isSelected: boolean,
): BranchComparisonSummary {
  const kpiItems = buildDashboardKpiPresentationItems(branchData);
  const protectedValueDisplay =
    kpiItems.find((item) => item.key === "net-saved-value")?.displayValue ?? "AZN 0.0";

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
