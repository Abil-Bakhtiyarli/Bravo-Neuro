"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const BranchComparisonCard_1 = __importDefault(require("./BranchComparisonCard"));
(0, node_test_1.default)("BranchComparisonCard renders all branches and marks the selected branch", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(BranchComparisonCard_1.default, { comparisons: [
            {
                branchId: "ganjlik",
                branchName: "Bravo Ganjlik",
                protectedValueDisplay: "AZN 12.4",
                riskyProductsCount: 3,
                highestRiskLevel: "critical",
                topActionLabel: "Launch markdown today",
                isSelected: true,
            },
            {
                branchId: "may28",
                branchName: "Bravo 28 May",
                protectedValueDisplay: "AZN 9.8",
                riskyProductsCount: 2,
                highestRiskLevel: "high",
                topActionLabel: "Move stock today",
                isSelected: false,
            },
            {
                branchId: "yasamal",
                branchName: "Bravo Yasamal",
                protectedValueDisplay: "AZN 3.4",
                riskyProductsCount: 1,
                highestRiskLevel: "medium",
                topActionLabel: "Check reorder level",
                isSelected: false,
            },
        ] }));
    strict_1.default.match(markup, /Bravo Ganjlik/);
    strict_1.default.match(markup, /Bravo 28 May/);
    strict_1.default.match(markup, /Bravo Yasamal/);
    strict_1.default.match(markup, /Active/);
});
