import assert from "node:assert/strict";
import test from "node:test";

import { monthlySavingsHistory, validateMonthlySavingsHistoryRecords } from "./seedData";

const branchIds = ["ganjlik", "yasamal", "may28"];

test("validateMonthlySavingsHistoryRecords rejects a missing month for a branch", () => {
  const invalidRecords = monthlySavingsHistory.filter(
    (record) => !(record.branchId === "ganjlik" && record.monthKey === "2026-05"),
  );

  assert.throws(
    () => validateMonthlySavingsHistoryRecords(invalidRecords, branchIds),
    /full monthly history window/,
  );
});

test("validateMonthlySavingsHistoryRecords rejects duplicate months for a branch", () => {
  const duplicateRecord = monthlySavingsHistory.find(
    (record) => record.branchId === "ganjlik" && record.monthKey === "2026-05",
  );

  assert.ok(duplicateRecord);

  assert.throws(
    () => validateMonthlySavingsHistoryRecords([...monthlySavingsHistory, duplicateRecord], branchIds),
    /duplicate monthKey/,
  );
});

test("validateMonthlySavingsHistoryRecords rejects negative AZN values", () => {
  const invalidRecords = monthlySavingsHistory.map((record) =>
    record.branchId === "may28" && record.monthKey === "2026-05"
      ? { ...record, netSavedValueAzN: -1 }
      : record,
  );

  assert.throws(
    () => validateMonthlySavingsHistoryRecords(invalidRecords, branchIds),
    /must be non-negative/,
  );
});
