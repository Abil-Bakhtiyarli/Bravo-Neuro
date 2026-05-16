"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const dashboardData_1 = require("./dashboardData");
const actionPlan_1 = require("./actionPlan");
const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
const detail = dashboardData.productDetailsById["greek-yogurt-500g"];
(0, node_test_1.default)("buildActionPlanChecklistSteps generates action-specific operational guidance", () => {
    strict_1.default.ok(detail?.recommendation);
    const steps = (0, actionPlan_1.buildActionPlanChecklistSteps)(detail.recommendation, detail.daysUntilEarliestExpiry);
    strict_1.default.equal(steps.length, 3);
    strict_1.default.match(steps[0], /35% markdown|Confirm the 35% markdown/);
    strict_1.default.match(steps[1], /shelf signage/i);
    strict_1.default.match(steps[2], /sell-through|fallback/i);
});
(0, node_test_1.default)("compareActionPlanItems prioritizes risk level before value and urgency", () => {
    const [firstTask, secondTask] = dashboardData.actionPlan;
    strict_1.default.ok(firstTask);
    strict_1.default.ok(secondTask);
    strict_1.default.ok((0, actionPlan_1.compareActionPlanItems)(firstTask, secondTask) <= 0);
    const criticalLowValue = {
        ...firstTask,
        riskLevel: "critical",
        expectedNetSavedValueAzN: 1,
        daysUntilExpiry: 5,
        productName: "A",
        taskId: "critical",
    };
    const highHighValue = {
        ...secondTask,
        riskLevel: "high",
        expectedNetSavedValueAzN: 999,
        daysUntilExpiry: 1,
        productName: "B",
        taskId: "high",
    };
    strict_1.default.ok((0, actionPlan_1.compareActionPlanItems)(criticalLowValue, highHighValue) < 0);
});
(0, node_test_1.default)("rankActionPlanItems sorts deterministically and assigns sequential priority ranks", () => {
    const ranked = (0, actionPlan_1.rankActionPlanItems)(dashboardData.actionPlan.map((task) => ({
        taskId: task.taskId,
        branchId: task.branchId,
        productId: task.productId,
        productName: task.productName,
        actionType: task.actionType,
        riskLevel: task.riskLevel,
        riskScore: task.riskScore,
        daysUntilExpiry: task.daysUntilExpiry,
        status: task.status,
        summary: task.summary,
        checklistSteps: task.checklistSteps,
        expectedNetSavedValueAzN: task.expectedNetSavedValueAzN,
        expectedRecoveredValueAzN: task.expectedRecoveredValueAzN,
    })));
    strict_1.default.equal(ranked.length, dashboardData.actionPlan.length);
    strict_1.default.deepEqual(ranked.map((task) => task.priorityRank), ranked.map((_, index) => index + 1));
    for (let index = 0; index < ranked.length - 1; index += 1) {
        strict_1.default.ok((0, actionPlan_1.compareActionPlanItems)(ranked[index], ranked[index + 1]) <= 0);
    }
});
