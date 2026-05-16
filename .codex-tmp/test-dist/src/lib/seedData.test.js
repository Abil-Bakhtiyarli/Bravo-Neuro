"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const seedData_1 = require("./seedData");
const branchIds = ["ganjlik", "yasamal", "may28"];
(0, node_test_1.default)("validateMonthlySavingsHistoryRecords rejects a missing month for a branch", () => {
    const invalidRecords = seedData_1.monthlySavingsHistory.filter((record) => !(record.branchId === "ganjlik" && record.monthKey === "2026-05"));
    strict_1.default.throws(() => (0, seedData_1.validateMonthlySavingsHistoryRecords)(invalidRecords, branchIds), /full monthly history window/);
});
(0, node_test_1.default)("validateMonthlySavingsHistoryRecords rejects duplicate months for a branch", () => {
    const duplicateRecord = seedData_1.monthlySavingsHistory.find((record) => record.branchId === "ganjlik" && record.monthKey === "2026-05");
    const replacedRecordIndex = seedData_1.monthlySavingsHistory.findIndex((record) => record.branchId === "ganjlik" && record.monthKey === "2026-04");
    strict_1.default.ok(duplicateRecord);
    strict_1.default.notEqual(replacedRecordIndex, -1);
    const invalidRecords = [...seedData_1.monthlySavingsHistory];
    invalidRecords.splice(replacedRecordIndex, 1, duplicateRecord);
    strict_1.default.throws(() => (0, seedData_1.validateMonthlySavingsHistoryRecords)(invalidRecords, branchIds), /duplicate monthKey/);
});
(0, node_test_1.default)("validateMonthlySavingsHistoryRecords rejects negative AZN values", () => {
    const invalidRecords = seedData_1.monthlySavingsHistory.map((record) => record.branchId === "may28" && record.monthKey === "2026-05"
        ? { ...record, netSavedValueAzN: -1 }
        : record);
    strict_1.default.throws(() => (0, seedData_1.validateMonthlySavingsHistoryRecords)(invalidRecords, branchIds), /must be non-negative/);
});
