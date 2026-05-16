import AppShell from "@/components/AppShell";
import AssistantExperience from "@/components/AssistantExperience";
import DetailPageHeader from "@/components/DetailPageHeader";
import { buildAssistantContextSnapshot } from "@/lib/assistant/context";
import { resolveSelectedBranchId } from "@/lib/branchSelection";
import { getAvailableBranchOptions } from "@/lib/dashboardData";

type AssistantPageProps = {
  searchParams: Promise<{
    branch?: string | string[];
    product?: string | string[];
  }>;
  testStaticMode?: boolean;
};

export default async function AssistantPage({
  searchParams,
  testStaticMode = false,
}: AssistantPageProps) {
  const branches = getAvailableBranchOptions();
  const resolvedSearchParams = await searchParams;
  const selectedBranchId = resolveSelectedBranchId(
    resolvedSearchParams.branch,
    branches.map((branch) => branch.branchId),
  );
  const requestedProductId = Array.isArray(resolvedSearchParams.product)
    ? resolvedSearchParams.product[0] ?? null
    : resolvedSearchParams.product ?? null;
  const contextSnapshot = buildAssistantContextSnapshot(selectedBranchId, requestedProductId);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <DetailPageHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          title="AI assistant"
          subtitle="Grounded branch analysis with Gemini, limited to the current Bravo snapshot and selected product context."
          generatedAt={contextSnapshot.branch.generatedAt}
          preservedSearchParamKeys={["product"]}
          staticMode={testStaticMode}
        />
        <AssistantExperience
          branchId={selectedBranchId}
          initialProductId={requestedProductId}
          contextSnapshot={contextSnapshot}
          staticMode={testStaticMode}
        />
      </div>
    </AppShell>
  );
}
