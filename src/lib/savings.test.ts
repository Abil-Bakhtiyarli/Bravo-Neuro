import test from "node:test";
import assert from "node:assert/strict";

import { getBranchProductRecord, getBranchProductRecords } from "./dataLoader";
import { generateRecommendation, generateRecommendationsForBranch } from "./recommendationEngine";
import { calculateWasteRisk, calculateWasteRiskForBranch } from "./riskScore";
import {
  attachSavingsToRecommendation,
  calculateRecommendationSavings,
  summarizeBranchSavings,
} from "./savings";
import type { ProductRiskAssessment, ScoredBranchProductRecord } from "./types";

function getRequiredScoredRecord(
  branchId: ScoredBranchProductRecord["branch"]["branchId"],
  productId: ScoredBranchProductRecord["product"]["productId"],
) {
  const record = getBranchProductRecord(branchId, productId);

  assert.ok(record, `Expected seeded record for ${branchId}:${productId}`);

  return {
    ...record,
    risk: calculateWasteRisk(record),
  };
}

function withRisk(
  record: Omit<ScoredBranchProductRecord, "risk">,
  risk: Partial<ProductRiskAssessment>,
): ScoredBranchProductRecord {
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

test("discount savings include markdown dilution and a lower net saved value", () => {
  const record = getRequiredScoredRecord("ganjlik", "greek-yogurt-500g");
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "discount");

  const savings = calculateRecommendationSavings(record, recommendation);

  assert.equal(savings.possibleLossAzN, 119.17);
  assert.equal(savings.recoveredValueAzN, 4.71);
  assert.equal(savings.netSavedValueAzN, 2.18);
  assert.equal(savings.costBreakdown.discountCostAzN, 2.54);
  assert.equal(savings.assumptions.discountedUnitPriceAzN, 3.19);
});

test("transfer savings recover full retail value minus transfer handling cost", () => {
  const record = getRequiredScoredRecord("ganjlik", "strawberries-250g");
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "transfer");

  const savings = calculateRecommendationSavings(record, recommendation);

  assert.equal(savings.possibleLossAzN, 39.2);
  assert.equal(savings.recoveredValueAzN, 39.2);
  assert.equal(savings.netSavedValueAzN, 36.75);
  assert.equal(savings.costBreakdown.transferCostAzN, 2.45);
});

test("shelf action savings are positive and more conservative than comparable discounts", () => {
  const discountRecord = getRequiredScoredRecord("yasamal", "butter-croissant");
  const discountRecommendation = generateRecommendation(discountRecord);
  const shelfRecord = getRequiredScoredRecord("may28", "butter-croissant");
  const shelfRecommendation = generateRecommendation(shelfRecord);

  assert.ok(discountRecommendation);
  assert.ok(shelfRecommendation);
  assert.equal(discountRecommendation.actionType, "discount");
  assert.equal(shelfRecommendation.actionType, "shelf-action");

  const discountSavings = calculateRecommendationSavings(discountRecord, discountRecommendation);
  const shelfSavings = calculateRecommendationSavings(shelfRecord, shelfRecommendation);

  assert.ok(shelfSavings.recoveredValueAzN > 0);
  assert.ok(discountSavings.recoveredValueAzN > shelfSavings.recoveredValueAzN);
  assert.equal(shelfSavings.netSavedValueAzN, shelfSavings.recoveredValueAzN);
});

test("reorder adjustment savings treat oversupply as future waste prevention", () => {
  const baseRecord = getBranchProductRecord("ganjlik", "orange-juice-1l");

  assert.ok(baseRecord);

  const record = withRisk(
    {
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
    },
    {
      totalScore: 52,
      roundedScore: 52,
      riskLevel: "medium",
    },
  );
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "reorder-adjustment");

  const savings = calculateRecommendationSavings(record, recommendation);

  assert.equal(savings.estimatedRecoveredUnits, 28.8);
  assert.equal(savings.estimatedWasteUnitsAvoided, 28.8);
  assert.equal(savings.possibleLossAzN, 109.44);
  assert.equal(savings.recoveredValueAzN, 109.44);
  assert.equal(savings.netSavedValueAzN, 109.44);
  assert.equal(savings.assumptions.reorderPreventionConfidence, 0.8);
});

test("investigation carries exposure without inventing monetized recovery", () => {
  const baseRecord = getBranchProductRecord("ganjlik", "orange-juice-1l");

  assert.ok(baseRecord);

  const record = withRisk(
    {
      ...baseRecord,
      daysUntilEarliestExpiry: 3,
      daysOfStockRemaining: null,
      salesHistory: {
        ...baseRecord.salesHistory,
        avgDailySales: 0,
      },
    },
    {
      totalScore: 64,
      roundedScore: 64,
      riskLevel: "high",
    },
  );
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "investigation");

  const savings = calculateRecommendationSavings(record, recommendation);

  assert.ok(savings.possibleLossAzN > 0);
  assert.equal(savings.recoveredValueAzN, 0);
  assert.equal(savings.netSavedValueAzN, 0);
  assert.equal(savings.estimatedRecoveredUnits, 0);
  assert.equal(savings.estimatedWasteUnitsAvoided, 0);
});

test("branch savings summary totals match the sum of attached recommendation savings", () => {
  const records = calculateWasteRiskForBranch(getBranchProductRecords("ganjlik"));
  const recommendations = generateRecommendationsForBranch(records);
  const attached = recommendations.map((recommendation) => {
    const record = records.find(
      (candidate) =>
        candidate.branch.branchId === recommendation.branchId &&
        candidate.product.productId === recommendation.productId,
    );

    assert.ok(record);
    return attachSavingsToRecommendation(record, recommendation);
  });

  const summary = summarizeBranchSavings(records, recommendations);
  const expectedTotals = attached.reduce(
    (totals, entry) => ({
      possibleLossAzN: totals.possibleLossAzN + entry.savings.possibleLossAzN,
      recoveredValueAzN: totals.recoveredValueAzN + entry.savings.recoveredValueAzN,
      netSavedValueAzN: totals.netSavedValueAzN + entry.savings.netSavedValueAzN,
    }),
    {
      possibleLossAzN: 0,
      recoveredValueAzN: 0,
      netSavedValueAzN: 0,
    },
  );

  assert.equal(summary.recommendationCount, recommendations.length);
  assert.equal(summary.totalPossibleLossAzN, Number(expectedTotals.possibleLossAzN.toFixed(2)));
  assert.equal(summary.totalRecoveredValueAzN, Number(expectedTotals.recoveredValueAzN.toFixed(2)));
  assert.equal(summary.totalNetSavedValueAzN, Number(expectedTotals.netSavedValueAzN.toFixed(2)));
  assert.equal(summary.breakdownByActionType.discount?.recommendationCount, 3);
  assert.equal(summary.breakdownByActionType.transfer?.recommendationCount, 1);
});

test("seeded branch summaries stay non-negative and rank ganjlik above may28 by net value", () => {
  const ganjlikRecords = calculateWasteRiskForBranch(getBranchProductRecords("ganjlik"));
  const may28Records = calculateWasteRiskForBranch(getBranchProductRecords("may28"));
  const ganjlikSummary = summarizeBranchSavings(
    ganjlikRecords,
    generateRecommendationsForBranch(ganjlikRecords),
  );
  const may28Summary = summarizeBranchSavings(
    may28Records,
    generateRecommendationsForBranch(may28Records),
  );

  assert.ok(ganjlikSummary.totalPossibleLossAzN >= 0);
  assert.ok(ganjlikSummary.totalRecoveredValueAzN >= 0);
  assert.ok(ganjlikSummary.totalNetSavedValueAzN >= 0);
  assert.ok(may28Summary.totalPossibleLossAzN >= 0);
  assert.ok(may28Summary.totalRecoveredValueAzN >= 0);
  assert.ok(may28Summary.totalNetSavedValueAzN >= 0);
  assert.ok(ganjlikSummary.totalNetSavedValueAzN > may28Summary.totalNetSavedValueAzN);
});
