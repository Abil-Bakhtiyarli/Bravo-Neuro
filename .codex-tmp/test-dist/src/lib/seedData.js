"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDataSummary = exports.wasteHistory = exports.discountHistory = exports.salesHistory = exports.inventory = exports.products = exports.branches = exports.SEED_REFERENCE_DATE = void 0;
const branches_json_1 = __importDefault(require("../../data/branches.json"));
const discount_history_json_1 = __importDefault(require("../../data/discount_history.json"));
const inventory_json_1 = __importDefault(require("../../data/inventory.json"));
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
function validateSeedData() {
    invariant(exports.branches.length === 3, "expected exactly 3 branches");
    invariant(exports.products.length === 8, "expected exactly 8 products");
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
}
validateSeedData();
exports.seedDataSummary = {
    branchCount: exports.branches.length,
    productCount: exports.products.length,
    inventoryLotCount: exports.inventory.length,
    salesRecordCount: exports.salesHistory.length,
    discountRecordCount: exports.discountHistory.length,
    wasteRecordCount: exports.wasteHistory.length,
};
