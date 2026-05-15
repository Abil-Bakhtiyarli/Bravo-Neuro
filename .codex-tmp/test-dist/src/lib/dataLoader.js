"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableBranches = getAvailableBranches;
exports.getBranchProductRecords = getBranchProductRecords;
exports.getBranchProductRecord = getBranchProductRecord;
const seedData_1 = require("./seedData");
const MS_PER_DAY = 86400000;
function createLookupKey(branchId, productId) {
    return `${branchId}:${productId}`;
}
function parseReferenceDate(referenceDate) {
    const parsed = Date.parse(`${referenceDate}T00:00:00.000Z`);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Invalid referenceDate: ${referenceDate}`);
    }
    return parsed;
}
function getDaysUntil(dateString, referenceTimestamp) {
    const targetTimestamp = Date.parse(`${dateString}T00:00:00.000Z`);
    if (!Number.isFinite(targetTimestamp)) {
        throw new Error(`Invalid expiryDate in seed data: ${dateString}`);
    }
    return Math.round((targetTimestamp - referenceTimestamp) / MS_PER_DAY);
}
function sortLotsByExpiry(lots) {
    return [...lots].sort((left, right) => left.expiryDate.localeCompare(right.expiryDate));
}
function groupInventoryByLookup() {
    const inventoryByLookup = new Map();
    for (const lot of seedData_1.inventory) {
        const lookupKey = createLookupKey(lot.branchId, lot.productId);
        const existingLots = inventoryByLookup.get(lookupKey);
        if (existingLots) {
            existingLots.push(lot);
            continue;
        }
        inventoryByLookup.set(lookupKey, [lot]);
    }
    return inventoryByLookup;
}
function indexByLookup(records) {
    return new Map(records.map((record) => [createLookupKey(record.branchId, record.productId), record]));
}
const branchesById = new Map(seedData_1.branches.map((branch) => [branch.branchId, branch]));
const productsById = new Map(seedData_1.products.map((product) => [product.productId, product]));
const inventoryByLookup = groupInventoryByLookup();
const salesByLookup = indexByLookup(seedData_1.salesHistory);
const wasteByLookup = indexByLookup(seedData_1.wasteHistory);
const discountByLookup = indexByLookup(seedData_1.discountHistory);
const totalStockByLookup = new Map([...inventoryByLookup.entries()].map(([lookupKey, lots]) => [
    lookupKey,
    lots.reduce((sum, lot) => sum + lot.currentStock, 0),
]));
const crossBranchSalesByProduct = new Map();
for (const sale of seedData_1.salesHistory) {
    const branch = branchesById.get(sale.branchId);
    if (!branch) {
        throw new Error(`Seed data invariant failed: missing branch for sales record ${sale.branchId}`);
    }
    const lookupKey = createLookupKey(sale.branchId, sale.productId);
    const totalStock = totalStockByLookup.get(lookupKey) ?? 0;
    const snapshots = crossBranchSalesByProduct.get(sale.productId) ?? [];
    snapshots.push({
        branchId: sale.branchId,
        branchName: branch.branchName,
        demandProfile: branch.demandProfile,
        avgDailySales: sale.avgDailySales,
        last7DaysSales: sale.last7DaysSales,
        totalStock,
    });
    crossBranchSalesByProduct.set(sale.productId, snapshots);
}
for (const snapshots of crossBranchSalesByProduct.values()) {
    snapshots.sort((left, right) => right.avgDailySales - left.avgDailySales);
}
function getRequiredPairRecord(branchId, productId) {
    const branch = branchesById.get(branchId);
    if (!branch) {
        throw new Error(`Unknown branchId: ${branchId}`);
    }
    const product = productsById.get(productId);
    const lookupKey = createLookupKey(branchId, productId);
    const lots = inventoryByLookup.get(lookupKey);
    const sales = salesByLookup.get(lookupKey);
    const waste = wasteByLookup.get(lookupKey);
    if (!product) {
        throw new Error(`Seed data invariant failed: missing product for ${lookupKey}`);
    }
    if (!lots || lots.length === 0) {
        throw new Error(`Seed data invariant failed: missing inventory for ${lookupKey}`);
    }
    if (!sales) {
        throw new Error(`Seed data invariant failed: missing sales history for ${lookupKey}`);
    }
    if (!waste) {
        throw new Error(`Seed data invariant failed: missing waste history for ${lookupKey}`);
    }
    return {
        branch,
        product,
        lots,
        sales,
        waste,
        discount: discountByLookup.get(lookupKey),
    };
}
function buildEnrichedLots(lots, unitPrice, referenceTimestamp) {
    return sortLotsByExpiry(lots).map((lot) => ({
        ...lot,
        daysUntilExpiry: getDaysUntil(lot.expiryDate, referenceTimestamp),
        stockValueAzN: Number((lot.currentStock * unitPrice).toFixed(2)),
    }));
}
function calculateDaysOfStockRemaining(totalStock, avgDailySales) {
    if (avgDailySales <= 0) {
        return null;
    }
    return Number((totalStock / avgDailySales).toFixed(2));
}
function buildBranchProductRecord(branchId, productId, options) {
    const referenceTimestamp = parseReferenceDate(options?.referenceDate ?? seedData_1.SEED_REFERENCE_DATE);
    const pairRecord = getRequiredPairRecord(branchId, productId);
    const inventoryLots = buildEnrichedLots(pairRecord.lots, pairRecord.product.unitPrice, referenceTimestamp);
    const earliestExpiryDate = inventoryLots[0]?.expiryDate;
    const latestExpiryDate = inventoryLots.at(-1)?.expiryDate;
    const totalStock = inventoryLots.reduce((sum, lot) => sum + lot.currentStock, 0);
    const stockValueAzN = Number(inventoryLots.reduce((sum, lot) => sum + lot.stockValueAzN, 0).toFixed(2));
    if (!earliestExpiryDate || !latestExpiryDate) {
        throw new Error(`Seed data invariant failed: inventoryLots missing required expiry dates for ${branchId}:${productId}`);
    }
    return {
        lookupKey: createLookupKey(branchId, productId),
        branch: pairRecord.branch,
        product: pairRecord.product,
        inventoryLots,
        salesHistory: pairRecord.sales,
        discountHistory: pairRecord.discount,
        wasteHistory: pairRecord.waste,
        totalStock,
        lotCount: inventoryLots.length,
        earliestExpiryDate,
        latestExpiryDate,
        daysUntilEarliestExpiry: inventoryLots[0].daysUntilExpiry,
        daysOfStockRemaining: calculateDaysOfStockRemaining(totalStock, pairRecord.sales.avgDailySales),
        hasDiscountHistory: pairRecord.discount !== undefined,
        stockValueAzN,
        crossBranchSales: [...(crossBranchSalesByProduct.get(productId) ?? [])],
    };
}
function getAvailableBranches() {
    return [...seedData_1.branches];
}
function getBranchProductRecords(branchId, options) {
    if (!branchesById.has(branchId)) {
        throw new Error(`Unknown branchId: ${branchId}`);
    }
    return [...inventoryByLookup.keys()]
        .filter((lookupKey) => lookupKey.startsWith(`${branchId}:`))
        .map((lookupKey) => {
        const [, productId] = lookupKey.split(":");
        return buildBranchProductRecord(branchId, productId, options);
    })
        .sort((left, right) => left.product.name.localeCompare(right.product.name));
}
function getBranchProductRecord(branchId, productId, options) {
    if (!branchesById.has(branchId)) {
        throw new Error(`Unknown branchId: ${branchId}`);
    }
    const lookupKey = createLookupKey(branchId, productId);
    if (!inventoryByLookup.has(lookupKey)) {
        return undefined;
    }
    return buildBranchProductRecord(branchId, productId, options);
}
