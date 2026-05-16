import type { ProductRecommendation, RecommendationSavings } from "./types";

export type SavingsComparisonViewModel = {
  actionType: ProductRecommendation["actionType"];
  methodology: string;
  beforeActionLossAzN: number;
  afterActionResidualLossAzN: number;
  totalActionCostAzN: number;
  grossRecoveredValueAzN: number;
  netSavedValueAzN: number;
  estimatedRecoveredUnits: number;
  estimatedWasteUnitsAvoided: number;
  unitsAtRisk: number;
};

function roundToTwo(value: number) {
  return Number(value.toFixed(2));
}

export function buildSavingsComparisonViewModel(
  recommendation: ProductRecommendation,
  savings: RecommendationSavings,
): SavingsComparisonViewModel {
  const totalActionCostAzN =
    savings.costBreakdown.discountCostAzN +
    savings.costBreakdown.transferCostAzN +
    savings.costBreakdown.handlingCostAzN;
  const afterActionResidualLossAzN = Math.max(
    savings.possibleLossAzN - savings.recoveredValueAzN,
    0,
  );

  return {
    actionType: recommendation.actionType,
    methodology: savings.assumptions.methodology,
    beforeActionLossAzN: roundToTwo(savings.possibleLossAzN),
    afterActionResidualLossAzN: roundToTwo(afterActionResidualLossAzN),
    totalActionCostAzN: roundToTwo(totalActionCostAzN),
    grossRecoveredValueAzN: roundToTwo(savings.recoveredValueAzN),
    netSavedValueAzN: roundToTwo(savings.netSavedValueAzN),
    estimatedRecoveredUnits: roundToTwo(savings.estimatedRecoveredUnits),
    estimatedWasteUnitsAvoided: roundToTwo(savings.estimatedWasteUnitsAvoided),
    unitsAtRisk: roundToTwo(savings.assumptions.unitsAtRisk),
  };
}
