import type {
  BranchProductLookup,
  BranchSavingsSummary,
  BranchSavingsSummaryItem,
  ProductRecommendation,
  RecommendationSavings,
  RecommendationWithSavings,
  ScoredBranchProductRecord,
} from "./types";

const DEFAULT_TRANSFER_COST_PER_UNIT_AZN = 0.35;
const DEFAULT_SHELF_ACTION_UPLIFT_RATE = 0.18;
const DEFAULT_REORDER_PREVENTION_CONFIDENCE = 0.8;
const DEFAULT_DISCOUNT_BASELINE_RESPONSE_RATE = 0.05;
const REORDER_TARGET_COVERAGE_DAYS = 7;

function roundToTwo(value: number) {
  return Number(value.toFixed(2));
}

function roundMoney(value: number) {
  return roundToTwo(Math.max(value, 0));
}

function roundUnits(value: number) {
  return roundToTwo(Math.max(value, 0));
}

function getLookupKey(
  branchId: ScoredBranchProductRecord["branch"]["branchId"],
  productId: ScoredBranchProductRecord["product"]["productId"],
): BranchProductLookup {
  return `${branchId}:${productId}`;
}

function getClearanceWindowDays(record: ScoredBranchProductRecord) {
  return Math.max(record.daysUntilEarliestExpiry, 1);
}

function getBaselineUnitsWithoutAction(record: ScoredBranchProductRecord) {
  return roundUnits(
    Math.min(record.totalStock, record.salesHistory.avgDailySales * getClearanceWindowDays(record)),
  );
}

function getUnitsAtRisk(record: ScoredBranchProductRecord, baselineUnitsWithoutAction: number) {
  return roundUnits(Math.max(record.totalStock - baselineUnitsWithoutAction, 0));
}

function buildSavings(
  possibleLossAzN: number,
  recoveredValueAzN: number,
  netSavedValueAzN: number,
  estimatedRecoveredUnits: number,
  estimatedWasteUnitsAvoided: number,
  costBreakdown: RecommendationSavings["costBreakdown"],
  assumptions: RecommendationSavings["assumptions"],
): RecommendationSavings {
  return {
    possibleLossAzN: roundMoney(possibleLossAzN),
    recoveredValueAzN: roundMoney(recoveredValueAzN),
    netSavedValueAzN: roundMoney(netSavedValueAzN),
    estimatedRecoveredUnits: roundUnits(estimatedRecoveredUnits),
    estimatedWasteUnitsAvoided: roundUnits(estimatedWasteUnitsAvoided),
    costBreakdown: {
      discountCostAzN: roundMoney(costBreakdown.discountCostAzN),
      transferCostAzN: roundMoney(costBreakdown.transferCostAzN),
      handlingCostAzN: roundMoney(costBreakdown.handlingCostAzN),
    },
    assumptions: {
      ...assumptions,
      baselineUnitsWithoutAction: roundUnits(assumptions.baselineUnitsWithoutAction),
      unitsAtRisk: roundUnits(assumptions.unitsAtRisk),
      discountedUnitPriceAzN:
        assumptions.discountedUnitPriceAzN === undefined
          ? undefined
          : roundMoney(assumptions.discountedUnitPriceAzN),
    },
  };
}

function calculateDiscountSavings(
  record: ScoredBranchProductRecord,
  recommendation: Extract<ProductRecommendation, { actionType: "discount" }>,
): RecommendationSavings {
  const discountedUnitPriceAzN = record.product.unitPrice * (1 - recommendation.discountPercent / 100);
  const possibleLossUnits = Math.max(record.totalStock - recommendation.expectedUnitsByTomorrow, 0);
  const baselineExpectedUnits = Math.min(
    record.totalStock,
    record.salesHistory.avgDailySales * (1 + DEFAULT_DISCOUNT_BASELINE_RESPONSE_RATE),
  );
  const incrementalUnits = Math.max(recommendation.expectedUnitsByTomorrow - baselineExpectedUnits, 0);
  const recoveredUnits = Math.min(possibleLossUnits, incrementalUnits);
  const recoveredValueAzN = recoveredUnits * discountedUnitPriceAzN;
  const discountCostAzN = recoveredUnits * (record.product.unitPrice - discountedUnitPriceAzN);

  return buildSavings(
    possibleLossUnits * record.product.unitPrice,
    recoveredValueAzN,
    recoveredValueAzN - discountCostAzN,
    recoveredUnits,
    recoveredUnits,
    {
      discountCostAzN,
      transferCostAzN: 0,
      handlingCostAzN: 0,
    },
    {
      methodology:
        "Discount possible loss follows the requested Part 5 formula and uses the recommendation sell-through forecast as the at-risk baseline.",
      baselineUnitsWithoutAction: baselineExpectedUnits,
      unitsAtRisk: possibleLossUnits,
      discountedUnitPriceAzN,
    },
  );
}

function calculateTransferSavings(
  record: ScoredBranchProductRecord,
  recommendation: Extract<ProductRecommendation, { actionType: "transfer" }>,
): RecommendationSavings {
  const recoveredUnits = recommendation.transferQuantity;
  const recoveredValueAzN = recoveredUnits * record.product.unitPrice;
  const transferCostAzN = recoveredUnits * DEFAULT_TRANSFER_COST_PER_UNIT_AZN;

  return buildSavings(
    recoveredValueAzN,
    recoveredValueAzN,
    recoveredValueAzN - transferCostAzN,
    recoveredUnits,
    recoveredUnits,
    {
      discountCostAzN: 0,
      transferCostAzN,
      handlingCostAzN: transferCostAzN,
    },
    {
      methodology: "Transfer value assumes the moved units can be sold at full retail in the destination branch.",
      baselineUnitsWithoutAction: getBaselineUnitsWithoutAction(record),
      unitsAtRisk: recoveredUnits,
      transferCostPerUnitAzN: DEFAULT_TRANSFER_COST_PER_UNIT_AZN,
    },
  );
}

function calculateReorderSavings(
  record: ScoredBranchProductRecord,
  recommendation: Extract<ProductRecommendation, { actionType: "reorder-adjustment" }>,
): RecommendationSavings {
  const avgDailySales = Math.max(record.salesHistory.avgDailySales, 0);
  const targetCoverageUnits = avgDailySales * REORDER_TARGET_COVERAGE_DAYS;
  const excessUnits = Math.max(record.totalStock - targetCoverageUnits, 0);
  const reducedOrderShare = Math.max(1 - recommendation.suggestedOrderMultiplier, 0);
  const preventedUnits = excessUnits * reducedOrderShare * DEFAULT_REORDER_PREVENTION_CONFIDENCE;
  const recoveredValueAzN = preventedUnits * record.product.unitPrice;

  return buildSavings(
    preventedUnits * record.product.unitPrice,
    recoveredValueAzN,
    recoveredValueAzN,
    preventedUnits,
    preventedUnits,
    {
      discountCostAzN: 0,
      transferCostAzN: 0,
      handlingCostAzN: 0,
    },
    {
      methodology:
        "Reorder value estimates future waste prevention from excess coverage above the seven-day target.",
      baselineUnitsWithoutAction: targetCoverageUnits,
      unitsAtRisk: excessUnits,
      reorderPreventionConfidence: DEFAULT_REORDER_PREVENTION_CONFIDENCE,
    },
  );
}

function calculateShelfActionSavings(
  record: ScoredBranchProductRecord,
  recommendation: Extract<ProductRecommendation, { actionType: "shelf-action" }>,
): RecommendationSavings {
  const baselineUnitsWithoutAction = getBaselineUnitsWithoutAction(record);
  const unitsAtRisk = getUnitsAtRisk(record, baselineUnitsWithoutAction);
  const recoveredUnits = Math.min(
    unitsAtRisk,
    baselineUnitsWithoutAction * DEFAULT_SHELF_ACTION_UPLIFT_RATE,
  );
  const recoveredValueAzN = recoveredUnits * record.product.unitPrice;

  return buildSavings(
    unitsAtRisk * record.product.unitPrice,
    recoveredValueAzN,
    recoveredValueAzN,
    recoveredUnits,
    recoveredUnits,
    {
      discountCostAzN: 0,
      transferCostAzN: 0,
      handlingCostAzN: 0,
    },
    {
      methodology: `Shelf-action value uses a conservative visibility uplift for ${recommendation.targetPlacement} placement.`,
      baselineUnitsWithoutAction,
      unitsAtRisk,
      actionUpliftRate: DEFAULT_SHELF_ACTION_UPLIFT_RATE,
    },
  );
}

function calculateInvestigationSavings(
  record: ScoredBranchProductRecord,
): RecommendationSavings {
  const baselineUnitsWithoutAction = getBaselineUnitsWithoutAction(record);
  const unitsAtRisk = getUnitsAtRisk(record, baselineUnitsWithoutAction);

  return buildSavings(
    unitsAtRisk * record.product.unitPrice,
    0,
    0,
    0,
    0,
    {
      discountCostAzN: 0,
      transferCostAzN: 0,
      handlingCostAzN: 0,
    },
    {
      methodology:
        "Investigation is diagnostic only, so the record keeps its loss exposure but does not claim monetary recovery.",
      baselineUnitsWithoutAction,
      unitsAtRisk,
    },
  );
}

export function calculateRecommendationSavings(
  record: ScoredBranchProductRecord,
  recommendation: ProductRecommendation,
): RecommendationSavings {
  switch (recommendation.actionType) {
    case "discount":
      return calculateDiscountSavings(record, recommendation);
    case "transfer":
      return calculateTransferSavings(record, recommendation);
    case "reorder-adjustment":
      return calculateReorderSavings(record, recommendation);
    case "shelf-action":
      return calculateShelfActionSavings(record, recommendation);
    case "investigation":
      return calculateInvestigationSavings(record);
    default: {
      const exhaustiveCheck: never = recommendation;
      throw new Error(`Unsupported recommendation action: ${String(exhaustiveCheck)}`);
    }
  }
}

export function attachSavingsToRecommendation(
  record: ScoredBranchProductRecord,
  recommendation: ProductRecommendation,
): RecommendationWithSavings {
  return {
    recommendation,
    savings: calculateRecommendationSavings(record, recommendation),
  };
}

function createEmptySummaryItem(): BranchSavingsSummaryItem {
  return {
    recommendationCount: 0,
    totalPossibleLossAzN: 0,
    totalRecoveredValueAzN: 0,
    totalNetSavedValueAzN: 0,
  };
}

export function summarizeBranchSavings(
  records: ScoredBranchProductRecord[],
  recommendations: ProductRecommendation[],
): BranchSavingsSummary {
  const recordsByLookup = new Map<BranchProductLookup, ScoredBranchProductRecord>(
    records.map((record) => [getLookupKey(record.branch.branchId, record.product.productId), record]),
  );
  const summary: BranchSavingsSummary = {
    totalPossibleLossAzN: 0,
    totalRecoveredValueAzN: 0,
    totalNetSavedValueAzN: 0,
    recommendationCount: recommendations.length,
    breakdownByActionType: {},
  };

  for (const recommendation of recommendations) {
    const lookupKey = getLookupKey(recommendation.branchId, recommendation.productId);
    const record = recordsByLookup.get(lookupKey);

    if (!record) {
      throw new Error(`Missing scored record for recommendation ${lookupKey}`);
    }

    const savings = calculateRecommendationSavings(record, recommendation);
    summary.totalPossibleLossAzN += savings.possibleLossAzN;
    summary.totalRecoveredValueAzN += savings.recoveredValueAzN;
    summary.totalNetSavedValueAzN += savings.netSavedValueAzN;

    const breakdownItem = summary.breakdownByActionType[recommendation.actionType] ?? createEmptySummaryItem();
    breakdownItem.recommendationCount += 1;
    breakdownItem.totalPossibleLossAzN += savings.possibleLossAzN;
    breakdownItem.totalRecoveredValueAzN += savings.recoveredValueAzN;
    breakdownItem.totalNetSavedValueAzN += savings.netSavedValueAzN;
    summary.breakdownByActionType[recommendation.actionType] = breakdownItem;
  }

  summary.totalPossibleLossAzN = roundMoney(summary.totalPossibleLossAzN);
  summary.totalRecoveredValueAzN = roundMoney(summary.totalRecoveredValueAzN);
  summary.totalNetSavedValueAzN = roundMoney(summary.totalNetSavedValueAzN);

  for (const actionType of Object.keys(summary.breakdownByActionType) as Array<
    keyof typeof summary.breakdownByActionType
  >) {
    const item = summary.breakdownByActionType[actionType];

    if (!item) {
      continue;
    }

    item.totalPossibleLossAzN = roundMoney(item.totalPossibleLossAzN);
    item.totalRecoveredValueAzN = roundMoney(item.totalRecoveredValueAzN);
    item.totalNetSavedValueAzN = roundMoney(item.totalNetSavedValueAzN);
  }

  return summary;
}
