"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSavingsComparisonViewModel = buildSavingsComparisonViewModel;
function roundToTwo(value) {
    return Number(value.toFixed(2));
}
function buildSavingsComparisonViewModel(recommendation, savings) {
    const totalActionCostAzN = savings.costBreakdown.discountCostAzN +
        savings.costBreakdown.transferCostAzN +
        savings.costBreakdown.handlingCostAzN;
    const afterActionResidualLossAzN = Math.max(savings.possibleLossAzN - savings.recoveredValueAzN, 0);
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
