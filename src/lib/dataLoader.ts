import {
  branches,
  discountHistory,
  inventory,
  products,
  salesHistory,
  SEED_REFERENCE_DATE,
  wasteHistory,
} from "./seedData";
import type {
  Branch,
  BranchId,
  BranchProductLookup,
  CrossBranchSalesSnapshot,
  DiscountHistory,
  EnrichedBranchProductRecord,
  EnrichedInventoryLot,
  InventoryLot,
  LoaderOptions,
  Product,
  ProductId,
  SalesHistory,
  WasteHistory,
} from "./types";

type RequiredPairRecord = {
  branch: Branch;
  product: Product;
  lots: InventoryLot[];
  sales: SalesHistory;
  waste: WasteHistory;
  discount?: DiscountHistory;
};

const MS_PER_DAY = 86_400_000;

function createLookupKey(branchId: BranchId, productId: ProductId): BranchProductLookup {
  return `${branchId}:${productId}`;
}

function parseReferenceDate(referenceDate: string) {
  const parsed = Date.parse(`${referenceDate}T00:00:00.000Z`);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid referenceDate: ${referenceDate}`);
  }

  return parsed;
}

function getDaysUntil(dateString: string, referenceTimestamp: number) {
  const targetTimestamp = Date.parse(`${dateString}T00:00:00.000Z`);

  if (!Number.isFinite(targetTimestamp)) {
    throw new Error(`Invalid expiryDate in seed data: ${dateString}`);
  }

  return Math.round((targetTimestamp - referenceTimestamp) / MS_PER_DAY);
}

function sortLotsByExpiry(lots: InventoryLot[]) {
  return [...lots].sort((left, right) => left.expiryDate.localeCompare(right.expiryDate));
}

function groupInventoryByLookup() {
  const inventoryByLookup = new Map<BranchProductLookup, InventoryLot[]>();

  for (const lot of inventory) {
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

function indexByLookup<T extends { branchId: BranchId; productId: ProductId }>(records: T[]) {
  return new Map(records.map((record) => [createLookupKey(record.branchId, record.productId), record]));
}

const branchesById = new Map(branches.map((branch) => [branch.branchId, branch]));
const productsById = new Map(products.map((product) => [product.productId, product]));
const inventoryByLookup = groupInventoryByLookup();
const salesByLookup = indexByLookup(salesHistory);
const wasteByLookup = indexByLookup(wasteHistory);
const discountByLookup = indexByLookup(discountHistory);

const totalStockByLookup = new Map<BranchProductLookup, number>(
  [...inventoryByLookup.entries()].map(([lookupKey, lots]) => [
    lookupKey,
    lots.reduce((sum, lot) => sum + lot.currentStock, 0),
  ]),
);

const crossBranchSalesByProduct = new Map<ProductId, CrossBranchSalesSnapshot[]>();

for (const sale of salesHistory) {
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

function getRequiredPairRecord(branchId: BranchId, productId: ProductId): RequiredPairRecord {
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

function buildEnrichedLots(
  lots: InventoryLot[],
  unitPrice: number,
  referenceTimestamp: number,
): EnrichedInventoryLot[] {
  return sortLotsByExpiry(lots).map((lot) => ({
    ...lot,
    daysUntilExpiry: getDaysUntil(lot.expiryDate, referenceTimestamp),
    stockValueAzN: Number((lot.currentStock * unitPrice).toFixed(2)),
  }));
}

function calculateDaysOfStockRemaining(totalStock: number, avgDailySales: number) {
  if (avgDailySales <= 0) {
    return null;
  }

  return Number((totalStock / avgDailySales).toFixed(2));
}

function buildBranchProductRecord(
  branchId: BranchId,
  productId: ProductId,
  options?: LoaderOptions,
): EnrichedBranchProductRecord {
  const referenceTimestamp = parseReferenceDate(options?.referenceDate ?? SEED_REFERENCE_DATE);
  const pairRecord = getRequiredPairRecord(branchId, productId);
  const inventoryLots = buildEnrichedLots(
    pairRecord.lots,
    pairRecord.product.unitPrice,
    referenceTimestamp,
  );
  const earliestExpiryDate = inventoryLots[0]?.expiryDate;
  const latestExpiryDate = inventoryLots.at(-1)?.expiryDate;
  const totalStock = inventoryLots.reduce((sum, lot) => sum + lot.currentStock, 0);
  const stockValueAzN = Number(
    inventoryLots.reduce((sum, lot) => sum + lot.stockValueAzN, 0).toFixed(2),
  );

  if (!earliestExpiryDate || !latestExpiryDate) {
    throw new Error(
      `Seed data invariant failed: inventoryLots missing required expiry dates for ${branchId}:${productId}`,
    );
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
    daysOfStockRemaining: calculateDaysOfStockRemaining(
      totalStock,
      pairRecord.sales.avgDailySales,
    ),
    hasDiscountHistory: pairRecord.discount !== undefined,
    stockValueAzN,
    crossBranchSales: [...(crossBranchSalesByProduct.get(productId) ?? [])],
  };
}

export function getAvailableBranches() {
  return [...branches];
}

export function getBranchProductRecords(branchId: BranchId, options?: LoaderOptions) {
  if (!branchesById.has(branchId)) {
    throw new Error(`Unknown branchId: ${branchId}`);
  }

  return [...inventoryByLookup.keys()]
    .filter((lookupKey) => lookupKey.startsWith(`${branchId}:`))
    .map((lookupKey) => {
      const [, productId] = lookupKey.split(":") as [BranchId, ProductId];
      return buildBranchProductRecord(branchId, productId, options);
    })
    .sort((left, right) => left.product.name.localeCompare(right.product.name));
}

export function getBranchProductRecord(
  branchId: BranchId,
  productId: ProductId,
  options?: LoaderOptions,
) {
  if (!branchesById.has(branchId)) {
    throw new Error(`Unknown branchId: ${branchId}`);
  }

  const lookupKey = createLookupKey(branchId, productId);

  if (!inventoryByLookup.has(lookupKey)) {
    return undefined;
  }

  return buildBranchProductRecord(branchId, productId, options);
}
