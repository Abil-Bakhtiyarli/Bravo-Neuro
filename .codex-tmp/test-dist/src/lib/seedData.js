"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDataSummary = exports.monthlySavingsHistory = exports.wasteHistory = exports.discountHistory = exports.salesHistory = exports.inventory = exports.products = exports.branches = exports.SEED_REFERENCE_DATE = void 0;
exports.validateMonthlySavingsHistoryRecords = validateMonthlySavingsHistoryRecords;
const branches_json_1 = __importDefault(require("../../data/branches.json"));
const discount_history_json_1 = __importDefault(require("../../data/discount_history.json"));
const inventory_json_1 = __importDefault(require("../../data/inventory.json"));
const monthly_savings_history_json_1 = __importDefault(require("../../data/monthly_savings_history.json"));
const products_json_1 = __importDefault(require("../../data/products.json"));
const sales_history_json_1 = __importDefault(require("../../data/sales_history.json"));
const waste_history_json_1 = __importDefault(require("../../data/waste_history.json"));
exports.SEED_REFERENCE_DATE = "2026-05-15";
exports.branches = branches_json_1.default;
exports.products = products_json_1.default;
exports.inventory = inventory_json_1.default;
exports.salesHistory = sales_history_json_1.default;
exports.discountHistory = discount_history_json_1.default;
exports.wasteHistory = waste_history_json_1.default;
exports.monthlySavingsHistory = monthly_savings_history_json_1.default;
function invariant(condition, message) {
    if (!condition) {
        throw new Error(`Seed data invariant failed: ${message}`);
    }
}
function daysUntil(dateString) {
    const today = new Date(`${exports.SEED_REFERENCE_DATE}T00:00:00.000Z`);
    const target = new Date(`${dateString}T00:00:00.000Z`);
    return Math.round((target.getTime() - today.getTime()) / 86400000);
}
function buildLookup(records) {
    return new Set(records.map((record) => `${record.branchId}:${record.productId}`));
}
function compareMonthKey(a, b) {
    return a.localeCompare(b);
}
function validateMonthlySavingsHistoryRecords(records, validBranchIds) {
    invariant(records.length > 0, "expected monthly savings history to exist");
    const branchIdSet = new Set(validBranchIds);
    const recordsByBranch = new Map();
    for (const record of records) {
        invariant(branchIdSet.has(record.branchId), `unknown branchId in monthly savings history: ${record.branchId}`);
        invariant(/^\d{4}-\d{2}$/.test(record.monthKey), `invalid monthKey in monthly savings history: ${record.monthKey}`);
        invariant(record.monthLabel.length >= 3, `monthLabel must be present for ${record.monthKey}`);
        invariant(record.netSavedValueAzN >= 0 &&
            record.recoveredValueAzN >= 0 &&
            record.possibleLossAzN >= 0 &&
            record.taskCount >= 0, `monthly savings values must be non-negative for ${record.branchId} ${record.monthKey}`);
        invariant(record.possibleLossAzN >= record.recoveredValueAzN &&
            record.recoveredValueAzN >= record.netSavedValueAzN, `monthly savings hierarchy must satisfy possible >= recovered >= net for ${record.branchId} ${record.monthKey}`);
        invariant(Number.isInteger(record.taskCount), `taskCount must be an integer for ${record.branchId} ${record.monthKey}`);
        const branchRecords = recordsByBranch.get(record.branchId) ?? [];
        branchRecords.push(record);
        recordsByBranch.set(record.branchId, branchRecords);
    }
    const expectedMonths = [...new Set(records.map((record) => record.monthKey))].sort(compareMonthKey);
    invariant(expectedMonths.length >= 6, "expected at least 6 monthly savings history points");
    for (const branchId of validBranchIds) {
        const branchRecords = [...(recordsByBranch.get(branchId) ?? [])].sort((a, b) => compareMonthKey(a.monthKey, b.monthKey));
        invariant(branchRecords.length === expectedMonths.length, `expected a full monthly history window for ${branchId}`);
        invariant(new Set(branchRecords.map((record) => record.monthKey)).size === branchRecords.length, `monthly history contains duplicate monthKey values for ${branchId}`);
        invariant(branchRecords.every((record, index) => record.monthKey === expectedMonths[index]), `monthly history for ${branchId} must follow the shared month window order`);
        invariant(new Set(branchRecords.map((record) => record.netSavedValueAzN)).size > 1, `monthly history for ${branchId} must show real variation`);
    }
    const latestMonth = expectedMonths.at(-1);
    invariant(latestMonth !== undefined, "expected a latest month in monthly savings history");
    const latestNetSavedByBranch = new Map();
    for (const branchId of validBranchIds) {
        const latestRecord = recordsByBranch
            .get(branchId)
            ?.find((record) => record.monthKey === latestMonth);
        invariant(latestRecord, `missing latest monthly history point for ${branchId}`);
        latestNetSavedByBranch.set(branchId, latestRecord.netSavedValueAzN);
    }
    invariant((latestNetSavedByBranch.get("ganjlik") ?? 0) > (latestNetSavedByBranch.get("yasamal") ?? 0) &&
        (latestNetSavedByBranch.get("yasamal") ?? 0) > (latestNetSavedByBranch.get("may28") ?? 0), "latest monthly savings should preserve the seeded branch performance ranking");
}
function validateSeedData() {
    invariant(exports.branches.length === 3, "expected exactly 3 branches");
    invariant(exports.products.length >= 158, "expected at least 158 seeded products");
    const branchIds = new Set(exports.branches.map((branch) => branch.branchId));
    const productIds = new Set(exports.products.map((product) => product.productId));
    const salesPairs = buildLookup(exports.salesHistory);
    const wastePairs = buildLookup(exports.wasteHistory);
    for (const lot of exports.inventory) {
        invariant(branchIds.has(lot.branchId), `unknown branchId in inventory: ${lot.branchId}`);
        invariant(productIds.has(lot.productId), `unknown productId in inventory: ${lot.productId}`);
        invariant(lot.currentStock > 0, `inventory stock must be positive for ${lot.productId}`);
        invariant(Number.isFinite(Date.parse(`${lot.expiryDate}T00:00:00.000Z`)), `invalid expiryDate for ${lot.productId}: ${lot.expiryDate}`);
    }
    for (const sale of exports.salesHistory) {
        invariant(branchIds.has(sale.branchId), `unknown branchId in sales: ${sale.branchId}`);
        invariant(productIds.has(sale.productId), `unknown productId in sales: ${sale.productId}`);
        invariant(sale.last7DaysSales >= sale.avgDailySales, `last7DaysSales must be at least avgDailySales for ${sale.productId}`);
    }
    for (const record of exports.discountHistory) {
        invariant(branchIds.has(record.branchId), `unknown branchId in discount history: ${record.branchId}`);
        invariant(productIds.has(record.productId), `unknown productId in discount history: ${record.productId}`);
        invariant(record.responseRate >= 0 && record.responseRate <= 1, `discount responseRate must be between 0 and 1 for ${record.productId}`);
    }
    for (const record of exports.wasteHistory) {
        invariant(branchIds.has(record.branchId), `unknown branchId in waste history: ${record.branchId}`);
        invariant(productIds.has(record.productId), `unknown productId in waste history: ${record.productId}`);
        invariant(record.categoryWasteRate >= 0 && record.categoryWasteRate <= 1, `categoryWasteRate must be between 0 and 1 for ${record.productId}`);
    }
    for (const lot of exports.inventory) {
        const pair = `${lot.branchId}:${lot.productId}`;
        invariant(salesPairs.has(pair), `missing sales history for ${pair}`);
        invariant(wastePairs.has(pair), `missing waste history for ${pair}`);
    }
    invariant(exports.inventory.some((lot) => daysUntil(lot.expiryDate) <= 2), "expected at least one critical expiry lot within 1-2 days");
    invariant(exports.inventory.filter((lot) => {
        const days = daysUntil(lot.expiryDate);
        return days >= 3 && days <= 5;
    }).length >= 2, "expected at least two high-risk lots within 3-5 days");
    const salesByPair = new Map(exports.salesHistory.map((record) => [`${record.branchId}:${record.productId}`, record]));
    const hasTransferCase = exports.products.some((product) => {
        const source = salesByPair.get(`ganjlik:${product.productId}`);
        const destination = salesByPair.get(`may28:${product.productId}`);
        return (source !== undefined &&
            destination !== undefined &&
            destination.avgDailySales >= source.avgDailySales * 1.5);
    });
    invariant(hasTransferCase, "expected at least one transfer-favorable case");
    const inventoryByPair = new Map();
    for (const lot of exports.inventory) {
        const key = `${lot.branchId}:${lot.productId}`;
        inventoryByPair.set(key, (inventoryByPair.get(key) ?? 0) + lot.currentStock);
    }
    const hasReorderCase = exports.salesHistory.some((record) => {
        const stock = inventoryByPair.get(`${record.branchId}:${record.productId}`) ?? 0;
        const waste = exports.wasteHistory.find((item) => item.branchId === record.branchId && item.productId === record.productId);
        return (stock >= record.avgDailySales * 10 &&
            (waste?.previousWasteUnits ?? 0) >= 5);
    });
    invariant(hasReorderCase, "expected at least one reorder-reduction case");
    const hasLowRiskCase = exports.salesHistory.some((record) => {
        const stock = inventoryByPair.get(`${record.branchId}:${record.productId}`) ?? 0;
        const latestLot = exports.inventory.find((lot) => lot.branchId === record.branchId && lot.productId === record.productId);
        return (latestLot !== undefined &&
            daysUntil(latestLot.expiryDate) >= 7 &&
            stock <= record.avgDailySales * 3);
    });
    invariant(hasLowRiskCase, "expected at least one low-risk case");
    validateMonthlySavingsHistoryRecords(exports.monthlySavingsHistory, exports.branches.map((branch) => branch.branchId));
}
validateSeedData();
exports.seedDataSummary = {
    branchCount: exports.branches.length,
    productCount: exports.products.length,
    inventoryLotCount: exports.inventory.length,
    salesRecordCount: exports.salesHistory.length,
    discountRecordCount: exports.discountHistory.length,
    wasteRecordCount: exports.wasteHistory.length,
    monthlySavingsHistoryCount: exports.monthlySavingsHistory.length,
};
