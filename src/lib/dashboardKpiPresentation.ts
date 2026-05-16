import type {
  Branch,
  BranchDashboardData,
  DashboardKpi,
  DashboardKpiKey,
} from "./types";

export type DashboardKpiPresentationTone = "warning" | "success" | "neutral" | "info";

export type DashboardKpiPresentationIconKey =
  | "possible-loss"
  | "recoverable-value"
  | "net-saved-value"
  | "risky-products"
  | "tasks-today";

export type DashboardKpiPresentationItem = {
  key: DashboardKpiPresentationIconKey;
  label: string;
  displayValue: string;
  helperText: string;
  statusBadge: string;
  accentTone: DashboardKpiPresentationTone;
  numericValue: number;
};

const DISPLAY_KPI_ORDER = [
  "possible-loss",
  "recoverable-value",
  "net-saved-value",
  "risky-products",
  "tasks-today",
] as const satisfies readonly DashboardKpiPresentationIconKey[];

function formatAzN(value: number) {
  return `AZN ${value.toFixed(1)}`;
}

function formatCount(value: number) {
  return Math.round(value).toString();
}

function getRequiredKpi(
  kpis: BranchDashboardData["kpis"],
  key: DashboardKpiKey,
): DashboardKpi {
  const kpi = kpis.find((item) => item.key === key);

  if (!kpi) {
    throw new Error(`Missing dashboard KPI for presentation: ${key}`);
  }

  return kpi;
}

function buildHelperText(
  branch: Branch,
  kpi: DashboardKpi,
  riskyProductsCount: number,
  tasksTodayCount: number,
) {
  switch (kpi.key) {
    case "possible-loss":
      return `${branch.branchName} is currently carrying ${formatAzN(kpi.value)} of waste exposure across the active review queue.`;
    case "recoverable-value":
      return `${formatAzN(kpi.value)} can still be recovered in ${branch.branchName} if the team executes the recommended moves on time.`;
    case "risky-products":
      return `${formatCount(riskyProductsCount)} medium, high, or critical products currently need manager attention in ${branch.branchName}.`;
    case "tasks-today":
      return `${formatCount(tasksTodayCount)} manager tasks are ready today for ${branch.branchName}, ranked by urgency and recovery value.`;
    case "net-saved-value":
      return `${formatAzN(kpi.value)} remains protected after action costs are deducted from the current ${branch.branchName} plan.`;
    default:
      return branch.branchName;
  }
}

function buildStatusBadge(key: DashboardKpiPresentationIconKey, value: number) {
  switch (key) {
    case "possible-loss":
      return value > 0 ? "Watch" : "Stable";
    case "recoverable-value":
      return value > 0 ? "Recover" : "Clear";
    case "net-saved-value":
      return value > 0 ? "Protected" : "Flat";
    case "risky-products":
      return value > 0 ? "Action" : "Clear";
    case "tasks-today":
      return value > 0 ? "Today" : "Clear";
    default:
      return "Live";
  }
}

function buildTone(key: DashboardKpiPresentationIconKey): DashboardKpiPresentationTone {
  switch (key) {
    case "possible-loss":
      return "warning";
    case "recoverable-value":
      return "success";
    case "net-saved-value":
      return "success";
    case "risky-products":
      return "neutral";
    case "tasks-today":
      return "info";
    default:
      return "neutral";
  }
}

export function buildDashboardKpiPresentationItems(
  dashboardData: BranchDashboardData,
): DashboardKpiPresentationItem[] {
  const riskyProductsKpi = getRequiredKpi(dashboardData.kpis, "risky-products");
  const tasksTodayKpi = getRequiredKpi(dashboardData.kpis, "tasks-today");

  return DISPLAY_KPI_ORDER.map((key) => {
    const kpi = getRequiredKpi(dashboardData.kpis, key);

    return {
      key,
      label: kpi.label,
      displayValue: kpi.unit === "azn" ? formatAzN(kpi.value) : formatCount(kpi.value),
      helperText: buildHelperText(
        dashboardData.branch,
        kpi,
        riskyProductsKpi.value,
        tasksTodayKpi.value,
      ),
      statusBadge: buildStatusBadge(key, kpi.value),
      accentTone: buildTone(key),
      numericValue: kpi.value,
    };
  });
}
