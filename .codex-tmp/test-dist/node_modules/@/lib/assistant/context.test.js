"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const context_1 = require("./context");
(0, node_test_1.default)("buildAssistantContextSnapshot uses canonical dashboard data and preserves branch scope", () => {
    const snapshot = (0, context_1.buildAssistantContextSnapshot)("ganjlik", "greek-yogurt-500g");
    strict_1.default.equal(snapshot.branch.branchId, "ganjlik");
    strict_1.default.equal(snapshot.selectedProduct?.branch.branchId, "ganjlik");
    strict_1.default.equal(snapshot.selectedProduct?.product.productId, "greek-yogurt-500g");
    strict_1.default.ok(snapshot.branch.kpis.length > 0);
    strict_1.default.ok(snapshot.branch.topRiskProducts.length > 0);
    strict_1.default.ok(snapshot.branch.actionPlan.length > 0);
});
(0, node_test_1.default)("buildAssistantContextSnapshot handles an invalid product id without throwing", () => {
    const snapshot = (0, context_1.buildAssistantContextSnapshot)("ganjlik", "missing-product");
    strict_1.default.equal(snapshot.branch.branchId, "ganjlik");
    strict_1.default.equal(snapshot.selectedProduct, null);
    strict_1.default.equal(snapshot.selectedProductRiskRow, null);
    strict_1.default.equal(snapshot.selectedProductAction, null);
});
(0, node_test_1.default)("buildAssistantBranchSnapshot scales from current arrays without fixed ids", () => {
    const snapshot = (0, context_1.buildAssistantBranchSnapshot)("may28", {
        topRiskLimit: 3,
        actionLimit: 2,
        seriesLimit: 4,
    });
    strict_1.default.equal(snapshot.branchId, "may28");
    strict_1.default.ok(snapshot.topRiskProducts.length <= 3);
    strict_1.default.ok(snapshot.actionPlan.length <= 2);
    strict_1.default.ok(snapshot.monthlySavingsSeries.length <= 4);
});
