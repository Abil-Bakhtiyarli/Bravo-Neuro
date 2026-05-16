import branchesJson from "../../data/branches.json";
import discountHistoryJson from "../../data/discount_history.json";
import inventoryJson from "../../data/inventory.json";
import monthlySavingsHistoryJson from "../../data/monthly_savings_history.json";
import productsJson from "../../data/products.json";
import salesHistoryJson from "../../data/sales_history.json";
import wasteHistoryJson from "../../data/waste_history.json";

import type {
  Branch,
  BranchId,
  DiscountHistory,
  InventoryLot,
  MonthlySavingsSeriesPoint,
  Product,
  ProductId,
  SalesHistory,
  WasteHistory,
} from "./types";

export const SEED_REFERENCE_DATE = "2026-05-15";

export const branches = branchesJson as Branch[];
export const products = productsJson as Product[];
export const inventory = inventoryJson as InventoryLot[];
export const salesHistory = salesHistoryJson as SalesHistory[];
export const discountHistory = discountHistoryJson as DiscountHistory[];
export const wasteHistory = wasteHistoryJson as WasteHistory[];
export const monthlySavingsHistory = monthlySavingsHistoryJson as MonthlySavingsSeriesPoint[];

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Seed data invariant failed: ${message}`);
  }
}

function daysUntil(dateString: string) {
  const today = new Date(`${SEED_REFERENCE_DATE}T00:00:00.000Z`);
  const target = new Date(`${dateString}T00:00:00.000Z`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function buildLookup<T extends { branchId: BranchId; productId: ProductId }>(
  records: T[],
) {
  return new Set(records.map((record) => `${record.branchId}:${record.productId}`));
}

function compareMonthKey(a: string, b: string) {
  return a.localeCompare(b);
}

export function validateMonthlySavingsHistoryRecords(
  records: readonly MonthlySavingsSeriesPoint[],
  validBranchIds: readonly BranchId[],
) {
  invariant(records.length > 0, "expected monthly savings history to exist");

  const branchIdSet = new Set(validBranchIds);
  const recordsByBranch = new Map<BranchId, MonthlySavingsSeriesPoint[]>();

  for (const record of records) {
    invariant(
      branchIdSet.has(record.branchId),
      `unknown branchId in monthly savings history: ${record.branchId}`,
    );
    invariant(
      /^\d{4}-\d{2}$/.test(record.monthKey),
      `invalid monthKey in monthly savings history: ${record.monthKey}`,
    );
    invariant(record.monthLabel.length >= 3, `monthLabel must be present for ${record.monthKey}`);
    invariant(
      record.netSavedValueAzN >= 0 &&
        record.recoveredValueAzN >= 0 &&
        record.possibleLossAzN >= 0 &&
        record.taskCount >= 0,
      `monthly savings values must be non-negative for ${record.branchId} ${record.monthKey}`,
    );
    invariant(
      record.possibleLossAzN >= record.recoveredValueAzN &&
        record.recoveredValueAzN >= record.netSavedValueAzN,
      `monthly savings hierarchy must satisfy possible >= recovered >= net for ${record.branchId} ${record.monthKey}`,
    );
    invariant(
      Number.isInteger(record.taskCount),
      `taskCount must be an integer for ${record.branchId} ${record.monthKey}`,
    );

    const branchRecords = recordsByBranch.get(record.branchId) ?? [];
    branchRecords.push(record);
    recordsByBranch.set(record.branchId, branchRecords);
  }

  const expectedMonths = [...new Set(records.map((record) => record.monthKey))].sort(compareMonthKey);
  invariant(expectedMonths.length === 6, "expected exactly 6 monthly savings history points");

  for (const branchId of validBranchIds) {
    const branchRecords = [...(recordsByBranch.get(branchId) ?? [])].sort((a, b) =>
      compareMonthKey(a.monthKey, b.monthKey),
    );
    invariant(
      branchRecords.length === expectedMonths.length,
      `expected a full monthly history window for ${branchId}`,
    );
    invariant(
      new Set(branchRecords.map((record) => record.monthKey)).size === branchRecords.length,
      `monthly history contains duplicate monthKey values for ${branchId}`,
    );
    invariant(
      branchRecords.every((record, index) => record.monthKey === expectedMonths[index]),
      `monthly history for ${branchId} must follow the shared month window order`,
    );
    invariant(
      new Set(branchRecords.map((record) => record.netSavedValueAzN)).size > 1,
      `monthly history for ${branchId} must show real variation`,
    );
  }

  const latestMonth = expectedMonths.at(-1);
  invariant(latestMonth !== undefined, "expected a latest month in monthly savings history");

  const latestNetSavedByBranch = new Map<BranchId, number>();
  for (const branchId of validBranchIds) {
    const latestRecord = recordsByBranch
      .get(branchId)
      ?.find((record) => record.monthKey === latestMonth);
    invariant(latestRecord, `missing latest monthly history point for ${branchId}`);
    latestNetSavedByBranch.set(branchId, latestRecord.netSavedValueAzN);
  }

  invariant(
    (latestNetSavedByBranch.get("ganjlik") ?? 0) > (latestNetSavedByBranch.get("yasamal") ?? 0) &&
      (latestNetSavedByBranch.get("yasamal") ?? 0) > (latestNetSavedByBranch.get("may28") ?? 0),
    "latest monthly savings should preserve the seeded branch performance ranking",
  );
}

function validateSeedData() {
  invariant(branches.length === 3, "expected exactly 3 branches");
  invariant(products.length === 8, "expected exactly 8 products");

  const branchIds = new Set(branches.map((branch) => branch.branchId));
  const productIds = new Set(products.map((product) => product.productId));

  const salesPairs = buildLookup(salesHistory);
  const wastePairs = buildLookup(wasteHistory);

  for (const lot of inventory) {
    invariant(branchIds.has(lot.branchId), `unknown branchId in inventory: ${lot.branchId}`);
    invariant(productIds.has(lot.productId), `unknown productId in inventory: ${lot.productId}`);
    invariant(lot.currentStock > 0, `inventory stock must be positive for ${lot.productId}`);
    invariant(
      Number.isFinite(Date.parse(`${lot.expiryDate}T00:00:00.000Z`)),
      `invalid expiryDate for ${lot.productId}: ${lot.expiryDate}`,
    );
  }

  for (const sale of salesHistory) {
    invariant(branchIds.has(sale.branchId), `unknown branchId in sales: ${sale.branchId}`);
    invariant(productIds.has(sale.productId), `unknown productId in sales: ${sale.productId}`);
    invariant(
      sale.last7DaysSales >= sale.avgDailySales,
      `last7DaysSales must be at least avgDailySales for ${sale.productId}`,
    );
  }

  for (const record of discountHistory) {
    invariant(
      branchIds.has(record.branchId),
      `unknown branchId in discount history: ${record.branchId}`,
    );
    invariant(
      productIds.has(record.productId),
      `unknown productId in discount history: ${record.productId}`,
    );
    invariant(
      record.responseRate >= 0 && record.responseRate <= 1,
      `discount responseRate must be between 0 and 1 for ${record.productId}`,
    );
  }

  for (const record of wasteHistory) {
    invariant(
      branchIds.has(record.branchId),
      `unknown branchId in waste history: ${record.branchId}`,
    );
    invariant(
      productIds.has(record.productId),
      `unknown productId in waste history: ${record.productId}`,
    );
    invariant(
      record.categoryWasteRate >= 0 && record.categoryWasteRate <= 1,
      `categoryWasteRate must be between 0 and 1 for ${record.productId}`,
    );
  }

  for (const lot of inventory) {
    const pair = `${lot.branchId}:${lot.productId}`;
    invariant(salesPairs.has(pair), `missing sales history for ${pair}`);
    invariant(wastePairs.has(pair), `missing waste history for ${pair}`);
  }

  invariant(
    inventory.some((lot) => daysUntil(lot.expiryDate) <= 2),
    "expected at least one critical expiry lot within 1-2 days",
  );
  invariant(
    inventory.filter((lot) => {
      const days = daysUntil(lot.expiryDate);
      return days >= 3 && days <= 5;
    }).length >= 2,
    "expected at least two high-risk lots within 3-5 days",
  );

  const salesByPair = new Map(
    salesHistory.map((record) => [`${record.branchId}:${record.productId}`, record]),
  );

  const hasTransferCase = products.some((product) => {
    const source = salesByPair.get(`ganjlik:${product.productId}`);
    const destination = salesByPair.get(`may28:${product.productId}`);

    return (
      source !== undefined &&
      destination !== undefined &&
      destination.avgDailySales >= source.avgDailySales * 1.5
    );
  });
  invariant(hasTransferCase, "expected at least one transfer-favorable case");

  const inventoryByPair = new Map<string, number>();
  for (const lot of inventory) {
    const key = `${lot.branchId}:${lot.productId}`;
    inventoryByPair.set(key, (inventoryByPair.get(key) ?? 0) + lot.currentStock);
  }

  const hasReorderCase = salesHistory.some((record) => {
    const stock = inventoryByPair.get(`${record.branchId}:${record.productId}`) ?? 0;
    const waste = wasteHistory.find(
      (item) =>
        item.branchId === record.branchId && item.productId === record.productId,
    );

    return (
      stock >= record.avgDailySales * 10 &&
      (waste?.previousWasteUnits ?? 0) >= 5
    );
  });
  invariant(hasReorderCase, "expected at least one reorder-reduction case");

  const hasLowRiskCase = salesHistory.some((record) => {
    const stock = inventoryByPair.get(`${record.branchId}:${record.productId}`) ?? 0;
    const latestLot = inventory.find(
      (lot) => lot.branchId === record.branchId && lot.productId === record.productId,
    );

    return (
      latestLot !== undefined &&
      daysUntil(latestLot.expiryDate) >= 7 &&
      stock <= record.avgDailySales * 3
    );
  });
  invariant(hasLowRiskCase, "expected at least one low-risk case");

  validateMonthlySavingsHistoryRecords(monthlySavingsHistory, branches.map((branch) => branch.branchId));
}

validateSeedData();

export const seedDataSummary = {
  branchCount: branches.length,
  productCount: products.length,
  inventoryLotCount: inventory.length,
  salesRecordCount: salesHistory.length,
  discountRecordCount: discountHistory.length,
  wasteRecordCount: wasteHistory.length,
  monthlySavingsHistoryCount: monthlySavingsHistory.length,
} as const;
