import test from "node:test";
import assert from "node:assert/strict";

import {
  getAvailableBranches,
  getBranchProductRecord,
  getBranchProductRecords,
} from "./dataLoader";

test("getAvailableBranches returns the seeded branches", () => {
  const availableBranches = getAvailableBranches();

  assert.equal(availableBranches.length, 3);
  assert.deepEqual(
    availableBranches.map((branch) => branch.branchId),
    ["ganjlik", "yasamal", "may28"],
  );
});

test("valid branch returns one enriched record per inventory-backed branch-product pair", () => {
  const ganjlikRecords = getBranchProductRecords("ganjlik");

  assert.equal(ganjlikRecords.length, 6);
  assert.ok(ganjlikRecords.every((record) => record.branch.branchId === "ganjlik"));
});

test("ganjlik Greek yogurt aggregates lots and sorts them by nearest expiry", () => {
  const record = getBranchProductRecord("ganjlik", "greek-yogurt-500g");

  assert.ok(record);
  assert.equal(record.lookupKey, "ganjlik:greek-yogurt-500g");
  assert.equal(record.totalStock, 30);
  assert.equal(record.lotCount, 2);
  assert.equal(record.earliestExpiryDate, "2026-05-16");
  assert.equal(record.latestExpiryDate, "2026-05-18");
  assert.equal(record.daysUntilEarliestExpiry, 1);
  assert.equal(record.daysOfStockRemaining, 7.5);
  assert.equal(record.stockValueAzN, 147);
  assert.deepEqual(
    record.inventoryLots.map((lot) => lot.expiryDate),
    ["2026-05-16", "2026-05-18"],
  );
  assert.deepEqual(
    record.inventoryLots.map((lot) => lot.daysUntilExpiry),
    [1, 3],
  );
});

test("default reference date stays anchored to the seeded demo scenario", () => {
  const record = getBranchProductRecord("ganjlik", "greek-yogurt-500g");

  assert.ok(record);
  assert.equal(record.daysUntilEarliestExpiry, 1);
});

test("referenceDate override changes derived expiry calculations", () => {
  const record = getBranchProductRecord("ganjlik", "greek-yogurt-500g", {
    referenceDate: "2026-05-14",
  });

  assert.ok(record);
  assert.equal(record.daysUntilEarliestExpiry, 2);
  assert.deepEqual(
    record.inventoryLots.map((lot) => lot.daysUntilExpiry),
    [2, 4],
  );
});

test("missing discount history stays non-fatal and resolves to undefined", () => {
  const record = getBranchProductRecord("ganjlik", "bananas");

  assert.ok(record);
  assert.equal(record.hasDiscountHistory, false);
  assert.equal(record.discountHistory, undefined);
});

test("unknown branch throws a clear error", () => {
  assert.throws(
    () => getBranchProductRecords("missing-branch"),
    /Unknown branchId: missing-branch/,
  );
});

test("missing product in a valid branch returns undefined", () => {
  const record = getBranchProductRecord("ganjlik", "missing-product");

  assert.equal(record, undefined);
});

test("cross-branch sales snapshot is available for transfer-oriented comparisons", () => {
  const record = getBranchProductRecord("ganjlik", "greek-yogurt-500g");

  assert.ok(record);
  assert.equal(record.crossBranchSales.length, 3);
  assert.deepEqual(
    record.crossBranchSales.map((snapshot) => snapshot.branchId),
    ["may28", "yasamal", "ganjlik"],
  );
});
