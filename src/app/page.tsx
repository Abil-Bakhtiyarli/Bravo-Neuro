import AppShell from "@/components/AppShell";
import DashboardOverview from "@/components/DashboardOverview";
import { buildBranchComparisonSummary } from "@/lib/branchComparison";
import { resolveSelectedBranchId } from "@/lib/branchSelection";
import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";
import {
  buildDashboardKpiPresentationItems,
} from "@/lib/dashboardKpiPresentation";

type HomeProps = {
  searchParams: Promise<{ branch?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const branches = getAvailableBranchOptions();
  const selectedBranchId = resolveSelectedBranchId(
    (await searchParams).branch,
    branches.map((branch) => branch.branchId),
  );
  const dashboardData = getDashboardData(selectedBranchId);
  const kpiItems = buildDashboardKpiPresentationItems(dashboardData)
    .filter((item) =>
      item.key === "risky-products" ||
      item.key === "net-saved-value" ||
      item.key === "possible-loss" ||
      item.key === "tasks-today",
    );
  const branchComparisons = branches.map((branch) =>
    buildBranchComparisonSummary(
      getDashboardData(branch.branchId),
      branch.branchId === selectedBranchId,
    ),
  );

  return (
    <AppShell>
      <DashboardOverview
        branches={branches}
        selectedBranchId={selectedBranchId}
        generatedAt={dashboardData.generatedAt}
        branchName={dashboardData.branch.branchName}
        kpiItems={kpiItems}
        actionPlan={dashboardData.actionPlan}
        riskTable={dashboardData.riskTable}
        productDetailsById={dashboardData.productDetailsById}
        monthlySavingsSeries={dashboardData.monthlySavingsSeries}
        branchComparisons={branchComparisons}
      />
    </AppShell>
  );
}
