import assert from "node:assert/strict";
import test from "node:test";

import { buildAssistantBranchSnapshot, buildAssistantContextSnapshot } from "./context";

test("buildAssistantContextSnapshot uses canonical dashboard data and preserves branch scope", () => {
  const snapshot = buildAssistantContextSnapshot("ganjlik", "greek-yogurt-500g");

  assert.equal(snapshot.branch.branchId, "ganjlik");
  assert.equal(snapshot.selectedProduct?.branch.branchId, "ganjlik");
  assert.equal(snapshot.selectedProduct?.product.productId, "greek-yogurt-500g");
  assert.ok(snapshot.branch.kpis.length > 0);
  assert.ok(snapshot.branch.topRiskProducts.length > 0);
  assert.ok(snapshot.branch.actionPlan.length > 0);
});

test("buildAssistantContextSnapshot handles an invalid product id without throwing", () => {
  const snapshot = buildAssistantContextSnapshot("ganjlik", "missing-product");

  assert.equal(snapshot.branch.branchId, "ganjlik");
  assert.equal(snapshot.selectedProduct, null);
  assert.equal(snapshot.selectedProductRiskRow, null);
  assert.equal(snapshot.selectedProductAction, null);
});

test("buildAssistantBranchSnapshot scales from current arrays without fixed ids", () => {
  const snapshot = buildAssistantBranchSnapshot("may28", {
    topRiskLimit: 3,
    actionLimit: 2,
    seriesLimit: 4,
  });

  assert.equal(snapshot.branchId, "may28");
  assert.ok(snapshot.topRiskProducts.length <= 3);
  assert.ok(snapshot.actionPlan.length <= 2);
  assert.ok(snapshot.monthlySavingsSeries.length <= 4);
});
