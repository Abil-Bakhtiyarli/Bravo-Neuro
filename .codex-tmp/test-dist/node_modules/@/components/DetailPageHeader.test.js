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
const DetailPageHeader_1 = __importDefault(require("./DetailPageHeader"));
(0, node_test_1.default)("DetailPageHeader renders the branch selector, subtitle, and live data surface", () => {
    const branches = (0, dashboardData_1.getAvailableBranchOptions)();
    const dashboardData = (0, dashboardData_1.getDashboardData)("ganjlik");
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(DetailPageHeader_1.default, { branches: branches, selectedBranchId: "ganjlik", title: "Risk products", subtitle: "Branch-level expiry, stock, and waste-risk queue.", generatedAt: dashboardData.generatedAt, preservedSearchParamKeys: ["q", "risk"], staticMode: true }));
    strict_1.default.match(markup, /Risk products/);
    strict_1.default.match(markup, /Branch-level expiry, stock, and waste-risk queue/);
    strict_1.default.match(markup, /Branch/);
    strict_1.default.match(markup, /Live branch data/);
    strict_1.default.doesNotMatch(markup, /Demo Mode/);
});
