import AppShell from "@/components/AppShell";
import BranchComparisonCard from "@/components/BranchComparisonCard";
import DetailPageHeader from "@/components/DetailPageHeader";
import { buildBranchComparisonSummary } from "@/lib/branchComparison";
import { resolveSelectedBranchId } from "@/lib/branchSelection";
import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";

type BranchesPageProps = {
  searchParams: Promise<{
    branch?: string | string[];
  }>;
  testStaticMode?: boolean;
};

export default async function BranchesPage({
  searchParams,
  testStaticMode = false,
}: BranchesPageProps) {
  const branches = getAvailableBranchOptions();
  const resolvedSearchParams = await searchParams;
  const selectedBranchId = resolveSelectedBranchId(
    resolvedSearchParams.branch,
    branches.map((branch) => branch.branchId),
  );
  const selectedDashboardData = getDashboardData(selectedBranchId);
  const branchComparisons = branches.map((branch) =>
    buildBranchComparisonSummary(
      getDashboardData(branch.branchId),
      branch.branchId === selectedBranchId,
    ),
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          title="Branch comparison"
          subtitle="Compare current risk, protected value, and top action by branch."
          generatedAt={selectedDashboardData.generatedAt}
          staticMode={testStaticMode}
        />
        <BranchComparisonCard comparisons={branchComparisons} />
      </div>
    </AppShell>
  );
}
