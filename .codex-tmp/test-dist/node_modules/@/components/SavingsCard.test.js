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
const SavingsCard_1 = __importDefault(require("./SavingsCard"));
const detail = (0, dashboardData_1.getDashboardData)("ganjlik").productDetailsById["greek-yogurt-500g"];
(0, node_test_1.default)("SavingsCard renders before and after comparison for actionable products", () => {
    strict_1.default.ok(detail);
    strict_1.default.ok(detail.recommendation);
    strict_1.default.ok(detail.savings);
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(SavingsCard_1.default, { recommendation: detail.recommendation, savings: detail.savings, unitPriceAzN: detail.product.unitPrice }));
    strict_1.default.match(markup, /Savings comparison/);
    strict_1.default.match(markup, /Without action/);
    strict_1.default.match(markup, /With action/);
    strict_1.default.match(markup, /Recovered value/);
    strict_1.default.match(markup, /Action cost/);
    strict_1.default.match(markup, /Waste avoided/);
    strict_1.default.match(markup, /Method/);
});
(0, node_test_1.default)("SavingsCard keeps a dedicated empty state when savings data is missing", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(SavingsCard_1.default, { recommendation: null, savings: null, unitPriceAzN: 3.99 }));
    strict_1.default.match(markup, /Savings comparison/);
    strict_1.default.match(markup, /does not currently carry a separate before-and-after savings scenario/);
});
