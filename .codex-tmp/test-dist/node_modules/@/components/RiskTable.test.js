"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const RiskTable_1 = __importDefault(require("./RiskTable"));
const rows = [
    {
        branchId: "ganjlik",
        productId: "greek-yogurt-500g",
        productName: "Greek Yogurt 500g",
        category: "dairy",
        riskLevel: "critical",
        riskScore: 92,
        daysUntilExpiry: 1,
        totalStock: 18,
        daysOfStockRemaining: 3.2,
        actionType: "discount",
        recommendationSummary: "Discount today to move near-expiry stock.",
        netSavedValueAzN: 12,
        possibleLossAzN: 18,
    },
];
(0, node_test_1.default)("RiskTable renders selected rows with accessible interactive state", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RiskTable_1.default, { rows: rows, searchValue: "", riskFilter: "all", selectedProductId: "greek-yogurt-500g", onSearchChange: () => undefined, onRiskFilterChange: () => undefined, onSelectProduct: () => undefined }));
    strict_1.default.match(markup, /aria-selected="true"/);
    strict_1.default.match(markup, /tabindex="0"/);
    strict_1.default.match(markup, /Selected for detail/);
});
(0, node_test_1.default)("RiskTable keeps visible badge labels and action framing", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RiskTable_1.default, { rows: rows, searchValue: "yogurt", riskFilter: "critical", selectedProductId: null, onSearchChange: () => undefined, onRiskFilterChange: () => undefined, onSelectProduct: () => undefined }));
    strict_1.default.match(markup, /Critical/);
    strict_1.default.match(markup, /Dynamic discount/);
    strict_1.default.match(markup, /Search product or category/);
});
