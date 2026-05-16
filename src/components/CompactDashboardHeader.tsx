"use client";

import { CalendarClock, ChevronDown, Store } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Branch, BranchId } from "@/lib/types";

type CompactDashboardHeaderProps = {
  branches: Branch[];
  selectedBranchId: BranchId;
  generatedAt: string;
  staticMode?: boolean;
};

function formatDemoDate(generatedAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(generatedAt));
}

type CompactDashboardHeaderPanelProps = Omit<CompactDashboardHeaderProps, "staticMode"> & {
  onBranchChange: (nextBranchId: BranchId) => void;
};

function CompactDashboardHeaderPanel({
  branches,
  selectedBranchId,
  generatedAt,
  onBranchChange,
}: CompactDashboardHeaderPanelProps) {
  return (
    <section className="demo-card animate-demo-fade-up p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
            Branch overview
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="demo-surface-chip inline-flex items-center gap-2 px-3 py-1.5">
              <Store className="size-4" />
              {branches.find((branch) => branch.branchId === selectedBranchId)?.branchName ?? branches[0]?.branchName}
            </span>
            <span className="demo-surface-chip inline-flex items-center gap-2 px-3 py-1.5">
              <CalendarClock className="size-4" />
              {formatDemoDate(generatedAt)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-emerald-50/65 px-3 py-1.5 text-emerald-900">
              AI risk scan completed
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-[14rem] text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Branch
            <div className="relative mt-2">
              <select
                className="demo-surface-panel w-full appearance-none px-4 py-3 pr-10 text-sm font-medium tracking-normal text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                value={selectedBranchId}
                onChange={(event) => onBranchChange(event.target.value)}
              >
                {branches.map((branch) => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </label>

          <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/70 bg-emerald-50/65 px-4 py-3 text-sm font-medium text-emerald-900">
            <span aria-hidden="true" className="relative inline-flex size-3 items-center justify-center">
              <span className="animate-demo-live-pulse absolute inset-0 rounded-full bg-emerald-400/55" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live data
          </div>
        </div>
      </div>
    </section>
  );
}

function CompactDashboardHeaderInteractive({
  branches,
  selectedBranchId,
  generatedAt,
}: CompactDashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleBranchChange(nextBranchId: BranchId) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("branch", nextBranchId);
    nextParams.delete("product");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  return (
    <CompactDashboardHeaderPanel
      branches={branches}
      selectedBranchId={selectedBranchId}
      generatedAt={generatedAt}
      onBranchChange={handleBranchChange}
    />
  );
}

export default function CompactDashboardHeader(props: CompactDashboardHeaderProps) {
  if (props.staticMode) {
    return <CompactDashboardHeaderPanel {...props} onBranchChange={() => undefined} />;
  }

  return <CompactDashboardHeaderInteractive {...props} />;
}
