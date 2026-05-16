import { getAvailableBranches, getBranchProductRecord, getBranchProductRecords } from "./dataLoader";
import {
  attachExplanationToRecommendation,
} from "./explanation";
import { generateRecommendationsForBranch } from "./recommendationEngine";
import { calculateWasteRisk, calculateWasteRiskForBranch } from "./riskScore";
import { attachSavingsToRecommendation, summarizeBranchSavings } from "./savings";
import { SEED_REFERENCE_DATE } from "./seedData";
import type {
  ActionPlanItem,
  Branch,
  BranchDashboardData,
  BranchId,
  BranchProductLookup,
  DashboardKpi,
  LoaderOptions,
  ProductDetailData,
  ProductId,
  ProductRecommendation,
  RecommendationExplanation,
  RecommendationSavings,
  RiskTableItem,
  ScoredBranchProductRecord,
} from "./types";

type DashboardRecommendationEntry = {
  lookupKey: BranchProductLookup;
  record: ScoredBranchProductRecord;
  recommendation: ProductRecommendation;
  savings: RecommendationSavings;
  explanation: RecommendationExplanation;
};

type BranchDashboardBundle = {
  branch: Branch;
  generatedAt: string;
  records: ScoredBranchProductRecord[];
  recommendationEntries: DashboardRecommendationEntry[];
};

type DashboardErrorCode = "UNKNOWN_BRANCH" | "UNKNOWN_PRODUCT";

export class DashboardDataError extends Error {
  readonly code: DashboardErrorCode;

  constructor(code: DashboardErrorCode, message: string) {
    super(message);
    this.name = "DashboardDataError";
    this.code = code;
  }
}

function createLookupKey(branchId: BranchId, productId: ProductId): BranchProductLookup {
  return `${branchId}:${productId}`;
}

function toGeneratedAt(referenceDate: string) {
  const timestamp = Date.parse(`${referenceDate}T00:00:00.000Z`);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid referenceDate: ${referenceDate}`);
  }

  return new Date(timestamp).toISOString();
}

function getReferenceDate(options?: LoaderOptions) {
  return options?.referenceDate ?? SEED_REFERENCE_DATE;
}

function getBranchOrThrow(branchId: BranchId) {
  const branch = getAvailableBranches().find((item) => item.branchId === branchId);

  if (!branch) {
    throw new DashboardDataError("UNKNOWN_BRANCH", `Unknown branchId: ${branchId}`);
  }

  return branch;
}

function buildRecommendationEntries(
  records: ScoredBranchProductRecord[],
): DashboardRecommendationEntry[] {
  const recordsByLookup = new Map<BranchProductLookup, ScoredBranchProductRecord>(
    records.map((record) => [record.lookupKey, record]),
  );

  return generateRecommendationsForBranch(records).map((recommendation) => {
    const lookupKey = createLookupKey(recommendation.branchId, recommendation.productId);
    const record = recordsByLookup.get(lookupKey);

    if (!record) {
      throw new Error(`Missing scored record for recommendation ${lookupKey}`);
    }

    const { savings } = attachSavingsToRecommendation(record, recommendation);
    const { explanation } = attachExplanationToRecommendation(record, recommendation);

    return {
      lookupKey,
      record,
      recommendation,
      savings,
      explanation,
    };
  });
}

function buildBranchDashboardBundle(
  branchId: BranchId,
  options?: LoaderOptions,
): BranchDashboardBundle {
  const branch = getBranchOrThrow(branchId);
  const records = calculateWasteRiskForBranch(getBranchProductRecords(branchId, options));

  return {
    branch,
    generatedAt: toGeneratedAt(getReferenceDate(options)),
    records,
    recommendationEntries: buildRecommendationEntries(records),
  };
}

function buildKpis(
  recommendationEntries: DashboardRecommendationEntry[],
  records: ScoredBranchProductRecord[],
): DashboardKpi[] {
  const recommendations = recommendationEntries.map((entry) => entry.recommendation);
  const summary = summarizeBranchSavings(records, recommendations);

  return [
    {
      key: "possible-loss",
      label: "Possible waste",
      value: summary.totalPossibleLossAzN,
      unit: "azn",
    },
    {
      key: "recoverable-value",
      label: "Recoverable value",
      value: summary.totalRecoveredValueAzN,
      unit: "azn",
    },
    {
      key: "net-saved-value",
      label: "Net saved value",
      value: summary.totalNetSavedValueAzN,
      unit: "azn",
    },
    {
      key: "risky-products",
      label: "Risky products",
      value: recommendationEntries.length,
      unit: "count",
    },
    {
      key: "tasks-today",
      label: "Tasks today",
      value: recommendationEntries.length,
      unit: "count",
    },
  ];
}

function buildRiskTableItem(entry: DashboardRecommendationEntry): RiskTableItem {
  return {
    branchId: entry.record.branch.branchId,
    productId: entry.record.product.productId,
    productName: entry.record.product.name,
    category: entry.record.product.category,
    riskLevel: entry.record.risk.riskLevel,
    riskScore: entry.record.risk.roundedScore,
    daysUntilExpiry: entry.record.daysUntilEarliestExpiry,
    totalStock: entry.record.totalStock,
    daysOfStockRemaining: entry.record.daysOfStockRemaining,
    actionType: entry.recommendation.actionType,
    recommendationSummary: entry.recommendation.summary,
    netSavedValueAzN: entry.savings.netSavedValueAzN,
    possibleLossAzN: entry.savings.possibleLossAzN,
  };
}

function buildActionPlanItem(entry: DashboardRecommendationEntry): ActionPlanItem {
  return {
    taskId: `${entry.record.branch.branchId}:${entry.record.product.productId}:${entry.recommendation.actionType}`,
    branchId: entry.record.branch.branchId,
    productId: entry.record.product.productId,
    productName: entry.record.product.name,
    actionType: entry.recommendation.actionType,
    riskLevel: entry.record.risk.riskLevel,
    riskScore: entry.record.risk.roundedScore,
    status: "pending",
    summary: entry.recommendation.summary,
    expectedNetSavedValueAzN: entry.savings.netSavedValueAzN,
    expectedRecoveredValueAzN: entry.savings.recoveredValueAzN,
  };
}

function buildProductDetailData(
  record: ScoredBranchProductRecord,
  generatedAt: string,
  detailEntry?: DashboardRecommendationEntry,
): ProductDetailData {
  return {
    branch: record.branch,
    product: record.product,
    generatedAt,
    totalStock: record.totalStock,
    stockValueAzN: record.stockValueAzN,
    lotCount: record.lotCount,
    earliestExpiryDate: record.earliestExpiryDate,
    latestExpiryDate: record.latestExpiryDate,
    daysUntilEarliestExpiry: record.daysUntilEarliestExpiry,
    daysOfStockRemaining: record.daysOfStockRemaining,
    risk: record.risk,
    inventoryLots: record.inventoryLots,
    recommendation: detailEntry?.recommendation ?? null,
    savings: detailEntry?.savings ?? null,
    explanation: detailEntry?.explanation ?? null,
  };
}

function buildProductDetailsById(
  recommendationEntries: DashboardRecommendationEntry[],
  generatedAt: string,
) {
  return recommendationEntries.reduce<Partial<Record<ProductId, ProductDetailData>>>(
    (accumulator, entry) => {
      accumulator[entry.record.product.productId] = buildProductDetailData(
        entry.record,
        generatedAt,
        entry,
      );

      return accumulator;
    },
    {},
  );
}

export function getAvailableBranchOptions() {
  return getAvailableBranches();
}

export function getDashboardData(
  branchId: BranchId,
  options?: LoaderOptions,
): BranchDashboardData {
  const bundle = buildBranchDashboardBundle(branchId, options);

  return {
    branch: bundle.branch,
    generatedAt: bundle.generatedAt,
    kpis: buildKpis(bundle.recommendationEntries, bundle.records),
    riskTable: bundle.recommendationEntries.map(buildRiskTableItem),
    actionPlan: bundle.recommendationEntries.map(buildActionPlanItem),
    topProductIds: bundle.recommendationEntries.map((entry) => entry.record.product.productId),
    productDetailsById: buildProductDetailsById(
      bundle.recommendationEntries,
      bundle.generatedAt,
    ),
  };
}

export function getProductDetailData(
  branchId: BranchId,
  productId: ProductId,
  options?: LoaderOptions,
): ProductDetailData {
  getBranchOrThrow(branchId);

  const record = getBranchProductRecord(branchId, productId, options);

  if (!record) {
    throw new DashboardDataError(
      "UNKNOWN_PRODUCT",
      `Unknown productId for branch ${branchId}: ${productId}`,
    );
  }

  const scoredRecord: ScoredBranchProductRecord = {
    ...record,
    risk: calculateWasteRisk(record),
  };
  const bundle = buildBranchDashboardBundle(branchId, options);
  const detailEntry = bundle.recommendationEntries.find(
    (entry) => entry.record.product.productId === productId,
  );

  return buildProductDetailData(scoredRecord, bundle.generatedAt, detailEntry);
}
