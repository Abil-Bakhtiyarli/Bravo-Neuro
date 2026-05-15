import test from "node:test";
import assert from "node:assert/strict";

import { getBranchProductRecord, getBranchProductRecords } from "./dataLoader";
import { calculateWasteRisk, calculateWasteRiskForBranch, getRiskLevel } from "./riskScore";
import type { EnrichedBranchProductRecord, RiskLevel } from "./types";

function getRequiredRecord(
  branchId: EnrichedBranchProductRecord["branch"]["branchId"],
  productId: EnrichedBranchProductRecord["product"]["productId"],
) {
  const record = getBranchProductRecord(branchId, productId);

  assert.ok(record, `Expected seeded record for ${branchId}:${productId}`);

  return record;
}

test("risk level mapping matches the documented thresholds", () => {
  const cases: Array<{ score: number; expected: RiskLevel }> = [
    { score: 34, expected: "low" },
    { score: 35, expected: "medium" },
    { score: 59, expected: "medium" },
    { score: 60, expected: "high" },
    { score: 79, expected: "high" },
    { score: 80, expected: "critical" },
  ];

  for (const testCase of cases) {
    assert.equal(getRiskLevel(testCase.score), testCase.expected);
  }
});

test("component scores are clamped and contributions sum to the total score", () => {
  const record = getRequiredRecord("ganjlik", "greek-yogurt-500g");
  const assessment = calculateWasteRisk(record);

  for (const componentScore of assessment.componentScores) {
    assert.ok(componentScore.rawScore >= 0);
    assert.ok(componentScore.rawScore <= 100);
  }

  const summedContribution = assessment.componentScores.reduce(
    (sum, componentScore) => sum + componentScore.weightedContribution,
    0,
  );

  assert.ok(Math.abs(summedContribution - assessment.totalScore) < 0.01);
});

test("main drivers stay sorted by weighted contribution and then raw score", () => {
  const record = getRequiredRecord("ganjlik", "greek-yogurt-500g");
  const assessment = calculateWasteRisk(record);

  assert.equal(assessment.mainDrivers.length, 3);

  for (let index = 1; index < assessment.componentScores.length; index += 1) {
    const previous = assessment.componentScores[index - 1];
    const current = assessment.componentScores[index];

    assert.ok(
      previous.weightedContribution > current.weightedContribution ||
        (previous.weightedContribution === current.weightedContribution &&
          previous.rawScore >= current.rawScore),
    );
  }
});

test("calculateWasteRiskForBranch returns a risk assessment for every record", () => {
  const records = getBranchProductRecords("ganjlik");
  const scoredRecords = calculateWasteRiskForBranch(records);

  assert.equal(scoredRecords.length, records.length);
  assert.ok(scoredRecords.every((record) => record.risk !== undefined));
});

test("ganjlik Greek yogurt is a critical or high-end high risk case", () => {
  const record = getRequiredRecord("ganjlik", "greek-yogurt-500g");
  const assessment = calculateWasteRisk(record);

  assert.ok(assessment.roundedScore >= 75);
  assert.ok(["high", "critical"].includes(assessment.riskLevel));
  assert.ok(assessment.mainDrivers.some((driver) => driver.key === "expiry-urgency"));
  assert.ok(assessment.mainDrivers.some((driver) => driver.key === "stock-pressure"));
});

test("ganjlik orange juice stays low risk", () => {
  const record = getRequiredRecord("ganjlik", "orange-juice-1l");
  const assessment = calculateWasteRisk(record);

  assert.equal(assessment.riskLevel, "low");
});

test("ganjlik strawberries rank above ganjlik bananas", () => {
  const strawberries = calculateWasteRisk(getRequiredRecord("ganjlik", "strawberries-250g"));
  const bananas = calculateWasteRisk(getRequiredRecord("ganjlik", "bananas"));

  assert.ok(strawberries.roundedScore > bananas.roundedScore);
});

test("ganjlik Greek yogurt scores above may28 Greek yogurt", () => {
  const ganjlik = calculateWasteRisk(getRequiredRecord("ganjlik", "greek-yogurt-500g"));
  const may28 = calculateWasteRisk(getRequiredRecord("may28", "greek-yogurt-500g"));

  assert.ok(ganjlik.roundedScore > may28.roundedScore);
});
