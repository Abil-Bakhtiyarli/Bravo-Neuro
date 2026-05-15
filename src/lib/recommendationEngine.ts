import type {
  CrossBranchSalesSnapshot,
  ProductRecommendation,
  RecommendationReasonCode,
  RiskLevel,
  ScoredBranchProductRecord,
} from "./types";

const ELIGIBLE_RISK_LEVELS: RiskLevel[] = ["medium", "high", "critical"];
const RISK_LEVEL_PRIORITY: Record<RiskLevel, number> = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 0,
};

function hasEligibleRiskLevel(riskLevel: RiskLevel) {
  return ELIGIBLE_RISK_LEVELS.includes(riskLevel);
}

function buildSummary(record: ScoredBranchProductRecord, action: string, reasons: string[]) {
  const reasonText = reasons.length > 0 ? ` because ${reasons.join(", ")}` : "";

  return `${record.product.name}: ${action}${reasonText}.`;
}

function getTargetUnitsByTomorrow(record: ScoredBranchProductRecord) {
  return Math.ceil(record.totalStock / Math.max(record.daysUntilEarliestExpiry, 1));
}

function getExpectedUnitsByTomorrow(record: ScoredBranchProductRecord) {
  const responseRate = record.discountHistory?.responseRate ?? 0.15;
  return Number((record.salesHistory.avgDailySales * (1 + responseRate)).toFixed(2));
}

function getBestAlternateBranch(
  record: ScoredBranchProductRecord,
): CrossBranchSalesSnapshot | undefined {
  return record.crossBranchSales
    .filter((snapshot) => snapshot.branchId !== record.branch.branchId)
    .sort((left, right) => right.avgDailySales - left.avgDailySales)[0];
}

function getExcessStock(record: ScoredBranchProductRecord) {
  const expiryWindowDays = Math.max(record.daysUntilEarliestExpiry, 1);
  return Math.max(record.totalStock - record.salesHistory.avgDailySales * expiryWindowDays, 0);
}

function getDestinationExpectedDemandUntilExpiry(
  destination: CrossBranchSalesSnapshot,
  record: ScoredBranchProductRecord,
) {
  const expiryWindowDays = Math.max(record.daysUntilEarliestExpiry, 1);
  return Math.max(destination.avgDailySales * expiryWindowDays - destination.totalStock, 0);
}

function getDiscountPercent(record: ScoredBranchProductRecord) {
  if (record.risk.roundedScore >= 85 && record.daysUntilEarliestExpiry <= 2) {
    return 35;
  }

  if (record.risk.roundedScore >= 75 && record.daysUntilEarliestExpiry <= 4) {
    return 25;
  }

  if (record.risk.roundedScore >= 60) {
    return 15;
  }

  return 0;
}

function needsInvestigation(record: ScoredBranchProductRecord) {
  return (
    record.salesHistory.avgDailySales <= 0 ||
    record.daysOfStockRemaining === null ||
    record.daysUntilEarliestExpiry < 0
  );
}

function buildInvestigationRecommendation(
  record: ScoredBranchProductRecord,
  reasonCodes: RecommendationReasonCode[],
  summaryReasons: string[],
): ProductRecommendation {
  return {
    branchId: record.branch.branchId,
    productId: record.product.productId,
    branchName: record.branch.branchName,
    productName: record.product.name,
    riskScore: record.risk.roundedScore,
    riskLevel: record.risk.riskLevel,
    actionType: "investigation",
    summary: buildSummary(record, "investigate the issue", summaryReasons),
    reasonCodes,
    checks: [
      "Verify current stock count against shelf and backroom inventory.",
      "Check shelf placement and promo visibility.",
      "Review recent sales anomalies or missing transaction data.",
    ],
  };
}

function getTransferRecommendation(record: ScoredBranchProductRecord): ProductRecommendation | undefined {
  const bestAlternateBranch = getBestAlternateBranch(record);

  if (!bestAlternateBranch || record.daysUntilEarliestExpiry < 2) {
    return undefined;
  }

  const currentSales = record.salesHistory.avgDailySales;
  const requiredSalesThreshold = currentSales * 1.5;

  if (bestAlternateBranch.avgDailySales < requiredSalesThreshold) {
    return undefined;
  }

  const excessStock = getExcessStock(record);
  const destinationExpectedDemandUntilExpiry = getDestinationExpectedDemandUntilExpiry(
    bestAlternateBranch,
    record,
  );
  const transferQuantity = Math.min(excessStock, destinationExpectedDemandUntilExpiry);

  if (transferQuantity < 1) {
    return undefined;
  }

  const speedMultiplier =
    currentSales > 0 ? Number((bestAlternateBranch.avgDailySales / currentSales).toFixed(2)) : 0;

  return {
    branchId: record.branch.branchId,
    productId: record.product.productId,
    branchName: record.branch.branchName,
    productName: record.product.name,
    riskScore: record.risk.roundedScore,
    riskLevel: record.risk.riskLevel,
    actionType: "transfer",
    summary: buildSummary(record, "transfer excess stock", [
      `${bestAlternateBranch.branchName} sells it ${speedMultiplier}x faster`,
      `transfer ${transferQuantity} units before expiry`,
    ]),
    reasonCodes: ["faster-branch-demand", "transfer-feasible", "excess-stock"],
    destinationBranchId: bestAlternateBranch.branchId,
    destinationBranchName: bestAlternateBranch.branchName,
    transferQuantity,
    salesSpeedMultiplier: speedMultiplier,
  };
}

function getDiscountRecommendation(record: ScoredBranchProductRecord): ProductRecommendation | undefined {
  const discountPercent = getDiscountPercent(record);

  if (discountPercent === 0) {
    return undefined;
  }

  const targetUnitsByTomorrow = getTargetUnitsByTomorrow(record);
  const expectedUnitsByTomorrow = getExpectedUnitsByTomorrow(record);
  const fallbackDiscountPercent =
    expectedUnitsByTomorrow < targetUnitsByTomorrow
      ? Math.min(discountPercent + 10, 50)
      : discountPercent;

  return {
    branchId: record.branch.branchId,
    productId: record.product.productId,
    branchName: record.branch.branchName,
    productName: record.product.name,
    riskScore: record.risk.roundedScore,
    riskLevel: record.risk.riskLevel,
    actionType: "discount",
    summary: buildSummary(record, "apply a dynamic discount", [
      `${record.daysUntilEarliestExpiry} day expiry window`,
      `${discountPercent}% base discount`,
    ]),
    reasonCodes: ["near-expiry", "high-risk-score", "excess-stock"],
    discountPercent,
    fallbackDiscountPercent,
    targetUnitsByTomorrow,
    expectedUnitsByTomorrow,
  };
}

function getReorderRecommendation(record: ScoredBranchProductRecord): ProductRecommendation | undefined {
  if (record.daysUntilEarliestExpiry <= 4) {
    return undefined;
  }

  const hasOversupply = (record.daysOfStockRemaining ?? 0) >= 10;
  const hasWasteTrend =
    record.wasteHistory.previousWasteUnits >= 5 || record.wasteHistory.categoryWasteRate >= 0.12;

  if (!hasOversupply && !hasWasteTrend) {
    return undefined;
  }

  const shouldPause = (record.daysOfStockRemaining ?? 0) >= 14;
  const suggestedOrderMultiplier = shouldPause ? 0 : 0.75;

  return {
    branchId: record.branch.branchId,
    productId: record.product.productId,
    branchName: record.branch.branchName,
    productName: record.product.name,
    riskScore: record.risk.roundedScore,
    riskLevel: record.risk.riskLevel,
    actionType: "reorder-adjustment",
    summary: buildSummary(record, shouldPause ? "pause the next reorder" : "reduce the next reorder", [
      `stock coverage is ${record.daysOfStockRemaining ?? 0} days`,
      `waste trend remains elevated`,
    ]),
    reasonCodes: ["oversupply", "waste-trend"],
    adjustment: shouldPause ? "pause" : "reduce",
    suggestedOrderMultiplier,
  };
}

function getShelfActionRecommendation(record: ScoredBranchProductRecord): ProductRecommendation | undefined {
  if (record.daysUntilEarliestExpiry > 4) {
    return undefined;
  }

  const targetPlacement =
    record.inventoryLots.some((lot) => lot.shelfLocation !== "promo endcap")
      ? "promo endcap"
      : "front shelf";

  return {
    branchId: record.branch.branchId,
    productId: record.product.productId,
    branchName: record.branch.branchName,
    productName: record.product.name,
    riskScore: record.risk.roundedScore,
    riskLevel: record.risk.riskLevel,
    actionType: "shelf-action",
    summary: buildSummary(record, "move stock to a higher-visibility shelf", [
      `${record.daysUntilEarliestExpiry} day expiry window`,
      `${targetPlacement} placement`,
    ]),
    reasonCodes: ["near-expiry", "visibility-boost"],
    targetPlacement,
  };
}

export function generateRecommendation(
  record: ScoredBranchProductRecord,
): ProductRecommendation | undefined {
  if (!hasEligibleRiskLevel(record.risk.riskLevel)) {
    return undefined;
  }

  if (needsInvestigation(record)) {
    return buildInvestigationRecommendation(
      record,
      ["data-conflict"],
      ["sales or stock coverage data is unusable"],
    );
  }

  const transferRecommendation = getTransferRecommendation(record);
  if (transferRecommendation) {
    return transferRecommendation;
  }

  const discountRecommendation = getDiscountRecommendation(record);
  if (discountRecommendation) {
    return discountRecommendation;
  }

  const reorderRecommendation = getReorderRecommendation(record);
  if (reorderRecommendation) {
    return reorderRecommendation;
  }

  const shelfRecommendation = getShelfActionRecommendation(record);
  if (shelfRecommendation) {
    return shelfRecommendation;
  }

  return buildInvestigationRecommendation(
    record,
    ["unclear-primary-action"],
    ["the risk is elevated but the best next step is not conclusive"],
  );
}

export function generateRecommendationsForBranch(records: ScoredBranchProductRecord[]) {
  return records
    .map((record) => ({
      record,
      recommendation: generateRecommendation(record),
    }))
    .filter(
      (
        entry,
      ): entry is {
        record: ScoredBranchProductRecord;
        recommendation: ProductRecommendation;
      } => entry.recommendation !== undefined,
    )
    .sort((left, right) => {
      const riskPriorityDelta =
        RISK_LEVEL_PRIORITY[right.record.risk.riskLevel] -
        RISK_LEVEL_PRIORITY[left.record.risk.riskLevel];

      if (riskPriorityDelta !== 0) {
        return riskPriorityDelta;
      }

      const scoreDelta = right.record.risk.roundedScore - left.record.risk.roundedScore;
      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return left.record.daysUntilEarliestExpiry - right.record.daysUntilEarliestExpiry;
    })
    .map((entry) => entry.recommendation);
}
