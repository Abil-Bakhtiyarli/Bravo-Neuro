"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const dataLoader_1 = require("./dataLoader");
const explanation_1 = require("./explanation");
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
function buildDriver(key, rawScore, weightedContribution) {
    return {
        key,
        label: key,
        rawScore,
        weight: weightedContribution === 0 ? 0 : Number((weightedContribution / rawScore).toFixed(2)),
        weightedContribution,
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
(0, node_test_1.default)("discount explanations stay deterministic for the seeded Greek yogurt case", () => {
    const record = getRequiredScoredRecord("ganjlik", "greek-yogurt-500g");
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "discount");
    const explanation = (0, explanation_1.generateRecommendationExplanation)(record, recommendation);
    strict_1.default.equal(explanation.summary, "Risk is critical for Greek Yogurt 500g. Greek Yogurt 500g is risky because expires in 1 day, and is overstocked: stock covers 7.5 days, or 7.5x the clearance window, and is not selling fast enough: current sales average 4/day versus 30/day needed to clear before expiry.");
    strict_1.default.deepEqual(explanation.driverHighlights, [
        "Greek Yogurt 500g expires in 1 day.",
        "Greek Yogurt 500g is overstocked: stock covers 7.5 days, or 7.5x the clearance window.",
        "Greek Yogurt 500g is not selling fast enough: current sales average 4/day versus 30/day needed to clear before expiry.",
    ]);
    strict_1.default.equal(explanation.recommendationRationale, "This action is recommended because the product faces near-term expiry pressure and a 35% discount is the fastest way to improve sell-through. If sell-through stays below the 30-unit target by tomorrow, raise it to 45%.");
});
(0, node_test_1.default)("transfer explanations mention the faster destination branch and quantity", () => {
    const record = getRequiredScoredRecord("ganjlik", "strawberries-250g");
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "transfer");
    const explanation = (0, explanation_1.generateRecommendationExplanation)(record, recommendation);
    strict_1.default.ok(explanation.driverHighlights.some((highlight) => highlight.includes("1.8x the clearance window")));
    strict_1.default.ok(explanation.recommendationRationale.includes("Bravo 28 May"));
    strict_1.default.ok(explanation.recommendationRationale.includes("1.67x faster"));
    strict_1.default.ok(explanation.recommendationRationale.includes("7 units"));
});
(0, node_test_1.default)("shelf-action explanations mention the target placement", () => {
    const record = getRequiredScoredRecord("yasamal", "fresh-spinach-200g");
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "shelf-action");
    const explanation = (0, explanation_1.generateRecommendationExplanation)(record, recommendation);
    strict_1.default.ok(explanation.summary.includes("Risk is medium"));
    strict_1.default.ok(explanation.recommendationRationale.includes("promo endcap"));
});
(0, node_test_1.default)("reorder-adjustment explanations mention stock coverage and the chosen action", () => {
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(baseRecord);
    const record = withRisk({
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
    }, {
        totalScore: 52,
        roundedScore: 52,
        riskLevel: "medium",
        mainDrivers: [
            buildDriver("stock-pressure", 88, 22),
            buildDriver("historical-waste", 55, 5.5),
            buildDriver("sales-weakness", 15, 3),
        ],
    });
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "reorder-adjustment");
    const explanation = (0, explanation_1.generateRecommendationExplanation)(record, recommendation);
    strict_1.default.ok(explanation.driverHighlights[0]?.includes("stock covers 16 days"));
    strict_1.default.ok(explanation.recommendationRationale.includes("paused"));
});
(0, node_test_1.default)("investigation explanations explicitly call for verification when data is unusable", () => {
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
        mainDrivers: [
            buildDriver("stock-pressure", 100, 25),
            buildDriver("sales-weakness", 100, 20),
            buildDriver("expiry-urgency", 70, 24.5),
        ],
    });
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    strict_1.default.equal(recommendation.actionType, "investigation");
    const explanation = (0, explanation_1.generateRecommendationExplanation)(record, recommendation);
    strict_1.default.ok(explanation.driverHighlights[0]?.includes("stock coverage cannot be trusted"));
    strict_1.default.ok(explanation.recommendationRationale.includes("manager verification"));
});
(0, node_test_1.default)("explanations use only the top two drivers when the third one has zero contribution", () => {
    const baseRecord = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "orange-juice-1l");
    strict_1.default.ok(baseRecord);
    const record = withRisk(baseRecord, {
        totalScore: 42,
        roundedScore: 42,
        riskLevel: "medium",
        mainDrivers: [
            buildDriver("expiry-urgency", 55, 19.25),
            buildDriver("sales-weakness", 45, 9),
            buildDriver("historical-waste", 0, 0),
        ],
    });
    const recommendation = {
        branchId: record.branch.branchId,
        productId: record.product.productId,
        branchName: record.branch.branchName,
        productName: record.product.name,
        riskScore: record.risk.roundedScore,
        riskLevel: record.risk.riskLevel,
        actionType: "shelf-action",
        summary: "placeholder",
        reasonCodes: ["near-expiry", "visibility-boost"],
        targetPlacement: "front shelf",
    };
    const explanation = (0, explanation_1.generateRecommendationExplanation)(record, recommendation);
    strict_1.default.equal(explanation.driverHighlights.length, 2);
});
(0, node_test_1.default)("batch explanation attachment stays aligned with seeded branch recommendations", () => {
    const records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("ganjlik"));
    const recommendations = (0, recommendationEngine_1.generateRecommendationsForBranch)(records);
    const attached = (0, explanation_1.attachExplanationsToRecommendations)(records, recommendations);
    strict_1.default.equal(attached.length, recommendations.length);
    strict_1.default.equal(attached[0]?.recommendation.productId, recommendations[0]?.productId);
    strict_1.default.ok(attached.every((entry) => entry.explanation.summary.length > 0));
});
(0, node_test_1.default)("batch explanation attachment throws on a missing scored record", () => {
    const records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)("ganjlik"));
    const recommendations = (0, recommendationEngine_1.generateRecommendationsForBranch)(records);
    const mismatchedRecommendation = {
        ...recommendations[0],
        productId: "missing-product",
    };
    strict_1.default.throws(() => (0, explanation_1.attachExplanationsToRecommendations)(records, [mismatchedRecommendation]), /Missing scored record for recommendation ganjlik:missing-product/);
});
(0, node_test_1.default)("single explanation attachment returns the recommendation and explanation together", () => {
    const record = getRequiredScoredRecord("ganjlik", "strawberries-250g");
    const recommendation = (0, recommendationEngine_1.generateRecommendation)(record);
    strict_1.default.ok(recommendation);
    const attached = (0, explanation_1.attachExplanationToRecommendation)(record, recommendation);
    strict_1.default.equal(attached.recommendation, recommendation);
    strict_1.default.ok(attached.explanation.recommendationRationale.length > 0);
});
