import AppShell from "@/components/AppShell";
import DetailPageHeader from "@/components/DetailPageHeader";
import TransfersOverview from "@/components/TransfersOverview";
import { resolveSelectedBranchId } from "@/lib/branchSelection";
import { getAvailableBranchOptions } from "@/lib/dashboardData";
import { getTransfersPageData } from "@/lib/operationsDemoData";

type TransfersPageProps = {
  searchParams: Promise<{
    branch?: string | string[];
  }>;
  testStaticMode?: boolean;
};

export default async function TransfersPage({
  searchParams,
  testStaticMode = false,
}: TransfersPageProps) {
  const branches = getAvailableBranchOptions();
  const resolvedSearchParams = await searchParams;
  const selectedBranchId = resolveSelectedBranchId(
    resolvedSearchParams.branch,
    branches.map((branch) => branch.branchId),
  );
  const transferData = getTransfersPageData(selectedBranchId);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          title="Transfers"
          subtitle="Branch-to-branch stock moves that protect sell-through before expiry pressure turns into markdown loss."
          generatedAt={transferData.generatedAt}
          staticMode={testStaticMode}
        />
        <TransfersOverview data={transferData} />
      </div>
    </AppShell>
  );
}
