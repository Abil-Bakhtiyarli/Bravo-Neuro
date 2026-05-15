export type BranchId = string;
export type ProductId = string;
export type DemandProfile = "commuter" | "family" | "premium-mixed";
export type ProductCategory = "dairy" | "bakery" | "fruits-vegetables" | "drinks";
export type ShelfLifeType = "short" | "medium" | "long";
export type ShelfLocation =
  | "chilled aisle"
  | "bakery display"
  | "produce table"
  | "produce chiller"
  | "beverage shelf"
  | "promo endcap";

export type TaskStatus = "pending" | "accepted" | "completed";
export type TaskActionType =
  | "discount"
  | "transfer"
  | "reorder-adjustment"
  | "shelf-action"
  | "investigation";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RiskFactorKey =
  | "expiry-urgency"
  | "stock-pressure"
  | "sales-weakness"
  | "historical-waste"
  | "branch-demand-mismatch";

export type Branch = {
  branchId: BranchId;
  branchName: string;
  location: string;
  demandProfile: DemandProfile;
};

export type Product = {
  productId: ProductId;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  shelfLifeType: ShelfLifeType;
};

export type InventoryLot = {
  branchId: BranchId;
  productId: ProductId;
  currentStock: number;
  expiryDate: string;
  shelfLocation: ShelfLocation;
};

export type SalesHistory = {
  branchId: BranchId;
  productId: ProductId;
  avgDailySales: number;
  last7DaysSales: number;
};

export type DiscountHistory = {
  branchId: BranchId;
  productId: ProductId;
  pastDiscountPercent: number;
  responseRate: number;
};

export type WasteHistory = {
  branchId: BranchId;
  productId: ProductId;
  categoryWasteRate: number;
  previousWasteUnits: number;
};

export type LoaderOptions = {
  referenceDate?: string;
};

export type BranchProductLookup = `${BranchId}:${ProductId}`;

export type EnrichedInventoryLot = InventoryLot & {
  daysUntilExpiry: number;
  stockValueAzN: number;
};

export type CrossBranchSalesSnapshot = {
  branchId: BranchId;
  branchName: string;
  demandProfile: DemandProfile;
  avgDailySales: number;
  last7DaysSales: number;
  totalStock: number;
};

export type EnrichedBranchProductRecord = {
  lookupKey: BranchProductLookup;
  branch: Branch;
  product: Product;
  inventoryLots: EnrichedInventoryLot[];
  salesHistory: SalesHistory;
  discountHistory?: DiscountHistory;
  wasteHistory: WasteHistory;
  totalStock: number;
  lotCount: number;
  earliestExpiryDate: string;
  latestExpiryDate: string;
  daysUntilEarliestExpiry: number;
  daysOfStockRemaining: number | null;
  hasDiscountHistory: boolean;
  stockValueAzN: number;
  crossBranchSales: CrossBranchSalesSnapshot[];
};

export type RiskComponentScore = {
  key: RiskFactorKey;
  label: string;
  rawScore: number;
  weight: number;
  weightedContribution: number;
};

export type ProductRiskAssessment = {
  totalScore: number;
  roundedScore: number;
  riskLevel: RiskLevel;
  componentScores: RiskComponentScore[];
  mainDrivers: RiskComponentScore[];
};
