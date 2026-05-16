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
const dashboardKpiPresentation_1 = require("@/lib/dashboardKpiPresentation");
const SummaryKpiGrid_1 = __importDefault(require("./SummaryKpiGrid"));
(0, node_test_1.default)("SummaryKpiGrid renders the four overview KPIs without the legacy footer copy", () => {
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(SummaryKpiGrid_1.default, { items: (0, dashboardKpiPresentation_1.buildDashboardKpiPresentationItems)(dashboardData).filter((item) => item.key === "risky-products" ||
            item.key === "net-saved-value" ||
            item.key === "possible-loss" ||
            item.key === "tasks-today") }));
    strict_1.default.match(markup, /Risky products/);
    strict_1.default.match(markup, /Net saved value/);
    strict_1.default.match(markup, /Possible waste/);
    strict_1.default.match(markup, /Tasks today/);
    strict_1.default.doesNotMatch(markup, /Branch KPI/);
    strict_1.default.doesNotMatch(markup, /Synced with the current branch snapshot/);
});
