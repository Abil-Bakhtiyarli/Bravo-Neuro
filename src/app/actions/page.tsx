import ActionPlanExperience from "@/components/ActionPlanExperience";
import AppShell from "@/components/AppShell";
import DetailPageHeader from "@/components/DetailPageHeader";
import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";
import { resolveSelectedBranchId } from "@/lib/branchSelection";

type ActionsPageProps = {
  searchParams: Promise<{
    branch?: string | string[];
    product?: string | string[];
  }>;
  testStaticMode?: boolean;
};

export default async function ActionsPage({
  searchParams,
  testStaticMode = false,
}: ActionsPageProps) {
  const branches = getAvailableBranchOptions();
  const resolvedSearchParams = await searchParams;
  const selectedBranchId = resolveSelectedBranchId(
    resolvedSearchParams.branch,
    branches.map((branch) => branch.branchId),
  );
  const dashboardData = getDashboardData(selectedBranchId);
  const initialRequestedProductId = Array.isArray(resolvedSearchParams.product)
    ? resolvedSearchParams.product[0] ?? null
    : resolvedSearchParams.product ?? null;

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          title="Discount actions and execution plan"
          subtitle="Priority queue for the current branch review."
          generatedAt={dashboardData.generatedAt}
          staticMode={testStaticMode}
        />
        <ActionPlanExperience
          branchId={selectedBranchId}
          tasks={dashboardData.actionPlan}
          productDetailsById={dashboardData.productDetailsById}
          initialRequestedProductId={initialRequestedProductId}
          staticMode={testStaticMode}
        />
      </div>
    </AppShell>
  );
}
