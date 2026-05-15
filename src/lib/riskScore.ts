import type {
  CrossBranchSalesSnapshot,
  EnrichedBranchProductRecord,
  ProductRiskAssessment,
  RiskComponentScore,
  RiskFactorKey,
  RiskLevel,
} from "./types";

const COMPONENT_WEIGHTS: Record<RiskFactorKey, number> = {
  "expiry-urgency": 0.35,
  "stock-pressure": 0.25,
  "sales-weakness": 0.2,
  "historical-waste": 0.1,
  "branch-demand-mismatch": 0.1,
};

const COMPONENT_LABELS: Record<RiskFactorKey, string> = {
  "expiry-urgency": "Expiry urgency",
  "stock-pressure": "Stock pressure",
  "sales-weakness": "Sales weakness",
  "historical-waste": "Historical waste",
  "branch-demand-mismatch": "Branch demand mismatch",
};

function clampScore(value: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 100) {
    return 100;
  }

  return Number(value.toFixed(2));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) {
    return "critical";
  }

  if (score >= 60) {
    return "high";
  }

  if (score >= 35) {
    return "medium";
  }

  return "low";
}

function getExpiryUrgencyScore(daysUntilEarliestExpiry: number) {
  if (daysUntilEarliestExpiry <= 0) {
    return 100;
  }

  if (daysUntilEarliestExpiry === 1) {
    return 95;
  }

  if (daysUntilEarliestExpiry === 2) {
    return 85;
  }

  if (daysUntilEarliestExpiry === 3) {
    return 70;
  }

  if (daysUntilEarliestExpiry === 4) {
    return 55;
  }

  if (daysUntilEarliestExpiry === 5) {
    return 40;
  }

  if (daysUntilEarliestExpiry === 6) {
    return 25;
  }

  if (daysUntilEarliestExpiry === 7) {
    return 15;
  }

  return 0;
}

function getStockPressureScore(record: EnrichedBranchProductRecord) {
  if (record.daysOfStockRemaining === null) {
    return 100;
  }

  const coverageRatio =
    record.daysOfStockRemaining / Math.max(record.daysUntilEarliestExpiry, 1);

  return clampScore(((coverageRatio - 1) / 2) * 100);
}

function getSalesWeaknessScore(record: EnrichedBranchProductRecord) {
  const clearanceWindowDays = Math.max(record.daysUntilEarliestExpiry, 1);
  const requiredDailySales = record.totalStock / clearanceWindowDays;

  if (requiredDailySales <= 0) {
    return 0;
  }

  const clearanceRatio = record.salesHistory.avgDailySales / requiredDailySales;

  return clampScore((1 - clearanceRatio) * 100);
}

function getHistoricalWasteScore(record: EnrichedBranchProductRecord) {
  const wasteRateScore = record.wasteHistory.categoryWasteRate * 100;
  const wasteUnitsScore = clampScore((record.wasteHistory.previousWasteUnits / 12) * 100);

  return clampScore(wasteRateScore * 0.7 + wasteUnitsScore * 0.3);
}

function getBestAlternateBranch(
  record: EnrichedBranchProductRecord,
): CrossBranchSalesSnapshot | undefined {
  return record.crossBranchSales
    .filter((snapshot) => snapshot.branchId !== record.branch.branchId)
    .sort((left, right) => right.avgDailySales - left.avgDailySales)[0];
}

function getBranchDemandMismatchScore(record: EnrichedBranchProductRecord) {
  const bestAlternateBranch = getBestAlternateBranch(record);
  const currentBranchSales = record.salesHistory.avgDailySales;

  if (!bestAlternateBranch || bestAlternateBranch.avgDailySales <= currentBranchSales) {
    return 0;
  }

  if (currentBranchSales <= 0) {
    return 100;
  }

  const speedMultiplier = bestAlternateBranch.avgDailySales / currentBranchSales;

  return clampScore(((speedMultiplier - 1) / 1) * 100);
}

function buildComponentScore(key: RiskFactorKey, rawScore: number): RiskComponentScore {
  const weight = COMPONENT_WEIGHTS[key];

  return {
    key,
    label: COMPONENT_LABELS[key],
    rawScore,
    weight,
    weightedContribution: rawScore * weight,
  };
}

export function calculateWasteRisk(record: EnrichedBranchProductRecord): ProductRiskAssessment {
  const componentScores = [
    buildComponentScore(
      "expiry-urgency",
      getExpiryUrgencyScore(record.daysUntilEarliestExpiry),
    ),
    buildComponentScore("stock-pressure", getStockPressureScore(record)),
    buildComponentScore("sales-weakness", getSalesWeaknessScore(record)),
    buildComponentScore("historical-waste", getHistoricalWasteScore(record)),
    buildComponentScore(
      "branch-demand-mismatch",
      getBranchDemandMismatchScore(record),
    ),
  ].sort((left, right) => {
    if (right.weightedContribution !== left.weightedContribution) {
      return right.weightedContribution - left.weightedContribution;
    }

    return right.rawScore - left.rawScore;
  });

  const totalScore = Number(
    componentScores
      .reduce((sum, componentScore) => sum + componentScore.weightedContribution, 0)
      .toFixed(2),
  );
  const roundedScore = Math.round(totalScore);

  return {
    totalScore,
    roundedScore,
    riskLevel: getRiskLevel(roundedScore),
    componentScores,
    mainDrivers: componentScores.slice(0, 3),
  };
}

export function calculateWasteRiskForBranch(records: EnrichedBranchProductRecord[]) {
  return records.map((record) => ({
    ...record,
    risk: calculateWasteRisk(record),
  }));
}
