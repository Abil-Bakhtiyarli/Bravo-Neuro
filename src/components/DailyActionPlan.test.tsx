import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import { getDashboardData } from "@/lib/dashboardData";

import {
  buildTaskSelectionSearchParams,
  DailyActionPlanPanel,
  getNextTaskStatus,
  getTaskStorageKey,
  mergeTaskStatuses,
  parsePersistedTaskStatuses,
} from "./DailyActionPlan";

const dashboardData = getDashboardData("ganjlik");

test("DailyActionPlanPanel renders sorted recommendation-backed tasks", () => {
  const markup = renderToStaticMarkup(
    <DailyActionPlanPanel
      tasks={dashboardData.actionPlan}
      selectedProductId="greek-yogurt-500g"
      onSelectTask={() => undefined}
      onAdvanceStatus={() => undefined}
    />,
  );

  assert.match(markup, /Today&#x27;s branch actions/);
  assert.match(markup, /Priority 1/);
  assert.match(markup, /Accept task/);
  assert.match(markup, /Selected/);
  assert.match(markup, /Selected task checklist/);
  assert.match(markup, /Expected net saved/);
  assert.doesNotMatch(markup, /Manager handoff queue/);
  assert.doesNotMatch(markup, /Execution detail/);
});

test("DailyActionPlanPanel expands checklist only for the selected task", () => {
  const [selectedTask, otherTask] = dashboardData.actionPlan;

  assert.ok(selectedTask);
  assert.ok(otherTask);

  const markup = renderToStaticMarkup(
    <DailyActionPlanPanel
      tasks={dashboardData.actionPlan}
      selectedProductId={selectedTask.productId}
      onSelectTask={() => undefined}
      onAdvanceStatus={() => undefined}
    />,
  );

  assert.match(markup, new RegExp(selectedTask.checklistSteps[0] ?? ""));
  assert.match(markup, new RegExp(selectedTask.checklistSteps[1] ?? ""));
  assert.doesNotMatch(markup, new RegExp(otherTask.checklistSteps[0] ?? ""));
  assert.doesNotMatch(markup, /Expand after acceptance/);
});

test("parsePersistedTaskStatuses hydrates only valid task ids and statuses", () => {
  const parsed = parsePersistedTaskStatuses(
    JSON.stringify({
      [dashboardData.actionPlan[0].taskId]: "accepted",
      invalid: "completed",
      [dashboardData.actionPlan[1].taskId]: "not-a-status",
    }),
    dashboardData.actionPlan.map((task) => task.taskId),
  );

  assert.deepEqual(parsed, {
    [dashboardData.actionPlan[0].taskId]: "accepted",
  });
});

test("mergeTaskStatuses overlays persisted task state onto the server snapshot", () => {
  const merged = mergeTaskStatuses(dashboardData.actionPlan, {
    [dashboardData.actionPlan[0].taskId]: "completed",
  });

  assert.equal(merged[0].status, "completed");
  assert.equal(merged[1].status, "pending");

  const markup = renderToStaticMarkup(
    <DailyActionPlanPanel
      tasks={merged}
      selectedProductId={null}
      onSelectTask={() => undefined}
      onAdvanceStatus={() => undefined}
    />,
  );

  assert.match(markup, /Completed/);
});

test("task status transition helpers advance from pending to accepted to completed", () => {
  assert.equal(getNextTaskStatus("pending"), "accepted");
  assert.equal(getNextTaskStatus("accepted"), "completed");
  assert.equal(getNextTaskStatus("completed"), "completed");
});

test("buildTaskSelectionSearchParams reuses product selection and clears conflicting filters", () => {
  const nextParams = buildTaskSelectionSearchParams(
    new URLSearchParams("branch=ganjlik&q=yogurt&risk=high"),
    "greek-yogurt-500g",
  );

  assert.equal(nextParams.get("product"), "greek-yogurt-500g");
  assert.equal(nextParams.get("branch"), "ganjlik");
  assert.equal(nextParams.get("q"), null);
  assert.equal(nextParams.get("risk"), null);
});

test("getTaskStorageKey scopes persisted state by branch", () => {
  assert.equal(getTaskStorageKey("ganjlik"), "bravo-neuro:task-status:v2:ganjlik");
});
