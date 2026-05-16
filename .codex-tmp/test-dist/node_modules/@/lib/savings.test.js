"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const dataLoader_1 = require("./dataLoader");
const recommendationEngine_1 = require("./recommendationEngine");
const riskScore_1 = require("./riskScore");
const savings_1 = require("./savings");
const savingsComparison_1 = require("./savingsComparison");
function getRequiredScoredRecord(branchId, productId) {
    const record = (0, dataLoader_1.getBranchProductRecord)(branchId, productId);
    strict_1.default.ok(record, `Expected seeded record for ${branchId}:${productId}`);
    return {
        ...record,
        risk: (0, riskScore_1.calculateWasteRisk)(record),
    };
}
function withRisk(record, risk) {
    return {
        ...record,
        risk: {
            totalScore: 0,
            roundedScore: 0,
            riskLevel: "low",
            componentScores: [],
            mainDrivers: [],
            ...risk,
        },
    };
}
(0, node_test_1.default)("discount savings include markdown dilution and a lower net saved value", () => {
    const record = getRequiredScoredRecord("ganjlik", "greek-yogurt-500g");
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "discount");
    const savings = (0, savings_1.calculateRecommendationSavings)(record, recommendation);
    strict_1.default.equal(savings.possibleLossAzN, 119.17);
    strict_1.default.equal(savings.recoveredValueAzN, 4.71);
    strict_1.default.equal(savings.netSavedValueAzN, 2.18);
    strict_1.default.equal(savings.costBreakdown.discountCostAzN, 2.54);
    strict_1.default.equal(savings.assumptions.discountedUnitPriceAzN, 3.19);
});
(0, node_test_1.default)("transfer savings recover full retail value minus transfer handling cost", () => {
    const record = getRequiredScoredRecord("ganjlik", "strawberries-250g");
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "transfer");
    const savings = (0, savings_1.calculateRecommendationSavings)(record, recommendation);
    strict_1.default.equal(savings.possibleLossAzN, 39.2);
    strict_1.default.equal(savings.recoveredValueAzN, 39.2);
    strict_1.default.equal(savings.netSavedValueAzN, 36.75);
    strict_1.default.equal(savings.costBreakdown.transferCostAzN, 2.45);
    strict_1.default.equal(savings.costBreakdown.handlingCostAzN, 0);
});
(0, node_test_1.default)("savings comparison view model keeps gross recovery, residual exposure, and action cost distinct", () => {
    const discountRecord = getRequiredScoredRecord("ganjlik", "greek-yogurt-500g");
    const discountRecommendation = (0, recommendationEngine_1.generateRecommendation)(discountRecord);
    const transferRecord = getRequiredScoredRecord("ganjlik", "strawberries-250g");
    const transferRecommendation = (0, recommendationEngine_1.generateRecommendation)(transferRecord);
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(discountRecommendation);
    strict_1.default.equal(discountRecommendation.actionType, "discount");
    strict_1.default.ok(transferRecommendation);
    strict_1.default.equal(transferRecommendation.actionType, "transfer");
    strict_1.default.ok(baseRecord);
    const investigationRecord = withRisk({
        ...baseRecord,
        daysUntilEarliestExpiry: 3,
        daysOfStockRemaining: null,
        salesHistory: {
            ...baseRecord.salesHistory,
            avgDailySales: 0,
        },
    }, {
        totalScore: 64,
        roundedScore: 64,
        riskLevel: "high",
    });
    const investigationRecommendation = (0, recommendationEngine_1.generateRecommendation)(investigationRecord);
    strict_1.default.ok(investigationRecommendation);
    strict_1.default.equal(investigationRecommendation.actionType, "investigation");
    const discountViewModel = (0, savingsComparison_1.buildSavingsComparisonViewModel)(discountRecommendation, (0, savings_1.calculateRecommendationSavings)(discountRecord, discountRecommendation));
    const transferViewModel = (0, savingsComparison_1.buildSavingsComparisonViewModel)(transferRecommendation, (0, savings_1.calculateRecommendationSavings)(transferRecord, transferRecommendation));
    const investigationViewModel = (0, savingsComparison_1.buildSavingsComparisonViewModel)(investigationRecommendation, (0, savings_1.calculateRecommendationSavings)(investigationRecord, investigationRecommendation));
    strict_1.default.equal(discountViewModel.grossRecoveredValueAzN, 4.71);
    strict_1.default.equal(discountViewModel.totalActionCostAzN, 2.54);
    strict_1.default.equal(discountViewModel.afterActionResidualLossAzN, 114.46);
    strict_1.default.equal(transferViewModel.totalActionCostAzN, 2.45);
    strict_1.default.equal(transferViewModel.afterActionResidualLossAzN, 0);
    strict_1.default.equal(investigationViewModel.grossRecoveredValueAzN, 0);
    strict_1.default.equal(investigationViewModel.netSavedValueAzN, 0);
    strict_1.default.ok(investigationViewModel.afterActionResidualLossAzN > 0);
});
(0, node_test_1.default)("shelf action savings are positive and more conservative than comparable discounts", () => {
    const discountRecord = getRequiredScoredRecord("yasamal", "butter-croissant");
    const discountRecommendation = (0, recommendationEngine_1.generateRecommendation)(discountRecord);
    const shelfRecord = getRequiredScoredRecord("may28", "butter-croissant");
    const shelfRecommendation = (0, recommendationEngine_1.generateRecommendation)(shelfRecord);
    strict_1.default.ok(discountRecommendation);
    strict_1.default.ok(shelfRecommendation);
    strict_1.default.equal(discountRecommendation.actionType, "discount");
    strict_1.default.equal(shelfRecommendation.actionType, "shelf-action");
    const discountSavings = (0, savings_1.calculateRecommendationSavings)(discountRecord, discountRecommendation);
    const shelfSavings = (0, savings_1.calculateRecommendationSavings)(shelfRecord, shelfRecommendation);
    strict_1.default.ok(shelfSavings.recoveredValueAzN > 0);
    strict_1.default.ok(discountSavings.recoveredValueAzN > shelfSavings.recoveredValueAzN);
    strict_1.default.equal(shelfSavings.netSavedValueAzN, shelfSavings.recoveredValueAzN);
});
(0, node_test_1.default)("reorder adjustment savings treat oversupply as future waste prevention", () => {
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(baseRecord);
    const record = withRisk({
        ...baseRecord,
        daysUntilEarliestExpiry: 9,
        daysOfStockRemaining: 16,
        totalStock: 64,
        stockValueAzN: 211.2,
        salesHistory: {
            ...baseRecord.salesHistory,
            avgDailySales: 4,
        },
        wasteHistory: {
            ...baseRecord.wasteHistory,
            previousWasteUnits: 7,
            categoryWasteRate: 0.16,
        },
    }, {
        totalScore: 52,
        roundedScore: 52,
        riskLevel: "medium",
    });
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "reorder-adjustment");
    const savings = (0, savings_1.calculateRecommendationSavings)(record, recommendation);
    strict_1.default.equal(savings.estimatedRecoveredUnits, 28.8);
    strict_1.default.equal(savings.estimatedWasteUnitsAvoided, 28.8);
    strict_1.default.equal(savings.possibleLossAzN, 109.44);
    strict_1.default.equal(savings.recoveredValueAzN, 109.44);
    strict_1.default.equal(savings.netSavedValueAzN, 109.44);
    strict_1.default.equal(savings.assumptions.reorderPreventionConfidence, 0.8);
});
(0, node_test_1.default)("investigation carries exposure without inventing monetized recovery", () => {
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(baseRecord);
    const record = withRisk({
        ...baseRecord,
        daysUntilEarliestExpiry: 3,
        daysOfStockRemaining: null,
        salesHistory: {
            ...baseRecord.salesHistory,
            avgDailySales: 0,
        },
    }, {
        totalScore: 64,
        roundedScore: 64,
        riskLevel: "high",
    });
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "investigation");
    const savings = (0, savings_1.calculateRecommendationSavings)(record, recommendation);
    strict_1.default.ok(savings.possibleLossAzN > 0);
    strict_1.default.equal(savings.recoveredValueAzN, 0);
    strict_1.default.equal(savings.netSavedValueAzN, 0);
    strict_1.default.equal(savings.estimatedRecoveredUnits, 0);
    strict_1.default.equal(savings.estimatedWasteUnitsAvoided, 0);
});
(0, node_test_1.default)("branch savings summary totals match the sum of attached recommendation savings", () => {
    const records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("ganjlik"));
    const recommendations = (0, recommendationEngine_1.generateRecommendationsForBranch)(records);
    const attached = recommendations.map((recommendation) => {
        const record = records.find((candidate) => candidate.branch.branchId === recommendation.branchId &&
            candidate.product.productId === recommendation.productId);
        strict_1.default.ok(record);
        return (0, savings_1.attachSavingsToRecommendation)(record, recommendation);
    });
    const summary = (0, savings_1.summarizeBranchSavings)(records, recommendations);
    const expectedTotals = attached.reduce((totals, entry) => ({
        possibleLossAzN: totals.possibleLossAzN + entry.savings.possibleLossAzN,
        recoveredValueAzN: totals.recoveredValueAzN + entry.savings.recoveredValueAzN,
        netSavedValueAzN: totals.netSavedValueAzN + entry.savings.netSavedValueAzN,
    }), {
        possibleLossAzN: 0,
        recoveredValueAzN: 0,
        netSavedValueAzN: 0,
    });
    strict_1.default.equal(summary.recommendationCount, recommendations.length);
    strict_1.default.equal(summary.totalPossibleLossAzN, Number(expectedTotals.possibleLossAzN.toFixed(2)));
    strict_1.default.equal(summary.totalRecoveredValueAzN, Number(expectedTotals.recoveredValueAzN.toFixed(2)));
    strict_1.default.equal(summary.totalNetSavedValueAzN, Number(expectedTotals.netSavedValueAzN.toFixed(2)));
    strict_1.default.equal(summary.breakdownByActionType.discount?.recommendationCount, 3);
    strict_1.default.equal(summary.breakdownByActionType.transfer?.recommendationCount, 1);
});
(0, node_test_1.default)("seeded branch summaries stay non-negative and rank ganjlik above may28 by net value", () => {
    const ganjlikRecords = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("ganjlik"));
    const may28Records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("may28"));
    const ganjlikSummary = (0, savings_1.summarizeBranchSavings)(ganjlikRecords, (0, recommendationEngine_1.generateRecommendationsForBranch)(ganjlikRecords));
    const may28Summary = (0, savings_1.summarizeBranchSavings)(may28Records, (0, recommendationEngine_1.generateRecommendationsForBranch)(may28Records));
    strict_1.default.ok(ganjlikSummary.totalPossibleLossAzN >= 0);
    strict_1.default.ok(ganjlikSummary.totalRecoveredValueAzN >= 0);
    strict_1.default.ok(ganjlikSummary.totalNetSavedValueAzN >= 0);
    strict_1.default.ok(may28Summary.totalPossibleLossAzN >= 0);
    strict_1.default.ok(may28Summary.totalRecoveredValueAzN >= 0);
    strict_1.default.ok(may28Summary.totalNetSavedValueAzN >= 0);
    strict_1.default.ok(ganjlikSummary.totalNetSavedValueAzN > may28Summary.totalNetSavedValueAzN);
});
