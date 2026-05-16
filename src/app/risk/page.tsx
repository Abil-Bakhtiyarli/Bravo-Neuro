import AppShell from "@/components/AppShell";
import DetailPageHeader from "@/components/DetailPageHeader";
import RiskTableExperience from "@/components/RiskTableExperience";
import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";
import { parseRiskTableFilterValue } from "@/lib/riskTableInteraction";
import { resolveSelectedBranchId } from "@/lib/branchSelection";

type RiskPageProps = {
  searchParams: Promise<{
    branch?: string | string[];
    product?: string | string[];
    q?: string | string[];
    risk?: string | string[];
  }>;
  testStaticMode?: boolean;
};

export default async function RiskPage({ searchParams, testStaticMode = false }: RiskPageProps) {
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
  const initialQuery = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0] ?? ""
    : resolvedSearchParams.q ?? "";
  const initialRisk = parseRiskTableFilterValue(
    Array.isArray(resolvedSearchParams.risk)
      ? resolvedSearchParams.risk[0] ?? "all"
      : resolvedSearchParams.risk ?? "all",
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          title="Risk products"
          subtitle="Branch-level expiry, stock, and waste-risk queue."
          generatedAt={dashboardData.generatedAt}
          preservedSearchParamKeys={["q", "risk"]}
          staticMode={testStaticMode}
        />
        <RiskTableExperience
          rows={dashboardData.riskTable}
          productDetailsById={dashboardData.productDetailsById}
          initialRequestedProductId={initialRequestedProductId}
          initialQuery={initialQuery}
          initialRiskFilter={initialRisk}
        />
      </div>
    </AppShell>
  );
}
