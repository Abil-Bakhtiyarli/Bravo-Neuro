import {
  AlertTriangle,
  BanknoteArrowDown,
  CalendarClock,
  PackageSearch,
  TrendingUp,
} from "lucide-react";

import DailyActionPlan from "@/components/DailyActionPlan";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardLayout from "@/components/DashboardLayout";
import KpiCards, { type KpiCardItem } from "@/components/KpiCards";
import RiskTableExperience from "@/components/RiskTableExperience";
import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";
import {
  buildDashboardKpiPresentationItems,
  type DashboardKpiPresentationItem,
} from "@/lib/dashboardKpiPresentation";
import type { BranchId } from "@/lib/types";

function toKpiCardItem(item: DashboardKpiPresentationItem): KpiCardItem {
  switch (item.key) {
    case "possible-loss":
      return {
        ...item,
        icon: AlertTriangle,
      };
    case "recoverable-value":
      return {
        ...item,
        icon: BanknoteArrowDown,
      };
    case "net-saved-value":
      return {
        ...item,
        icon: TrendingUp,
      };
    case "risky-products":
      return {
        ...item,
        icon: PackageSearch,
      };
    case "tasks-today":
      return {
        ...item,
        icon: CalendarClock,
      };
    default:
      throw new Error(`Unsupported KPI card key: ${String(item.key)}`);
  }
}

type MainPaneProps = {
  rows: ReturnType<typeof getDashboardData>["riskTable"];
  productDetailsById: ReturnType<typeof getDashboardData>["productDetailsById"];
};

function RiskTablePane({ rows, productDetailsById }: MainPaneProps) {
  return <RiskTableExperience rows={rows} productDetailsById={productDetailsById} />;
}

type HomeProps = {
  searchParams: Promise<{ branch?: string | string[] }>;
};

function resolveSelectedBranchId(
  requestedBranch: string | string[] | undefined,
  branchIds: BranchId[],
) {
  const requestedValue = Array.isArray(requestedBranch)
    ? requestedBranch[0]
    : requestedBranch;

  if (requestedValue && branchIds.includes(requestedValue)) {
    return requestedValue;
  }

  return branchIds[0];
}

export default async function Home({ searchParams }: HomeProps) {
  const branches = getAvailableBranchOptions();
  const selectedBranchId = resolveSelectedBranchId(
    (await searchParams).branch,
    branches.map((branch) => branch.branchId),
  );
  const dashboardData = getDashboardData(selectedBranchId);
  const kpiCards = buildDashboardKpiPresentationItems(dashboardData).map(toKpiCardItem);

  return (
    <DashboardLayout
      topBar={
        <DashboardHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          generatedAt={dashboardData.generatedAt}
        />
      }
      topRowMain={
        <DailyActionPlan
          key={selectedBranchId}
          branchId={selectedBranchId}
          tasks={dashboardData.actionPlan}
        />
      }
      kpiRail={<KpiCards items={kpiCards} orientation="rail" />}
      bottomSection={
        <RiskTablePane
          rows={dashboardData.riskTable}
          productDetailsById={dashboardData.productDetailsById}
        />
      }
    />
  );
}
