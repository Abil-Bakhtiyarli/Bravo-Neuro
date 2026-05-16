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
(0, node_test_1.default)("ganjlik Greek yogurt gets a discount recommendation with a 35 percent base discount", () => {
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(getRequiredScoredRecord("ganjlik", "greek-yogurt-500g"));
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "discount");
    strict_1.default.equal(recommendation.discountPercent, 35);
    strict_1.default.equal(recommendation.fallbackDiscountPercent, 45);
});
(0, node_test_1.default)("ganjlik strawberries recommend a transfer to may28", () => {
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(getRequiredScoredRecord("ganjlik", "strawberries-250g"));
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "transfer");
    strict_1.default.equal(recommendation.destinationBranchId, "may28");
    strict_1.default.equal(recommendation.transferQuantity, 7);
});
(0, node_test_1.default)("yasamal fresh spinach falls back to a shelf action", () => {
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(getRequiredScoredRecord("yasamal", "fresh-spinach-200g"));
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "shelf-action");
    strict_1.default.equal(recommendation.targetPlacement, "promo endcap");
});
(0, node_test_1.default)("ganjlik orange juice stays recommendation-free because it is low risk", () => {
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(getRequiredScoredRecord("ganjlik", "orange-juice-1l"));
    strict_1.default.equal(recommendation, undefined);
});
(0, node_test_1.default)("reorder recommendation can reduce the next order for oversupply cases", () => {
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(baseRecord);
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(withRisk({
        ...baseRecord,
        daysUntilEarliestExpiry: 8,
        daysOfStockRemaining: 11,
        salesHistory: {
            ...baseRecord.salesHistory,
            avgDailySales: 4,
        },
        wasteHistory: {
            ...baseRecord.wasteHistory,
            previousWasteUnits: 6,
            categoryWasteRate: 0.14,
        },
        crossBranchSales: baseRecord.crossBranchSales.map((snapshot) => ({
            ...snapshot,
            avgDailySales: Math.min(snapshot.avgDailySales, 4.5),
        })),
    }, {
        totalScore: 48,
        roundedScore: 48,
        riskLevel: "medium",
    }));
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "reorder-adjustment");
    strict_1.default.equal(recommendation.adjustment, "reduce");
    strict_1.default.equal(recommendation.suggestedOrderMultiplier, 0.75);
});
(0, node_test_1.default)("reorder recommendation can pause the next order for extreme oversupply", () => {
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(baseRecord);
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(withRisk({
        ...baseRecord,
        daysUntilEarliestExpiry: 9,
        daysOfStockRemaining: 16,
        salesHistory: {
            ...baseRecord.salesHistory,
            avgDailySales: 4,
        },
        wasteHistory: {
            ...baseRecord.wasteHistory,
            previousWasteUnits: 7,
            categoryWasteRate: 0.16,
        },
        crossBranchSales: baseRecord.crossBranchSales.map((snapshot) => ({
            ...snapshot,
            avgDailySales: Math.min(snapshot.avgDailySales, 5),
        })),
    }, {
        totalScore: 52,
        roundedScore: 52,
        riskLevel: "medium",
    }));
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "reorder-adjustment");
    strict_1.default.equal(recommendation.adjustment, "pause");
    strict_1.default.equal(recommendation.suggestedOrderMultiplier, 0);
});
(0, node_test_1.default)("investigation wins when sales inputs are unusable", () => {
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(baseRecord);
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(withRisk({
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
    }));
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "investigation");
    strict_1.default.ok(recommendation.reasonCodes.includes("data-conflict"));
});
(0, node_test_1.default)("branch recommendations return exactly one action per eligible seeded record", () => {
    const records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("ganjlik"));
    const recommendations = (0, recommendationEngine_1.generateRecommendationsForBranch)(records);
    const eligibleRecords = records.filter((record) => ["medium", "high", "critical"].includes(record.risk.riskLevel));
    strict_1.default.equal(recommendations.length, eligibleRecords.length);
    strict_1.default.equal(new Set(recommendations.map((item) => item.productId)).size, recommendations.length);
});
(0, node_test_1.default)("branch recommendations stay sorted by urgency, then score, then expiry", () => {
    const records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("ganjlik"));
    const recommendations = (0, recommendationEngine_1.generateRecommendationsForBranch)(records);
    strict_1.default.deepEqual(recommendations.map((item) => `${item.productId}:${item.actionType}`), [
        "greek-yogurt-500g:discount",
        "butter-croissant:discount",
        "sourdough-bread:discount",
        "strawberries-250g:transfer",
    ]);
});
