import test from "node:test";
import assert from "node:assert/strict";

import { getBranchProductRecord, getBranchProductRecords } from "./dataLoader";
import { generateRecommendation, generateRecommendationsForBranch } from "./recommendationEngine";
import type { ProductRiskAssessment, ScoredBranchProductRecord } from "./types";
import { calculateWasteRisk, calculateWasteRiskForBranch } from "./riskScore";

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

test("ganjlik Greek yogurt gets a discount recommendation with a 35 percent base discount", () => {
  const recommendation = generateRecommendation(
    getRequiredScoredRecord("ganjlik", "greek-yogurt-500g"),
  );

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "discount");
  assert.equal(recommendation.discountPercent, 35);
  assert.equal(recommendation.fallbackDiscountPercent, 45);
});

test("ganjlik strawberries recommend a transfer to may28", () => {
  const recommendation = generateRecommendation(
    getRequiredScoredRecord("ganjlik", "strawberries-250g"),
  );

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "transfer");
  assert.equal(recommendation.destinationBranchId, "may28");
  assert.equal(recommendation.transferQuantity, 7);
});

test("yasamal fresh spinach falls back to a shelf action", () => {
  const recommendation = generateRecommendation(
    getRequiredScoredRecord("yasamal", "fresh-spinach-200g"),
  );

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "shelf-action");
  assert.equal(recommendation.targetPlacement, "promo endcap");
});

test("ganjlik orange juice stays recommendation-free because it is low risk", () => {
  const recommendation = generateRecommendation(
    getRequiredScoredRecord("ganjlik", "orange-juice-1l"),
  );

  assert.equal(recommendation, undefined);
});

test("reorder recommendation can reduce the next order for oversupply cases", () => {
  const baseRecord = getBranchProductRecord("ganjlik", "orange-juice-1l");

  assert.ok(baseRecord);

  const recommendation = generateRecommendation(
    withRisk(
      {
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
      },
      {
        totalScore: 48,
        roundedScore: 48,
        riskLevel: "medium",
      },
    ),
  );

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "reorder-adjustment");
  assert.equal(recommendation.adjustment, "reduce");
  assert.equal(recommendation.suggestedOrderMultiplier, 0.75);
});

test("reorder recommendation can pause the next order for extreme oversupply", () => {
  const baseRecord = getBranchProductRecord("ganjlik", "orange-juice-1l");

  assert.ok(baseRecord);

  const recommendation = generateRecommendation(
    withRisk(
      {
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
      },
      {
        totalScore: 52,
        roundedScore: 52,
        riskLevel: "medium",
      },
    ),
  );

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "reorder-adjustment");
  assert.equal(recommendation.adjustment, "pause");
  assert.equal(recommendation.suggestedOrderMultiplier, 0);
});

test("investigation wins when sales inputs are unusable", () => {
  const baseRecord = getBranchProductRecord("ganjlik", "orange-juice-1l");

  assert.ok(baseRecord);

  const recommendation = generateRecommendation(
    withRisk(
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
    ),
  );

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "investigation");
  assert.ok(recommendation.reasonCodes.includes("data-conflict"));
});

test("branch recommendations return exactly one action per eligible seeded record", () => {
  const records = calculateWasteRiskForBranch(getBranchProductRecords("ganjlik"));
  const recommendations = generateRecommendationsForBranch(records);

  const eligibleRecords = records.filter((record) =>
    ["medium", "high", "critical"].includes(record.risk.riskLevel),
  );

  assert.equal(recommendations.length, eligibleRecords.length);
  assert.equal(new Set(recommendations.map((item) => item.productId)).size, recommendations.length);
});

test("branch recommendations stay sorted by urgency, then score, then expiry", () => {
  const records = calculateWasteRiskForBranch(getBranchProductRecords("ganjlik"));
  const recommendations = generateRecommendationsForBranch(records);
  const riskPriority = {
    critical: 3,
    high: 2,
    medium: 1,
    low: 0,
  } as const;

  assert.ok(recommendations.length > 0);

  for (let index = 0; index < recommendations.length - 1; index += 1) {
    const current = recommendations[index];
    const next = recommendations[index + 1];
    const currentRecord = records.find((record) => record.product.productId === current.productId);
    const nextRecord = records.find((record) => record.product.productId === next.productId);

    assert.ok(currentRecord);
    assert.ok(nextRecord);

    const currentPriority = riskPriority[currentRecord.risk.riskLevel];
    const nextPriority = riskPriority[nextRecord.risk.riskLevel];

    assert.ok(currentPriority >= nextPriority);

    if (currentPriority === nextPriority) {
      assert.ok(currentRecord.risk.roundedScore >= nextRecord.risk.roundedScore);

      if (currentRecord.risk.roundedScore === nextRecord.risk.roundedScore) {
        assert.ok(currentRecord.daysUntilEarliestExpiry <= nextRecord.daysUntilEarliestExpiry);
      }
    }
  }
});
