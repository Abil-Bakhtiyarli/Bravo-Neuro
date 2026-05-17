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
  const replacedRecordIndex = monthlySavingsHistory.findIndex(
    (record) => record.branchId === "ganjlik" && record.monthKey === "2026-04",
  );

  assert.ok(duplicateRecord);
  assert.notEqual(replacedRecordIndex, -1);

  const invalidRecords = [...monthlySavingsHistory];
  invalidRecords.splice(replacedRecordIndex, 1, duplicateRecord);

  assert.throws(
    () => validateMonthlySavingsHistoryRecords(invalidRecords, branchIds),
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

test("validateMonthlySavingsHistoryRecords rejects windows shorter than six months", () => {
  const shortWindow = monthlySavingsHistory.filter((record) => record.monthKey >= "2026-01");

  assert.throws(
    () => validateMonthlySavingsHistoryRecords(shortWindow, branchIds),
    /at least 6 monthly savings history points/,
  );
});
