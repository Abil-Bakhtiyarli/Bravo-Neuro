"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const dashboardData_1 = require("./dashboardData");
const riskTableInteraction_1 = require("./riskTableInteraction");
(0, node_test_1.default)("parseRiskTableFilterValue falls back to all for invalid values", () => {
    strict_1.default.equal((0, riskTableInteraction_1.parseRiskTableFilterValue)("critical"), "critical");
    strict_1.default.equal((0, riskTableInteraction_1.parseRiskTableFilterValue)("all"), "all");
    strict_1.default.equal((0, riskTableInteraction_1.parseRiskTableFilterValue)("low"), riskTableInteraction_1.DEFAULT_RISK_TABLE_FILTER);
    strict_1.default.equal((0, riskTableInteraction_1.parseRiskTableFilterValue)("unknown"), riskTableInteraction_1.DEFAULT_RISK_TABLE_FILTER);
    strict_1.default.equal((0, riskTableInteraction_1.parseRiskTableFilterValue)(null), riskTableInteraction_1.DEFAULT_RISK_TABLE_FILTER);
});
(0, node_test_1.default)("filterRiskTableRows narrows rows by product name and category text", () => {
    const rows = (0, dashboardData_1.getDashboardData)("ganjlik").riskTable;
    const yogurtRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, "yogurt", "all");
    const bakeryRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, "bakery", "all");
    strict_1.default.ok(yogurtRows.length > 0);
    strict_1.default.ok(yogurtRows.every((row) => /yogurt/i.test(row.productName)));
    strict_1.default.ok(bakeryRows.length > 0);
    strict_1.default.ok(bakeryRows.every((row) => row.category === "bakery"));
});
(0, node_test_1.default)("filterRiskTableRows narrows rows by risk level", () => {
    const rows = (0, dashboardData_1.getDashboardData)("ganjlik").riskTable;
    const highRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, "", "high");
    strict_1.default.ok(highRows.length > 0);
    strict_1.default.ok(highRows.every((row) => row.riskLevel === "high"));
});
(0, node_test_1.default)("getVisibleSelectedProductId clears selection when filtered rows no longer contain it", () => {
    const rows = (0, dashboardData_1.getDashboardData)("ganjlik").riskTable;
    const selectedProductId = rows[0]?.productId;
    strict_1.default.ok(selectedProductId);
    strict_1.default.equal((0, riskTableInteraction_1.getVisibleSelectedProductId)(rows, selectedProductId), selectedProductId);
    const filteredRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, "bakery", "all").filter((row) => row.productId !== selectedProductId);
    strict_1.default.equal((0, riskTableInteraction_1.getVisibleSelectedProductId)(filteredRows, selectedProductId), null);
});
(0, node_test_1.default)("getSelectedRiskTableRow falls back to no selection for invalid products", () => {
    const rows = (0, dashboardData_1.getDashboardData)("ganjlik").riskTable;
    strict_1.default.equal((0, riskTableInteraction_1.getSelectedRiskTableRow)(rows, "missing-product"), null);
});
(0, node_test_1.default)("selection becomes invalid when the branch changes", () => {
    const ganjlikRows = (0, dashboardData_1.getDashboardData)("ganjlik").riskTable;
    const yasamalRows = (0, dashboardData_1.getDashboardData)("yasamal").riskTable;
    const yasamalProductIds = new Set(yasamalRows.map((row) => row.productId));
    const selectedProductId = ganjlikRows.find((row) => !yasamalProductIds.has(row.productId))?.productId;
    strict_1.default.ok(selectedProductId);
    strict_1.default.equal((0, riskTableInteraction_1.getVisibleSelectedProductId)(ganjlikRows, selectedProductId), selectedProductId);
    strict_1.default.equal((0, riskTableInteraction_1.getVisibleSelectedProductId)(yasamalRows, selectedProductId), null);
});
(0, node_test_1.default)("updateRiskTableSearchParams writes and clears product, query, and risk values", () => {
    const params = new URLSearchParams("branch=ganjlik");
    const updated = (0, riskTableInteraction_1.updateRiskTableSearchParams)(params, {
        product: "greek-yogurt-500g",
        q: " yogurt ",
        risk: "critical",
    });
    strict_1.default.equal(updated.get("branch"), "ganjlik");
    strict_1.default.equal(updated.get("product"), "greek-yogurt-500g");
    strict_1.default.equal(updated.get("q"), "yogurt");
    strict_1.default.equal(updated.get("risk"), "critical");
    const cleared = (0, riskTableInteraction_1.updateRiskTableSearchParams)(updated, {
        product: null,
        q: "",
        risk: "all",
    });
    strict_1.default.equal(cleared.get("product"), null);
    strict_1.default.equal(cleared.get("q"), null);
    strict_1.default.equal(cleared.get("risk"), null);
});
