"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardDataError = void 0;
exports.getAvailableBranchOptions = getAvailableBranchOptions;
exports.getDashboardData = getDashboardData;
exports.getProductDetailData = getProductDetailData;
const dataLoader_1 = require("./dataLoader");
const actionPlan_1 = require("./actionPlan");
const explanation_1 = require("./explanation");
const recommendationEngine_1 = require("./recommendationEngine");
const riskScore_1 = require("./riskScore");
const savings_1 = require("./savings");
const seedData_1 = require("./seedData");
class DashboardDataError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "DashboardDataError";
        this.code = code;
    }
}
exports.DashboardDataError = DashboardDataError;
function createLookupKey(branchId, productId) {
    return `${branchId}:${productId}`;
}
function toGeneratedAt(referenceDate) {
    const timestamp = Date.parse(`${referenceDate}T00:00:00.000Z`);
    if (!Number.isFinite(timestamp)) {
        throw new Error(`Invalid referenceDate: ${referenceDate}`);
    }
    return new Date(timestamp).toISOString();
}
function getReferenceDate(options) {
    return options?.referenceDate ?? seedData_1.SEED_REFERENCE_DATE;
}
function getBranchOrThrow(branchId) {
    const branch = (0, dataLoader_1.getAvailableBranches)().find((item) => item.branchId === branchId);
    if (!branch) {
        throw new DashboardDataError("UNKNOWN_BRANCH", `Unknown branchId: ${branchId}`);
    }
    return branch;
}
function buildRecommendationEntries(records) {
    const recordsByLookup = new Map(records.map((record) => [record.lookupKey, record]));
    return (0, recommendationEngine_1.generateRecommendationsForBranch)(records).map((recommendation) => {
        const lookupKey = createLookupKey(recommendation.branchId, recommendation.productId);
        const record = recordsByLookup.get(lookupKey);
        if (!record) {
            throw new Error(`Missing scored record for recommendation ${lookupKey}`);
        }
        const { savings } = (0, savings_1.attachSavingsToRecommendation)(record, recommendation);
        const { explanation } = (0, explanation_1.attachExplanationToRecommendation)(record, recommendation);
        return {
            lookupKey,
            record,
            recommendation,
            savings,
            explanation,
        };
    });
}
function buildBranchDashboardBundle(branchId, options) {
    const branch = getBranchOrThrow(branchId);
    const records = (0, riskScore_1.calculateWasteRiskForBranch)((0, dataLoader_1.getBranchProductRecords)(branchId, options));
    return {
        branch,
        generatedAt: toGeneratedAt(getReferenceDate(options)),
        records,
        recommendationEntries: buildRecommendationEntries(records),
    };
}
function buildKpis(recommendationEntries, records) {
    const recommendations = recommendationEntries.map((entry) => entry.recommendation);
    const summary = (0, savings_1.summarizeBranchSavings)(records, recommendations);
    return [
        {
            key: "possible-loss",
            label: "Possible waste",
            value: summary.totalPossibleLossAzN,
            unit: "azn",
        },
        {
            key: "recoverable-value",
            label: "Recoverable value",
            value: summary.totalRecoveredValueAzN,
            unit: "azn",
        },
        {
            key: "net-saved-value",
            label: "Net saved value",
            value: summary.totalNetSavedValueAzN,
            unit: "azn",
        },
        {
            key: "risky-products",
            label: "Risky products",
            value: recommendationEntries.length,
            unit: "count",
        },
        {
            key: "tasks-today",
            label: "Tasks today",
            value: recommendationEntries.length,
            unit: "count",
        },
    ];
}
function buildRiskTableItem(entry) {
    return {
        branchId: entry.record.branch.branchId,
        productId: entry.record.product.productId,
        productName: entry.record.product.name,
        category: entry.record.product.category,
        riskLevel: entry.record.risk.riskLevel,
        riskScore: entry.record.risk.roundedScore,
        daysUntilExpiry: entry.record.daysUntilEarliestExpiry,
        totalStock: entry.record.totalStock,
        daysOfStockRemaining: entry.record.daysOfStockRemaining,
        actionType: entry.recommendation.actionType,
        recommendationSummary: entry.recommendation.summary,
        netSavedValueAzN: entry.savings.netSavedValueAzN,
        possibleLossAzN: entry.savings.possibleLossAzN,
    };
}
function buildActionPlanItem(entry) {
    return {
        taskId: `${entry.record.branch.branchId}:${entry.record.product.productId}:${entry.recommendation.actionType}`,
        branchId: entry.record.branch.branchId,
        productId: entry.record.product.productId,
        productName: entry.record.product.name,
        priorityRank: 0,
        actionType: entry.recommendation.actionType,
        riskLevel: entry.record.risk.riskLevel,
        riskScore: entry.record.risk.roundedScore,
        daysUntilExpiry: entry.record.daysUntilEarliestExpiry,
        status: "pending",
        summary: entry.recommendation.summary,
        checklistSteps: (0, actionPlan_1.buildActionPlanChecklistSteps)(entry.recommendation, entry.record.daysUntilEarliestExpiry),
        expectedNetSavedValueAzN: entry.savings.netSavedValueAzN,
        expectedRecoveredValueAzN: entry.savings.recoveredValueAzN,
    };
}
function buildProductDetailData(record, generatedAt, detailEntry) {
    return {
        branch: record.branch,
        product: record.product,
        generatedAt,
        totalStock: record.totalStock,
        stockValueAzN: record.stockValueAzN,
        lotCount: record.lotCount,
        earliestExpiryDate: record.earliestExpiryDate,
        latestExpiryDate: record.latestExpiryDate,
        daysUntilEarliestExpiry: record.daysUntilEarliestExpiry,
        daysOfStockRemaining: record.daysOfStockRemaining,
        risk: record.risk,
        inventoryLots: record.inventoryLots,
        recommendation: detailEntry?.recommendation ?? null,
        savings: detailEntry?.savings ?? null,
        explanation: detailEntry?.explanation ?? null,
    };
}
function buildProductDetailsById(recommendationEntries, generatedAt) {
    return recommendationEntries.reduce((accumulator, entry) => {
        accumulator[entry.record.product.productId] = buildProductDetailData(entry.record, generatedAt, entry);
        return accumulator;
    }, {});
}
function getAvailableBranchOptions() {
    return (0, dataLoader_1.getAvailableBranches)();
}
function getDashboardData(branchId, options) {
    const bundle = buildBranchDashboardBundle(branchId, options);
    return {
        branch: bundle.branch,
        generatedAt: bundle.generatedAt,
        kpis: buildKpis(bundle.recommendationEntries, bundle.records),
        riskTable: bundle.recommendationEntries.map(buildRiskTableItem),
        actionPlan: (0, actionPlan_1.rankActionPlanItems)(bundle.recommendationEntries.map(buildActionPlanItem)),
        topProductIds: bundle.recommendationEntries.map((entry) => entry.record.product.productId),
        productDetailsById: buildProductDetailsById(bundle.recommendationEntries, bundle.generatedAt),
    };
}
function getProductDetailData(branchId, productId, options) {
    getBranchOrThrow(branchId);
    const record = (0, dataLoader_1.getBranchProductRecord)(branchId, productId, options);
    if (!record) {
        throw new DashboardDataError("UNKNOWN_PRODUCT", `Unknown productId for branch ${branchId}: ${productId}`);
    }
    const scoredRecord = {
        ...record,
        risk: (0, riskScore_1.calculateWasteRisk)(record),
    };
    const bundle = buildBranchDashboardBundle(branchId, options);
    const detailEntry = bundle.recommendationEntries.find((entry) => entry.record.product.productId === productId);
    return buildProductDetailData(scoredRecord, bundle.generatedAt, detailEntry);
}
