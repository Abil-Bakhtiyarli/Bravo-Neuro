"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const dataLoader_1 = require("./dataLoader");
(0, node_test_1.default)("getAvailableBranches returns the seeded branches", () => {
    const availableBranches = (0, dataLoader_1.getAvailableBranches)();
    strict_1.default.equal(availableBranches.length, 3);
    strict_1.default.deepEqual(availableBranches.map((branch) => branch.branchId), ["ganjlik", "yasamal", "may28"]);
});
(0, node_test_1.default)("valid branch returns one enriched record per inventory-backed branch-product pair", () => {
    const ganjlikRecords = (0, dataLoader_1.getBranchProductRecords)("ganjlik");
    strict_1.default.equal(ganjlikRecords.length, 6);
    strict_1.default.ok(ganjlikRecords.every((record) => record.branch.branchId === "ganjlik"));
});
(0, node_test_1.default)("ganjlik Greek yogurt aggregates lots and sorts them by nearest expiry", () => {
    const record = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "greek-yogurt-500g");
    strict_1.default.ok(record);
    strict_1.default.equal(record.lookupKey, "ganjlik:greek-yogurt-500g");
    strict_1.default.equal(record.totalStock, 30);
    strict_1.default.equal(record.lotCount, 2);
    strict_1.default.equal(record.earliestExpiryDate, "2026-05-16");
    strict_1.default.equal(record.latestExpiryDate, "2026-05-18");
    strict_1.default.equal(record.daysUntilEarliestExpiry, 1);
    strict_1.default.equal(record.daysOfStockRemaining, 7.5);
    strict_1.default.equal(record.stockValueAzN, 147);
    strict_1.default.deepEqual(record.inventoryLots.map((lot) => lot.expiryDate), ["2026-05-16", "2026-05-18"]);
    strict_1.default.deepEqual(record.inventoryLots.map((lot) => lot.daysUntilExpiry), [1, 3]);
});
(0, node_test_1.default)("default reference date stays anchored to the seeded demo scenario", () => {
    const record = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "greek-yogurt-500g");
    strict_1.default.ok(record);
    strict_1.default.equal(record.daysUntilEarliestExpiry, 1);
});
(0, node_test_1.default)("referenceDate override changes derived expiry calculations", () => {
    const record = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "greek-yogurt-500g", {
        referenceDate: "2026-05-14",
    });
    strict_1.default.ok(record);
    strict_1.default.equal(record.daysUntilEarliestExpiry, 2);
    strict_1.default.deepEqual(record.inventoryLots.map((lot) => lot.daysUntilExpiry), [2, 4]);
});
(0, node_test_1.default)("missing discount history stays non-fatal and resolves to undefined", () => {
    const record = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "bananas");
    strict_1.default.ok(record);
    strict_1.default.equal(record.hasDiscountHistory, false);
    strict_1.default.equal(record.discountHistory, undefined);
});
(0, node_test_1.default)("unknown branch throws a clear error", () => {
    strict_1.default.throws(() => (0, dataLoader_1.getBranchProductRecords)("missing-branch"), /Unknown branchId: missing-branch/);
});
(0, node_test_1.default)("missing product in a valid branch returns undefined", () => {
    const record = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "missing-product");
    strict_1.default.equal(record, undefined);
});
(0, node_test_1.default)("cross-branch sales snapshot is available for transfer-oriented comparisons", () => {
    const record = (0, dataLoader_1.getBranchProductRecord)("ganjlik", "greek-yogurt-500g");
    strict_1.default.ok(record);
    strict_1.default.equal(record.crossBranchSales.length, 3);
    strict_1.default.deepEqual(record.crossBranchSales.map((snapshot) => snapshot.branchId), ["may28", "yasamal", "ganjlik"]);
});
