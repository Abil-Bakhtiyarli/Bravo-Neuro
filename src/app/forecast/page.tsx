import AppShell from "@/components/AppShell";
import DetailPageHeader from "@/components/DetailPageHeader";
import RevenueForecastOverview from "@/components/RevenueForecastOverview";
import { resolveSelectedBranchId } from "@/lib/branchSelection";
import { getAvailableBranchOptions } from "@/lib/dashboardData";
import { getRevenueForecastPageData } from "@/lib/operationsDemoData";

type ForecastPageProps = {
  searchParams: Promise<{
    branch?: string | string[];
  }>;
  testStaticMode?: boolean;
};

export default async function ForecastPage({
  searchParams,
  testStaticMode = false,
}: ForecastPageProps) {
  const branches = getAvailableBranchOptions();
  const resolvedSearchParams = await searchParams;
  const selectedBranchId = resolveSelectedBranchId(
    resolvedSearchParams.branch,
    branches.map((branch) => branch.branchId),
  );
  const forecastData = getRevenueForecastPageData(selectedBranchId);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          title="Revenue forecast"
          subtitle="Forward-looking branch revenue view built from current run rate, category mix, and operational risk signals."
          generatedAt={forecastData.generatedAt}
          staticMode={testStaticMode}
        />
        <RevenueForecastOverview data={forecastData} />
      </div>
    </AppShell>
  );
}
