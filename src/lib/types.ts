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
