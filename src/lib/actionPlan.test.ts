import assert from "node:assert/strict";
import test from "node:test";

import { getDashboardData } from "./dashboardData";
import {
  buildActionPlanChecklistSteps,
  compareActionPlanItems,
  rankActionPlanItems,
} from "./actionPlan";

const dashboardData = getDashboardData("ganjlik");
const detail = dashboardData.productDetailsById["greek-yogurt-500g"];

test("buildActionPlanChecklistSteps generates action-specific operational guidance", () => {
  assert.ok(detail?.recommendation);

  const steps = buildActionPlanChecklistSteps(
    detail.recommendation,
    detail.daysUntilEarliestExpiry,
  );

  assert.equal(steps.length, 3);
  assert.match(steps[0], /35% markdown|Confirm the 35% markdown/);
  assert.match(steps[1], /shelf signage/i);
  assert.match(steps[2], /sell-through|fallback/i);
});

test("compareActionPlanItems prioritizes risk level before value and urgency", () => {
  const [firstTask, secondTask] = dashboardData.actionPlan;

  assert.ok(firstTask);
  assert.ok(secondTask);
  assert.ok(compareActionPlanItems(firstTask, secondTask) <= 0);

  const criticalLowValue = {
    ...firstTask,
    riskLevel: "critical" as const,
    expectedNetSavedValueAzN: 1,
    daysUntilExpiry: 5,
    productName: "A",
    taskId: "critical",
  };
  const highHighValue = {
    ...secondTask,
    riskLevel: "high" as const,
    expectedNetSavedValueAzN: 999,
    daysUntilExpiry: 1,
    productName: "B",
    taskId: "high",
  };

  assert.ok(compareActionPlanItems(criticalLowValue, highHighValue) < 0);
});

test("rankActionPlanItems sorts deterministically and assigns sequential priority ranks", () => {
  const ranked = rankActionPlanItems(
    dashboardData.actionPlan.map((task) => ({
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
    })),
  );

  assert.equal(ranked.length, dashboardData.actionPlan.length);
  assert.deepEqual(
    ranked.map((task) => task.priorityRank),
    ranked.map((_, index) => index + 1),
  );

  for (let index = 0; index < ranked.length - 1; index += 1) {
    assert.ok(compareActionPlanItems(ranked[index], ranked[index + 1]) <= 0);
  }
});
