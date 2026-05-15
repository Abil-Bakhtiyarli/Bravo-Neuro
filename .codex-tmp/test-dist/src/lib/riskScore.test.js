"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const dataLoader_1 = require("./dataLoader");
const riskScore_1 = require("./riskScore");
function getRequiredRecord(branchId, productId) {
    const record = (0, dataLoader_1.getBranchProductRecord)(branchId, productId);
    strict_1.default.ok(record, `Expected seeded record for ${branchId}:${productId}`);
    return record;
}
(0, node_test_1.default)("risk level mapping matches the documented thresholds", () => {
    const cases = [
        { score: 34, expected: "low" },
        { score: 35, expected: "medium" },
        { score: 59, expected: "medium" },
        { score: 60, expected: "high" },
        { score: 79, expected: "high" },
        { score: 80, expected: "critical" },
    ];
    for (const testCase of cases) {
        strict_1.default.equal((0, riskScore_1.getRiskLevel)(testCase.score), testCase.expected);
    }
});
(0, node_test_1.default)("component scores are clamped and contributions sum to the total score", () => {
    const record = getRequiredRecord("ganjlik", "greek-yogurt-500g");
    const assessment = (0, riskScore_1.calculateWasteRisk)(record);
    for (const componentScore of assessment.componentScores) {
        strict_1.default.ok(componentScore.rawScore >= 0);
        strict_1.default.ok(componentScore.rawScore <= 100);
    }
    const summedContribution = assessment.componentScores.reduce((sum, componentScore) => sum + componentScore.weightedContribution, 0);
    strict_1.default.ok(Math.abs(summedContribution - assessment.totalScore) < 0.01);
});
(0, node_test_1.default)("main drivers stay sorted by weighted contribution and then raw score", () => {
    const record = getRequiredRecord("ganjlik", "greek-yogurt-500g");
    const assessment = (0, riskScore_1.calculateWasteRisk)(record);
    strict_1.default.equal(assessment.mainDrivers.length, 3);
    for (let index = 1; index < assessment.componentScores.length; index += 1) {
        const previous = assessment.componentScores[index - 1];
        const current = assessment.componentScores[index];
        strict_1.default.ok(previous.weightedContribution > current.weightedContribution ||
            (previous.weightedContribution === current.weightedContribution &&
                previous.rawScore >= current.rawScore));
    }
});
(0, node_test_1.default)("calculateWasteRiskForBranch returns a risk assessment for every record", () => {
    const records = (0, dataLoader_1.getBranchProductRecords)("ganjlik");
    const scoredRecords = (0, riskScore_1.calculateWasteRiskForBranch)(records);
    strict_1.default.equal(scoredRecords.length, records.length);
    strict_1.default.ok(scoredRecords.every((record) => record.risk !== undefined));
});
(0, node_test_1.default)("ganjlik Greek yogurt is a critical or high-end high risk case", () => {
    const record = getRequiredRecord("ganjlik", "greek-yogurt-500g");
    const assessment = (0, riskScore_1.calculateWasteRisk)(record);
    strict_1.default.ok(assessment.roundedScore >= 75);
    strict_1.default.ok(["high", "critical"].includes(assessment.riskLevel));
    strict_1.default.ok(assessment.mainDrivers.some((driver) => driver.key === "expiry-urgency"));
    strict_1.default.ok(assessment.mainDrivers.some((driver) => driver.key === "stock-pressure"));
});
(0, node_test_1.default)("ganjlik orange juice stays low risk", () => {
    const record = getRequiredRecord("ganjlik", "orange-juice-1l");
    const assessment = (0, riskScore_1.calculateWasteRisk)(record);
    strict_1.default.equal(assessment.riskLevel, "low");
});
(0, node_test_1.default)("ganjlik strawberries rank above ganjlik bananas", () => {
    const strawberries = (0, riskScore_1.calculateWasteRisk)(getRequiredRecord("ganjlik", "strawberries-250g"));
    const bananas = (0, riskScore_1.calculateWasteRisk)(getRequiredRecord("ganjlik", "bananas"));
    strict_1.default.ok(strawberries.roundedScore > bananas.roundedScore);
});
(0, node_test_1.default)("ganjlik Greek yogurt scores above may28 Greek yogurt", () => {
    const ganjlik = (0, riskScore_1.calculateWasteRisk)(getRequiredRecord("ganjlik", "greek-yogurt-500g"));
    const may28 = (0, riskScore_1.calculateWasteRisk)(getRequiredRecord("may28", "greek-yogurt-500g"));
    strict_1.default.ok(ganjlik.roundedScore > may28.roundedScore);
});
