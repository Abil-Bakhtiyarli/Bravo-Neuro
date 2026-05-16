import assert from "node:assert/strict";
import test from "node:test";

import { getDashboardData } from "./dashboardData";
import {
  DEFAULT_RISK_TABLE_FILTER,
  filterRiskTableRows,
  getSelectedRiskTableRow,
  getVisibleSelectedProductId,
  parseRiskTableFilterValue,
  updateRiskTableSearchParams,
} from "./riskTableInteraction";

test("parseRiskTableFilterValue falls back to all for invalid values", () => {
  assert.equal(parseRiskTableFilterValue("critical"), "critical");
  assert.equal(parseRiskTableFilterValue("all"), "all");
  assert.equal(parseRiskTableFilterValue("low"), DEFAULT_RISK_TABLE_FILTER);
  assert.equal(parseRiskTableFilterValue("unknown"), DEFAULT_RISK_TABLE_FILTER);
  assert.equal(parseRiskTableFilterValue(null), DEFAULT_RISK_TABLE_FILTER);
});

test("filterRiskTableRows narrows rows by product name and category text", () => {
  const rows = getDashboardData("ganjlik").riskTable;
  const yogurtRows = filterRiskTableRows(rows, "yogurt", "all");
  const bakeryRows = filterRiskTableRows(rows, "bakery", "all");

  assert.ok(yogurtRows.length > 0);
  assert.ok(yogurtRows.every((row) => /yogurt/i.test(row.productName)));
  assert.ok(bakeryRows.length > 0);
  assert.ok(bakeryRows.every((row) => row.category === "bakery"));
});

test("filterRiskTableRows narrows rows by risk level", () => {
  const rows = getDashboardData("ganjlik").riskTable;
  const highRows = filterRiskTableRows(rows, "", "high");

  assert.ok(highRows.length > 0);
  assert.ok(highRows.every((row) => row.riskLevel === "high"));
});

test("getVisibleSelectedProductId clears selection when filtered rows no longer contain it", () => {
  const rows = getDashboardData("ganjlik").riskTable;
  const selectedProductId = rows[0]?.productId;

  assert.ok(selectedProductId);
  assert.equal(getVisibleSelectedProductId(rows, selectedProductId), selectedProductId);

  const filteredRows = filterRiskTableRows(rows, "bakery", "all").filter(
    (row) => row.productId !== selectedProductId,
  );

  assert.equal(getVisibleSelectedProductId(filteredRows, selectedProductId), null);
});

test("getSelectedRiskTableRow falls back to no selection for invalid products", () => {
  const rows = getDashboardData("ganjlik").riskTable;

  assert.equal(getSelectedRiskTableRow(rows, "missing-product"), null);
});

test("selection becomes invalid when the branch changes", () => {
  const ganjlikRows = getDashboardData("ganjlik").riskTable;
  const yasamalRows = getDashboardData("yasamal").riskTable;
  const yasamalProductIds = new Set(yasamalRows.map((row) => row.productId));
  const selectedProductId = ganjlikRows.find((row) => !yasamalProductIds.has(row.productId))?.productId;

  assert.ok(selectedProductId);
  assert.equal(getVisibleSelectedProductId(ganjlikRows, selectedProductId), selectedProductId);
  assert.equal(getVisibleSelectedProductId(yasamalRows, selectedProductId), null);
});

test("updateRiskTableSearchParams writes and clears product, query, and risk values", () => {
  const params = new URLSearchParams("branch=ganjlik");
  const updated = updateRiskTableSearchParams(params, {
    product: "greek-yogurt-500g",
    q: " yogurt ",
    risk: "critical",
  });

  assert.equal(updated.get("branch"), "ganjlik");
  assert.equal(updated.get("product"), "greek-yogurt-500g");
  assert.equal(updated.get("q"), "yogurt");
  assert.equal(updated.get("risk"), "critical");

  const cleared = updateRiskTableSearchParams(updated, {
    product: null,
    q: "",
    risk: "all",
  });

  assert.equal(cleared.get("product"), null);
  assert.equal(cleared.get("q"), null);
  assert.equal(cleared.get("risk"), null);
});
