"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const dashboardData_1 = require("@/lib/dashboardData");
const DailyActionPlan_1 = require("./DailyActionPlan");
const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
(0, node_test_1.default)("DailyActionPlanPanel renders sorted recommendation-backed tasks", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DailyActionPlan_1.DailyActionPlanPanel, { tasks: dashboardData.actionPlan, selectedProductId: "greek-yogurt-500g", onSelectTask: () => undefined, onAdvanceStatus: () => undefined }));
    strict_1.default.match(markup, /Today&#x27;s branch actions/);
    strict_1.default.match(markup, /Priority 1/);
    strict_1.default.match(markup, /Accept task/);
    strict_1.default.match(markup, /Selected/);
    strict_1.default.match(markup, /Selected task checklist/);
    strict_1.default.match(markup, /Expected net saved/);
    strict_1.default.doesNotMatch(markup, /Manager handoff queue/);
    strict_1.default.doesNotMatch(markup, /Execution detail/);
});
(0, node_test_1.default)("DailyActionPlanPanel expands checklist only for the selected task", () => {
    const [selectedTask, otherTask] = dashboardData.actionPlan;
    strict_1.default.ok(selectedTask);
    strict_1.default.ok(otherTask);
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DailyActionPlan_1.DailyActionPlanPanel, { tasks: dashboardData.actionPlan, selectedProductId: selectedTask.productId, onSelectTask: () => undefined, onAdvanceStatus: () => undefined }));
    strict_1.default.match(markup, new RegExp(selectedTask.checklistSteps[0] ?? ""));
    strict_1.default.match(markup, new RegExp(selectedTask.checklistSteps[1] ?? ""));
    strict_1.default.doesNotMatch(markup, new RegExp(otherTask.checklistSteps[0] ?? ""));
    strict_1.default.doesNotMatch(markup, /Expand after acceptance/);
});
(0, node_test_1.default)("parsePersistedTaskStatuses hydrates only valid task ids and statuses", () => {
    const parsed = (0, DailyActionPlan_1.parsePersistedTaskStatuses)(JSON.stringify({
        [dashboardData.actionPlan[0].taskId]: "accepted",
        invalid: "completed",
        [dashboardData.actionPlan[1].taskId]: "not-a-status",
    }), dashboardData.actionPlan.map((task) => task.taskId));
    strict_1.default.deepEqual(parsed, {
        [dashboardData.actionPlan[0].taskId]: "accepted",
    });
});
(0, node_test_1.default)("mergeTaskStatuses overlays persisted task state onto the server snapshot", () => {
    const merged = (0, DailyActionPlan_1.mergeTaskStatuses)(dashboardData.actionPlan, {
        [dashboardData.actionPlan[0].taskId]: "completed",
    });
    strict_1.default.equal(merged[0].status, "completed");
    strict_1.default.equal(merged[1].status, "pending");
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DailyActionPlan_1.DailyActionPlanPanel, { tasks: merged, selectedProductId: null, onSelectTask: () => undefined, onAdvanceStatus: () => undefined }));
    strict_1.default.match(markup, /Completed/);
});
(0, node_test_1.default)("task status transition helpers advance from pending to accepted to completed", () => {
    strict_1.default.equal((0, DailyActionPlan_1.getNextTaskStatus)("pending"), "accepted");
    strict_1.default.equal((0, DailyActionPlan_1.getNextTaskStatus)("accepted"), "completed");
    strict_1.default.equal((0, DailyActionPlan_1.getNextTaskStatus)("completed"), "completed");
});
(0, node_test_1.default)("buildTaskSelectionSearchParams reuses product selection and clears conflicting filters", () => {
    const nextParams = (0, DailyActionPlan_1.buildTaskSelectionSearchParams)(new URLSearchParams("branch=ganjlik&q=yogurt&risk=high"), "greek-yogurt-500g");
    strict_1.default.equal(nextParams.get("product"), "greek-yogurt-500g");
    strict_1.default.equal(nextParams.get("branch"), "ganjlik");
    strict_1.default.equal(nextParams.get("q"), null);
    strict_1.default.equal(nextParams.get("risk"), null);
});
(0, node_test_1.default)("getTaskStorageKey scopes persisted state by branch", () => {
    strict_1.default.equal((0, DailyActionPlan_1.getTaskStorageKey)("ganjlik"), "bravo-neuro:task-status:v2:ganjlik");
});
