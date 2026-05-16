"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const dashboardData_1 = require("./dashboardData");
const dashboardKpiPresentation_1 = require("./dashboardKpiPresentation");
(0, node_test_1.default)("buildDashboardKpiPresentationItems keeps the visible KPI rail to five ordered cards", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const items = (0, dashboardKpiPresentation_1.buildDashboardKpiPresentationItems)(dashboardData);
    strict_1.default.equal(items.length, 5);
    strict_1.default.deepEqual(items.map((item) => item.key), [
        "possible-loss",
        "recoverable-value",
        "net-saved-value",
        "risky-products",
        "tasks-today",
    ]);
});
(0, node_test_1.default)("buildDashboardKpiPresentationItems includes net saved value and keeps tasks visible", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const items = (0, dashboardKpiPresentation_1.buildDashboardKpiPresentationItems)(dashboardData);
    const tasksKpi = dashboardData.kpis.find((item) => item.key === "tasks-today");
    const netSavedKpi = dashboardData.kpis.find((item) => item.key === "net-saved-value");
    const dashboardKpiKeys = dashboardData.kpis.map((item) => item.key);
    strict_1.default.ok(tasksKpi);
    strict_1.default.ok(netSavedKpi);
    strict_1.default.ok(dashboardKpiKeys.includes("net-saved-value"));
    strict_1.default.equal(items[2]?.key, "net-saved-value");
    strict_1.default.equal(items[2]?.numericValue, netSavedKpi.value);
    strict_1.default.equal(items.at(-1)?.key, "tasks-today");
    strict_1.default.equal(items.at(-1)?.numericValue, tasksKpi.value);
    strict_1.default.match(items.at(-1)?.helperText ?? "", /Bravo Ganjlik/i);
});
