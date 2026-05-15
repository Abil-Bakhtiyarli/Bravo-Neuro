import test from "node:test";
import assert from "node:assert/strict";

import { getBranchProductRecord, getBranchProductRecords } from "./dataLoader";
import {
  attachExplanationToRecommendation,
  attachExplanationsToRecommendations,
  generateRecommendationExplanation,
} from "./explanation";
import { generateRecommendation, generateRecommendationsForBranch } from "./recommendationEngine";
import { calculateWasteRisk, calculateWasteRiskForBranch } from "./riskScore";
import type {
  ProductRiskAssessment,
  RiskComponentScore,
  ScoredBranchProductRecord,
} from "./types";

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

function buildDriver(
  key: RiskComponentScore["key"],
  rawScore: number,
  weightedContribution: number,
): RiskComponentScore {
  return {
    key,
    label: key,
    rawScore,
    weight: weightedContribution === 0 ? 0 : Number((weightedContribution / rawScore).toFixed(2)),
    weightedContribution,
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

test("discount explanations stay deterministic for the seeded Greek yogurt case", () => {
  const record = getRequiredScoredRecord("ganjlik", "greek-yogurt-500g");
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "discount");

  const explanation = generateRecommendationExplanation(record, recommendation);

  assert.equal(
    explanation.summary,
    "Risk is critical for Greek Yogurt 500g. Greek Yogurt 500g is risky because expires in 1 day, and is overstocked: stock covers 11.67 days, or 11.7x the clearance window, and is not selling fast enough: current sales average 1.2/day versus 14/day needed to clear before expiry.",
  );
  assert.deepEqual(explanation.driverHighlights, [
    "Greek Yogurt 500g expires in 1 day.",
    "Greek Yogurt 500g is overstocked: stock covers 11.67 days, or 11.7x the clearance window.",
    "Greek Yogurt 500g is not selling fast enough: current sales average 1.2/day versus 14/day needed to clear before expiry.",
  ]);
  assert.equal(
    explanation.recommendationRationale,
    "This action is recommended because the product faces near-term expiry pressure and a 35% discount is the fastest way to improve sell-through. If sell-through stays below the 14-unit target by tomorrow, raise it to 45%.",
  );
});

test("transfer explanations mention the faster destination branch and quantity", () => {
  const record = getRequiredScoredRecord("ganjlik", "strawberries-250g");
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "transfer");

  const explanation = generateRecommendationExplanation(record, recommendation);

  assert.ok(
    explanation.driverHighlights.some((highlight) => highlight.includes("Bravo 28 May sells this product 1.8x faster")),
  );
  assert.ok(explanation.recommendationRationale.includes("Bravo 28 May"));
  assert.ok(explanation.recommendationRationale.includes("7 units"));
});

test("shelf-action explanations mention the target placement", () => {
  const record = getRequiredScoredRecord("yasamal", "fresh-spinach-200g");
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "shelf-action");

  const explanation = generateRecommendationExplanation(record, recommendation);

  assert.ok(explanation.summary.includes("Risk is medium"));
  assert.ok(explanation.recommendationRationale.includes("promo endcap"));
});

test("reorder-adjustment explanations mention stock coverage and the chosen action", () => {
  const baseRecord = getBranchProductRecord("ganjlik", "orange-juice-1l");

  assert.ok(baseRecord);

  const record = withRisk(
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
    },
    {
      totalScore: 52,
      roundedScore: 52,
      riskLevel: "medium",
      mainDrivers: [
        buildDriver("stock-pressure", 88, 22),
        buildDriver("historical-waste", 55, 5.5),
        buildDriver("sales-weakness", 15, 3),
      ],
    },
  );
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "reorder-adjustment");

  const explanation = generateRecommendationExplanation(record, recommendation);

  assert.ok(explanation.driverHighlights[0]?.includes("stock covers 16 days"));
  assert.ok(explanation.recommendationRationale.includes("paused"));
});

test("investigation explanations explicitly call for verification when data is unusable", () => {
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
      mainDrivers: [
        buildDriver("stock-pressure", 100, 25),
        buildDriver("sales-weakness", 100, 20),
        buildDriver("expiry-urgency", 70, 24.5),
      ],
    },
  );
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);
  assert.equal(recommendation.actionType, "investigation");

  const explanation = generateRecommendationExplanation(record, recommendation);

  assert.ok(explanation.driverHighlights[0]?.includes("stock coverage cannot be trusted"));
  assert.ok(explanation.recommendationRationale.includes("manager verification"));
});

test("explanations use only the top two drivers when the third one has zero contribution", () => {
  const baseRecord = getBranchProductRecord("ganjlik", "orange-juice-1l");

  assert.ok(baseRecord);

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
    actionType: "shelf-action" as const,
    summary: "placeholder",
    reasonCodes: ["near-expiry", "visibility-boost"] as const,
    targetPlacement: "front shelf" as const,
  };

  const explanation = generateRecommendationExplanation(record, recommendation);

  assert.equal(explanation.driverHighlights.length, 2);
});

test("batch explanation attachment stays aligned with seeded branch recommendations", () => {
  const records = calculateWasteRiskForBranch(getBranchProductRecords("ganjlik"));
  const recommendations = generateRecommendationsForBranch(records);
  const attached = attachExplanationsToRecommendations(records, recommendations);

  assert.equal(attached.length, recommendations.length);
  assert.equal(attached[0]?.recommendation.productId, recommendations[0]?.productId);
  assert.ok(attached.every((entry) => entry.explanation.summary.length > 0));
});

test("batch explanation attachment throws on a missing scored record", () => {
  const records = calculateWasteRiskForBranch(getBranchProductRecords("ganjlik"));
  const recommendations = generateRecommendationsForBranch(records);
  const mismatchedRecommendation = {
    ...recommendations[0],
    productId: "missing-product",
  };

  assert.throws(
    () => attachExplanationsToRecommendations(records, [mismatchedRecommendation]),
    /Missing scored record for recommendation ganjlik:missing-product/,
  );
});

test("single explanation attachment returns the recommendation and explanation together", () => {
  const record = getRequiredScoredRecord("ganjlik", "strawberries-250g");
  const recommendation = generateRecommendation(record);

  assert.ok(recommendation);

  const attached = attachExplanationToRecommendation(record, recommendation);

  assert.equal(attached.recommendation, recommendation);
  assert.ok(attached.explanation.recommendationRationale.length > 0);
});
