import branchesJson from "../../data/branches.json";
import discountHistoryJson from "../../data/discount_history.json";
import inventoryJson from "../../data/inventory.json";
import productsJson from "../../data/products.json";
import salesHistoryJson from "../../data/sales_history.json";
import wasteHistoryJson from "../../data/waste_history.json";

import type {
  Branch,
  BranchId,
  DiscountHistory,
  InventoryLot,
  Product,
  ProductId,
  SalesHistory,
  WasteHistory,
} from "@/lib/types";

export const branches = branchesJson as Branch[];
export const products = productsJson as Product[];
export const inventory = inventoryJson as InventoryLot[];
export const salesHistory = salesHistoryJson as SalesHistory[];
export const discountHistory = discountHistoryJson as DiscountHistory[];
export const wasteHistory = wasteHistoryJson as WasteHistory[];

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Seed data invariant failed: ${message}`);
  }
}

function daysUntil(dateString: string) {
  const today = new Date("2026-05-15T00:00:00.000Z");
  const target = new Date(`${dateString}T00:00:00.000Z`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function buildLookup<T extends { branchId: BranchId; productId: ProductId }>(
  records: T[],
) {
  return new Set(records.map((record) => `${record.branchId}:${record.productId}`));
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
}

validateSeedData();

export const seedDataSummary = {
  branchCount: branches.length,
  productCount: products.length,
  inventoryLotCount: inventory.length,
  salesRecordCount: salesHistory.length,
  discountRecordCount: discountHistory.length,
  wasteRecordCount: wasteHistory.length,
} as const;
