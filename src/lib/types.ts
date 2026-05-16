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
export type RecommendationActionType = TaskActionType;
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

export type MonthlySavingsSeriesPoint = {
  branchId: BranchId;
  monthKey: string;
  monthLabel: string;
  netSavedValueAzN: number;
  recoveredValueAzN: number;
  possibleLossAzN: number;
  taskCount: number;
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

export type ScoredBranchProductRecord = EnrichedBranchProductRecord & {
  risk: ProductRiskAssessment;
};

export type RecommendationReasonCode =
  | "near-expiry"
  | "high-risk-score"
  | "excess-stock"
  | "faster-branch-demand"
  | "transfer-feasible"
  | "oversupply"
  | "waste-trend"
  | "visibility-boost"
  | "data-conflict"
  | "unclear-primary-action";

type RecommendationBase = {
  branchId: BranchId;
  productId: ProductId;
  branchName: string;
  productName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  reasonCodes: RecommendationReasonCode[];
};

export type DiscountRecommendation = RecommendationBase & {
  actionType: "discount";
  discountPercent: number;
  fallbackDiscountPercent: number;
  targetUnitsByTomorrow: number;
  expectedUnitsByTomorrow: number;
};

export type TransferRecommendation = RecommendationBase & {
  actionType: "transfer";
  destinationBranchId: BranchId;
  destinationBranchName: string;
  transferQuantity: number;
  salesSpeedMultiplier: number;
};

export type ReorderAdjustmentRecommendation = RecommendationBase & {
  actionType: "reorder-adjustment";
  adjustment: "reduce" | "pause";
  suggestedOrderMultiplier: number;
};

export type ShelfActionRecommendation = RecommendationBase & {
  actionType: "shelf-action";
  targetPlacement: "promo endcap" | "front shelf";
};

export type InvestigationRecommendation = RecommendationBase & {
  actionType: "investigation";
  checks: string[];
};

export type ProductRecommendation =
  | DiscountRecommendation
  | TransferRecommendation
  | ReorderAdjustmentRecommendation
  | ShelfActionRecommendation
  | InvestigationRecommendation;

export type RecommendationExplanation = {
  summary: string;
  driverHighlights: string[];
  recommendationRationale: string;
};

export type RecommendationWithExplanation = {
  recommendation: ProductRecommendation;
  explanation: RecommendationExplanation;
};

export type SavingsActionAssumptions = {
  methodology: string;
  baselineUnitsWithoutAction: number;
  unitsAtRisk: number;
  discountedUnitPriceAzN?: number;
  actionUpliftRate?: number;
  transferCostPerUnitAzN?: number;
  reorderPreventionConfidence?: number;
};

export type RecommendationSavings = {
  possibleLossAzN: number;
  recoveredValueAzN: number;
  netSavedValueAzN: number;
  estimatedRecoveredUnits: number;
  estimatedWasteUnitsAvoided: number;
  costBreakdown: {
    discountCostAzN: number;
    transferCostAzN: number;
    handlingCostAzN: number;
  };
  assumptions: SavingsActionAssumptions;
};

export type RecommendationWithSavings = {
  recommendation: ProductRecommendation;
  savings: RecommendationSavings;
};

export type BranchSavingsSummaryItem = {
  recommendationCount: number;
  totalPossibleLossAzN: number;
  totalRecoveredValueAzN: number;
  totalNetSavedValueAzN: number;
};

export type BranchSavingsSummary = {
  totalPossibleLossAzN: number;
  totalRecoveredValueAzN: number;
  totalNetSavedValueAzN: number;
  recommendationCount: number;
  breakdownByActionType: Partial<Record<RecommendationActionType, BranchSavingsSummaryItem>>;
};

export type DashboardKpiKey =
  | "possible-loss"
  | "recoverable-value"
  | "net-saved-value"
  | "risky-products"
  | "tasks-today";

export type DashboardKpi = {
  key: DashboardKpiKey;
  label: string;
  value: number;
  unit: "azn" | "count";
};

export type RiskTableItem = {
  branchId: BranchId;
  productId: ProductId;
  productName: string;
  category: ProductCategory;
  riskLevel: RiskLevel;
  riskScore: number;
  daysUntilExpiry: number;
  totalStock: number;
  daysOfStockRemaining: number | null;
  actionType: RecommendationActionType;
  recommendationSummary: string;
  netSavedValueAzN: number;
  possibleLossAzN: number;
};

export type ActionPlanItem = {
  taskId: string;
  branchId: BranchId;
  productId: ProductId;
  productName: string;
  priorityRank: number;
  actionType: RecommendationActionType;
  riskLevel: RiskLevel;
  riskScore: number;
  daysUntilExpiry: number;
  status: TaskStatus;
  summary: string;
  checklistSteps: string[];
  expectedNetSavedValueAzN: number;
  expectedRecoveredValueAzN: number;
};

export type ProductDetailData = {
  branch: Branch;
  product: Product;
  generatedAt: string;
  totalStock: number;
  stockValueAzN: number;
  lotCount: number;
  earliestExpiryDate: string;
  latestExpiryDate: string;
  daysUntilEarliestExpiry: number;
  daysOfStockRemaining: number | null;
  risk: ProductRiskAssessment;
  inventoryLots: EnrichedInventoryLot[];
  recommendation: ProductRecommendation | null;
  savings: RecommendationSavings | null;
  explanation: RecommendationExplanation | null;
};

export type BranchDashboardData = {
  branch: Branch;
  generatedAt: string;
  kpis: DashboardKpi[];
  monthlySavingsSeries: MonthlySavingsSeriesPoint[];
  riskTable: RiskTableItem[];
  actionPlan: ActionPlanItem[];
  topProductIds: ProductId[];
  productDetailsById: Partial<Record<ProductId, ProductDetailData>>;
};

export type AssistantChatRole = "user" | "assistant";

export type AssistantChatMessage = {
  role: AssistantChatRole;
  content: string;
};

export type AssistantCitationKind =
  | "branch-kpi"
  | "risk-row"
  | "action-item"
  | "product-detail"
  | "savings-series";

export type AssistantCitation = {
  kind: AssistantCitationKind;
  label: string;
  branchId: BranchId;
  productId?: ProductId;
};

export type AssistantPromptChip = {
  id: string;
  label: string;
  prompt: string;
};

export type AssistantBranchSnapshot = {
  branchId: BranchId;
  branchName: string;
  generatedAt: string;
  kpis: DashboardKpi[];
  topRiskProducts: RiskTableItem[];
  actionPlan: ActionPlanItem[];
  monthlySavingsSeries: MonthlySavingsSeriesPoint[];
};

export type AssistantContextSnapshot = {
  branch: AssistantBranchSnapshot;
  selectedProduct: ProductDetailData | null;
  selectedProductRiskRow: RiskTableItem | null;
  selectedProductAction: ActionPlanItem | null;
  promptChips: AssistantPromptChip[];
};

export type AssistantChatRequest = {
  branchId: BranchId;
  productId?: ProductId | null;
  message: string;
  history?: AssistantChatMessage[];
};

export type AssistantChatResponse = {
  message: string;
  citations: AssistantCitation[];
};
