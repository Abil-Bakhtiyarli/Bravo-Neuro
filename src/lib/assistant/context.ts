import { DashboardDataError, getDashboardData, getProductDetailData } from "@/lib/dashboardData";
import type {
  ActionPlanItem,
  AssistantBranchSnapshot,
  AssistantCitation,
  AssistantContextSnapshot,
  BranchId,
  ProductDetailData,
  ProductId,
  RiskTableItem,
} from "@/lib/types";

const DEFAULT_TOP_RISK_LIMIT = 5;
const DEFAULT_ACTION_LIMIT = 5;
const DEFAULT_SERIES_LIMIT = 6;

function buildPromptChips(
  branchName: string,
  selectedProduct: ProductDetailData | null,
): AssistantContextSnapshot["promptChips"] {
  const productPrompt = selectedProduct
    ? `Why is ${selectedProduct.product.name} risky in ${branchName}, and what is the best next action?`
    : `Which products need the fastest intervention in ${branchName} today?`;

  const comparePrompt = selectedProduct?.recommendation?.actionType === "transfer"
    ? `Compare transfer versus discount for ${selectedProduct.product.name} in ${branchName}.`
    : selectedProduct
      ? `Compare discount versus transfer for ${selectedProduct.product.name} in ${branchName}.`
      : `When should this branch transfer stock instead of discounting it?`;

  return [
    {
      id: "selected-risk",
      label: selectedProduct ? "Explain selected product" : "Explain top risk",
      prompt: productPrompt,
    },
    {
      id: "today-actions",
      label: "Today’s branch plan",
      prompt: `What should ${branchName} do today based on the current action queue?`,
    },
    {
      id: "compare-actions",
      label: "Compare actions",
      prompt: comparePrompt,
    },
  ];
}

function safeGetProductDetailData(
  branchId: BranchId,
  productId: ProductId | null | undefined,
): ProductDetailData | null {
  if (!productId) {
    return null;
  }

  try {
    return getProductDetailData(branchId, productId);
  } catch (error) {
    if (error instanceof DashboardDataError && error.code === "UNKNOWN_PRODUCT") {
      return null;
    }

    throw error;
  }
}

function findRiskRow(riskTable: RiskTableItem[], productId: ProductId | null) {
  if (!productId) {
    return null;
  }

  return riskTable.find((row) => row.productId === productId) ?? null;
}

function findActionItem(actionPlan: ActionPlanItem[], productId: ProductId | null) {
  if (!productId) {
    return null;
  }

  return actionPlan.find((item) => item.productId === productId) ?? null;
}

export function buildAssistantBranchSnapshot(
  branchId: BranchId,
  options?: {
    topRiskLimit?: number;
    actionLimit?: number;
    seriesLimit?: number;
  },
): AssistantBranchSnapshot {
  const dashboardData = getDashboardData(branchId);

  return {
    branchId: dashboardData.branch.branchId,
    branchName: dashboardData.branch.branchName,
    generatedAt: dashboardData.generatedAt,
    kpis: dashboardData.kpis,
    topRiskProducts: dashboardData.riskTable.slice(0, options?.topRiskLimit ?? DEFAULT_TOP_RISK_LIMIT),
    actionPlan: dashboardData.actionPlan.slice(0, options?.actionLimit ?? DEFAULT_ACTION_LIMIT),
    monthlySavingsSeries: dashboardData.monthlySavingsSeries.slice(
      -(options?.seriesLimit ?? DEFAULT_SERIES_LIMIT),
    ),
  };
}

export function buildAssistantContextSnapshot(
  branchId: BranchId,
  productId?: ProductId | null,
): AssistantContextSnapshot {
  const dashboardData = getDashboardData(branchId);
  const selectedProduct = safeGetProductDetailData(branchId, productId);
  const resolvedProductId = selectedProduct?.product.productId ?? null;

  return {
    branch: {
      branchId: dashboardData.branch.branchId,
      branchName: dashboardData.branch.branchName,
      generatedAt: dashboardData.generatedAt,
      kpis: dashboardData.kpis,
      topRiskProducts: dashboardData.riskTable.slice(0, DEFAULT_TOP_RISK_LIMIT),
      actionPlan: dashboardData.actionPlan.slice(0, DEFAULT_ACTION_LIMIT),
      monthlySavingsSeries: dashboardData.monthlySavingsSeries.slice(-DEFAULT_SERIES_LIMIT),
    },
    selectedProduct,
    selectedProductRiskRow: findRiskRow(dashboardData.riskTable, resolvedProductId),
    selectedProductAction: findActionItem(dashboardData.actionPlan, resolvedProductId),
    promptChips: buildPromptChips(dashboardData.branch.branchName, selectedProduct),
  };
}

export function buildBranchSnapshotCitation(branchId: BranchId): AssistantCitation {
  const dashboardData = getDashboardData(branchId);

  return {
    kind: "branch-kpi",
    label: `${dashboardData.branch.branchName} branch snapshot`,
    branchId,
  };
}

export function buildProductDetailCitation(detail: ProductDetailData): AssistantCitation {
  return {
    kind: "product-detail",
    label: detail.product.name,
    branchId: detail.branch.branchId,
    productId: detail.product.productId,
  };
}
