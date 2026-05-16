import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import type { ProductRecommendation } from "@/lib/types";

import RecommendationCard from "./RecommendationCard";

const discountRecommendation: ProductRecommendation = {
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

const transferRecommendation: ProductRecommendation = {
  actionType: "transfer",
  branchId: "ganjlik",
  productId: "berry-smoothie-250ml",
  branchName: "Bravo Ganjlik",
  productName: "Berry Smoothie 250ml",
  riskScore: 74,
  riskLevel: "high",
  summary:
    "Berry Smoothie 250ml: transfer excess stock because Bravo 28 May sells it 2.10x faster, transfer 18 units before expiry.",
  reasonCodes: ["faster-branch-demand", "transfer-feasible", "excess-stock"],
  destinationBranchId: "may28",
  destinationBranchName: "Bravo 28 May",
  transferQuantity: 18,
  salesSpeedMultiplier: 2.1,
};

const reorderRecommendation: ProductRecommendation = {
  actionType: "reorder-adjustment",
  branchId: "yasamal",
  productId: "toast-bread-white",
  branchName: "Bravo Yasamal",
  productName: "Toast Bread White",
  riskScore: 64,
  riskLevel: "medium",
  summary:
    "Toast Bread White: reduce the next reorder because stock coverage is 11 days, waste trend remains elevated.",
  reasonCodes: ["oversupply", "waste-trend"],
  adjustment: "reduce",
  suggestedOrderMultiplier: 0.75,
};

const shelfActionRecommendation: ProductRecommendation = {
  actionType: "shelf-action",
  branchId: "may28",
  productId: "banana-imported",
  branchName: "Bravo 28 May",
  productName: "Banana Imported",
  riskScore: 61,
  riskLevel: "medium",
  summary:
    "Banana Imported: move stock to a higher-visibility shelf because 2 day expiry window, promo endcap placement.",
  reasonCodes: ["near-expiry", "visibility-boost"],
  targetPlacement: "promo endcap",
};

const investigationRecommendation: ProductRecommendation = {
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

test("RecommendationCard renders an empty state when no recommendation is available", () => {
  const markup = renderToStaticMarkup(<RecommendationCard recommendation={null} />);

  assert.match(markup, /Recommended action/);
  assert.match(markup, /does not need a primary action/);
});

test("RecommendationCard renders discount metrics", () => {
  const markup = renderToStaticMarkup(
    <RecommendationCard recommendation={discountRecommendation} />,
  );

  assert.match(markup, /Launch markdown today/);
  assert.match(markup, /Base markdown/);
  assert.match(markup, /35%/);
  assert.match(markup, /Fallback markdown/);
  assert.match(markup, /45%/);
  assert.match(markup, /Target by tomorrow/);
  assert.match(markup, /12 units/);
  assert.match(markup, /Expected with markdown/);
  assert.match(markup, /8.50 units/);
});

test("RecommendationCard renders transfer metrics", () => {
  const markup = renderToStaticMarkup(
    <RecommendationCard recommendation={transferRecommendation} />,
  );

  assert.match(markup, /Move stock to faster branch/);
  assert.match(markup, /Destination branch/);
  assert.match(markup, /Bravo 28 May/);
  assert.match(markup, /Transfer quantity/);
  assert.match(markup, /18 units/);
  assert.match(markup, /Sales speed lift/);
  assert.match(markup, /2.10x/);
});

test("RecommendationCard renders reorder-adjustment metrics", () => {
  const markup = renderToStaticMarkup(
    <RecommendationCard recommendation={reorderRecommendation} />,
  );

  assert.match(markup, /Trim the next replenishment/);
  assert.match(markup, /Next order move/);
  assert.match(markup, /Reduce order/);
  assert.match(markup, /Suggested multiplier/);
  assert.match(markup, /0.75x/);
});

test("RecommendationCard renders shelf-action metrics", () => {
  const markup = renderToStaticMarkup(
    <RecommendationCard recommendation={shelfActionRecommendation} />,
  );

  assert.match(markup, /Improve front-of-store visibility/);
  assert.match(markup, /Target placement/);
  assert.match(markup, /promo endcap/);
});

test("RecommendationCard renders investigation follow-ups", () => {
  const markup = renderToStaticMarkup(
    <RecommendationCard recommendation={investigationRecommendation} />,
  );

  assert.match(markup, /Validate the branch signal/);
  assert.match(markup, /Follow-up 1/);
  assert.match(markup, /Verify current stock count against shelf and backroom inventory/);
  assert.match(markup, /These follow-ups stay explicit/);
});
