import type {
  BranchProductLookup,
  ProductRecommendation,
  RecommendationExplanation,
  RecommendationWithExplanation,
  RiskComponentScore,
  ScoredBranchProductRecord,
} from "./types";

function roundToOne(value: number) {
  return Number(value.toFixed(1));
}

function createLookupKey(
  branchId: ScoredBranchProductRecord["branch"]["branchId"],
  productId: ScoredBranchProductRecord["product"]["productId"],
): BranchProductLookup {
  return `${branchId}:${productId}`;
}

function getSelectedDrivers(record: ScoredBranchProductRecord) {
  const nonZeroDrivers = record.risk.mainDrivers.filter(
    (driver) => driver.weightedContribution > 0,
  );

  return nonZeroDrivers.slice(0, Math.min(nonZeroDrivers.length, 3));
}

function getRequiredDailySales(record: ScoredBranchProductRecord) {
  const clearanceWindowDays = Math.max(record.daysUntilEarliestExpiry, 1);
  return record.totalStock / clearanceWindowDays;
}

function getBestAlternateBranch(record: ScoredBranchProductRecord) {
  return record.crossBranchSales
    .filter((snapshot) => snapshot.branchId !== record.branch.branchId)
    .sort((left, right) => right.avgDailySales - left.avgDailySales)[0];
}

function formatDaysUntilExpiry(daysUntilExpiry: number) {
  if (daysUntilExpiry <= 0) {
    return "expires today or is already past date";
  }

  if (daysUntilExpiry === 1) {
    return "expires in 1 day";
  }

  return `expires in ${daysUntilExpiry} days`;
}

function formatStockPressure(record: ScoredBranchProductRecord) {
  if (record.daysOfStockRemaining === null) {
    return "stock coverage cannot be trusted because daily sales is zero";
  }

  const clearanceWindowDays = Math.max(record.daysUntilEarliestExpiry, 1);
  const coverageRatio = roundToOne(record.daysOfStockRemaining / clearanceWindowDays);

  return `stock covers ${record.daysOfStockRemaining} days, or ${coverageRatio}x the clearance window`;
}

function formatSalesWeakness(record: ScoredBranchProductRecord) {
  const requiredDailySales = roundToOne(getRequiredDailySales(record));
  return `current sales average ${record.salesHistory.avgDailySales}/day versus ${requiredDailySales}/day needed to clear before expiry`;
}

function formatHistoricalWaste(record: ScoredBranchProductRecord) {
  const wasteRatePercent = Math.round(record.wasteHistory.categoryWasteRate * 100);
  return `${record.wasteHistory.previousWasteUnits} units were wasted previously and category waste is ${wasteRatePercent}%`;
}

function formatBranchDemandMismatch(record: ScoredBranchProductRecord) {
  const bestAlternateBranch = getBestAlternateBranch(record);

  if (!bestAlternateBranch) {
    return "another branch shows stronger demand for this product";
  }

  if (record.salesHistory.avgDailySales <= 0) {
    return `${bestAlternateBranch.branchName} is the strongest alternate branch for this product`;
  }

  const speedMultiplier = roundToOne(
    bestAlternateBranch.avgDailySales / record.salesHistory.avgDailySales,
  );

  return `${bestAlternateBranch.branchName} sells this product ${speedMultiplier}x faster than ${record.branch.branchName}`;
}

function formatDriverHighlight(
  driver: RiskComponentScore,
  record: ScoredBranchProductRecord,
) {
  switch (driver.key) {
    case "expiry-urgency":
      return `${record.product.name} ${formatDaysUntilExpiry(record.daysUntilEarliestExpiry)}.`;
    case "stock-pressure":
      return `${record.product.name} is overstocked: ${formatStockPressure(record)}.`;
    case "sales-weakness":
      return `${record.product.name} is not selling fast enough: ${formatSalesWeakness(record)}.`;
    case "historical-waste":
      return `Waste history is elevated for ${record.product.name}: ${formatHistoricalWaste(record)}.`;
    case "branch-demand-mismatch":
      return `Demand is stronger elsewhere: ${formatBranchDemandMismatch(record)}.`;
    default: {
      const exhaustiveCheck: never = driver.key;
      throw new Error(`Unsupported risk driver: ${String(exhaustiveCheck)}`);
    }
  }
}

function buildSummary(record: ScoredBranchProductRecord, driverHighlights: string[]) {
  const clauses = driverHighlights.map((highlight) =>
    highlight.replace(`${record.product.name} `, "").replace(/\.$/, ""),
  );

  const lead = `Risk is ${record.risk.riskLevel} for ${record.product.name}.`;
  const because = clauses.length > 0 ? ` ${record.product.name} is risky because ${clauses.join(", and ")}.` : "";

  return `${lead}${because}`;
}

function buildRecommendationRationale(
  record: ScoredBranchProductRecord,
  recommendation: ProductRecommendation,
) {
  switch (recommendation.actionType) {
    case "discount": {
      const fallbackText =
        recommendation.fallbackDiscountPercent > recommendation.discountPercent
          ? ` If sell-through stays below the ${recommendation.targetUnitsByTomorrow}-unit target by tomorrow, raise it to ${recommendation.fallbackDiscountPercent}%.`
          : "";

      return `This action is recommended because the product faces near-term expiry pressure and a ${recommendation.discountPercent}% discount is the fastest way to improve sell-through.${fallbackText}`;
    }
    case "transfer":
      return `This action is recommended because ${recommendation.destinationBranchName} can absorb ${recommendation.transferQuantity} units before expiry and sells the product ${recommendation.salesSpeedMultiplier}x faster than ${record.branch.branchName}.`;
    case "reorder-adjustment":
      return `This action is recommended because stock already covers ${record.daysOfStockRemaining ?? 0} days, so the next order should be ${recommendation.adjustment === "pause" ? "paused" : "reduced"} to avoid more waste.`;
    case "shelf-action":
      return `This action is recommended because the expiry window is short and moving the product to the ${recommendation.targetPlacement} can improve visibility without using a deeper intervention first.`;
    case "investigation":
      return "This action is recommended because the risk is elevated but the stock, placement, or sales data needs manager verification before a stronger intervention is justified.";
    default: {
      const exhaustiveCheck: never = recommendation;
      throw new Error(`Unsupported recommendation action: ${String(exhaustiveCheck)}`);
    }
  }
}

export function generateRecommendationExplanation(
  record: ScoredBranchProductRecord,
  recommendation: ProductRecommendation,
): RecommendationExplanation {
  const selectedDrivers = getSelectedDrivers(record);
  const driverHighlights = selectedDrivers.map((driver) =>
    formatDriverHighlight(driver, record),
  );

  return {
    summary: buildSummary(record, driverHighlights),
    driverHighlights,
    recommendationRationale: buildRecommendationRationale(record, recommendation),
  };
}

export function attachExplanationToRecommendation(
  record: ScoredBranchProductRecord,
  recommendation: ProductRecommendation,
): RecommendationWithExplanation {
  return {
    recommendation,
    explanation: generateRecommendationExplanation(record, recommendation),
  };
}

export function attachExplanationsToRecommendations(
  records: ScoredBranchProductRecord[],
  recommendations: ProductRecommendation[],
) {
  const recordsByLookup = new Map<BranchProductLookup, ScoredBranchProductRecord>(
    records.map((record) => [createLookupKey(record.branch.branchId, record.product.productId), record]),
  );

  return recommendations.map((recommendation) => {
    const lookupKey = createLookupKey(recommendation.branchId, recommendation.productId);
    const record = recordsByLookup.get(lookupKey);

    if (!record) {
      throw new Error(`Missing scored record for recommendation ${lookupKey}`);
    }

    return attachExplanationToRecommendation(record, recommendation);
  });
}
