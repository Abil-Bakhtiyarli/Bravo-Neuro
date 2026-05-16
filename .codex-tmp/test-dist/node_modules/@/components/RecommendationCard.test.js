"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const RecommendationCard_1 = __importDefault(require("./RecommendationCard"));
const discountRecommendation = {
    actionType: "discount",
    branchId: "ganjlik",
    productId: "greek-yogurt-500g",
    branchName: "Bravo Ganjlik",
    productName: "Greek Yogurt 500g",
    riskScore: 88,
    riskLevel: "critical",
    summary: "Greek Yogurt 500g: apply a dynamic discount because 1 day expiry window, 35% base discount.",
    reasonCodes: ["near-expiry", "high-risk-score", "excess-stock"],
    discountPercent: 35,
    fallbackDiscountPercent: 45,
    targetUnitsByTomorrow: 12,
    expectedUnitsByTomorrow: 8.5,
};
const transferRecommendation = {
    actionType: "transfer",
    branchId: "ganjlik",
    productId: "berry-smoothie-250ml",
    branchName: "Bravo Ganjlik",
    productName: "Berry Smoothie 250ml",
    riskScore: 74,
    riskLevel: "high",
    summary: "Berry Smoothie 250ml: transfer excess stock because Bravo 28 May sells it 2.10x faster, transfer 18 units before expiry.",
    reasonCodes: ["faster-branch-demand", "transfer-feasible", "excess-stock"],
    destinationBranchId: "may28",
    destinationBranchName: "Bravo 28 May",
    transferQuantity: 18,
    salesSpeedMultiplier: 2.1,
};
const reorderRecommendation = {
    actionType: "reorder-adjustment",
    branchId: "yasamal",
    productId: "toast-bread-white",
    branchName: "Bravo Yasamal",
    productName: "Toast Bread White",
    riskScore: 64,
    riskLevel: "medium",
    summary: "Toast Bread White: reduce the next reorder because stock coverage is 11 days, waste trend remains elevated.",
    reasonCodes: ["oversupply", "waste-trend"],
    adjustment: "reduce",
    suggestedOrderMultiplier: 0.75,
};
const shelfActionRecommendation = {
    actionType: "shelf-action",
    branchId: "may28",
    productId: "banana-imported",
    branchName: "Bravo 28 May",
    productName: "Banana Imported",
    riskScore: 61,
    riskLevel: "medium",
    summary: "Banana Imported: move stock to a higher-visibility shelf because 2 day expiry window, promo endcap placement.",
    reasonCodes: ["near-expiry", "visibility-boost"],
    targetPlacement: "promo endcap",
};
const investigationRecommendation = {
    actionType: "investigation",
    branchId: "ganjlik",
    productId: "milk-1l",
    branchName: "Bravo Ganjlik",
    productName: "Milk 1L",
    riskScore: 58,
    riskLevel: "medium",
    summary: "Milk 1L: investigate the issue because sales or stock coverage data is unusable.",
    reasonCodes: ["data-conflict"],
    checks: [
        "Verify current stock count against shelf and backroom inventory.",
        "Check shelf placement and promo visibility.",
        "Review recent sales anomalies or missing transaction data.",
    ],
};
(0, node_test_1.default)("RecommendationCard renders an empty state when no recommendation is available", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RecommendationCard_1.default, { recommendation: null }));
    strict_1.default.match(markup, /Recommended action/);
    strict_1.default.match(markup, /does not need a primary action/);
});
(0, node_test_1.default)("RecommendationCard renders discount metrics", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RecommendationCard_1.default, { recommendation: discountRecommendation }));
    strict_1.default.match(markup, /Launch markdown today/);
    strict_1.default.match(markup, /Base markdown/);
    strict_1.default.match(markup, /35%/);
    strict_1.default.match(markup, /Fallback markdown/);
    strict_1.default.match(markup, /45%/);
    strict_1.default.match(markup, /Target by tomorrow/);
    strict_1.default.match(markup, /12 units/);
    strict_1.default.match(markup, /Expected with markdown/);
    strict_1.default.match(markup, /8.50 units/);
});
(0, node_test_1.default)("RecommendationCard renders transfer metrics", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RecommendationCard_1.default, { recommendation: transferRecommendation }));
    strict_1.default.match(markup, /Move stock to faster branch/);
    strict_1.default.match(markup, /Destination branch/);
    strict_1.default.match(markup, /Bravo 28 May/);
    strict_1.default.match(markup, /Transfer quantity/);
    strict_1.default.match(markup, /18 units/);
    strict_1.default.match(markup, /Sales speed lift/);
    strict_1.default.match(markup, /2.10x/);
});
(0, node_test_1.default)("RecommendationCard renders reorder-adjustment metrics", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RecommendationCard_1.default, { recommendation: reorderRecommendation }));
    strict_1.default.match(markup, /Trim the next replenishment/);
    strict_1.default.match(markup, /Next order move/);
    strict_1.default.match(markup, /Reduce order/);
    strict_1.default.match(markup, /Suggested multiplier/);
    strict_1.default.match(markup, /0.75x/);
});
(0, node_test_1.default)("RecommendationCard renders shelf-action metrics", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RecommendationCard_1.default, { recommendation: shelfActionRecommendation }));
    strict_1.default.match(markup, /Improve front-of-store visibility/);
    strict_1.default.match(markup, /Target placement/);
    strict_1.default.match(markup, /promo endcap/);
});
(0, node_test_1.default)("RecommendationCard renders investigation follow-ups", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(RecommendationCard_1.default, { recommendation: investigationRecommendation }));
    strict_1.default.match(markup, /Validate the branch signal/);
    strict_1.default.match(markup, /Follow-up 1/);
    strict_1.default.match(markup, /Verify current stock count against shelf and backroom inventory/);
    strict_1.default.match(markup, /These follow-ups stay explicit/);
});
