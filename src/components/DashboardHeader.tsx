"use client";

import { CalendarClock, MapPin, Store } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type { Branch, BranchId, DemandProfile } from "@/lib/types";

type DashboardHeaderProps = {
  branches: Branch[];
  selectedBranchId: BranchId;
  generatedAt: string;
};

const branchStatusText: Record<string, string> = {
  ganjlik: "Morning review ready",
  yasamal: "Family demand review ready",
  may28: "Transit peak review ready",
};

const demandProfileLabels: Record<DemandProfile, string> = {
  commuter: "Commuter demand",
  family: "Family demand",
  "premium-mixed": "Premium mixed demand",
};

function formatDemoDate(generatedAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(generatedAt));
}

function getBranchStatus(branchId: BranchId) {
  return branchStatusText[branchId] ?? "Daily review ready";
}

export default function DashboardHeader({
  branches,
  selectedBranchId,
  generatedAt,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const branchIds = useMemo(
    () => branches.map((branch) => branch.branchId),
    [branches],
  );
  const requestedBranchId = searchParams.get("branch");
  const activeBranchId =
    requestedBranchId && branchIds.includes(requestedBranchId)
      ? requestedBranchId
      : selectedBranchId;

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.branchId === activeBranchId) ?? branches[0],
    [activeBranchId, branches],
  );

  function handleBranchChange(nextBranchId: BranchId) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("branch", nextBranchId);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          <span className="rounded-full border border-border/80 bg-accent/75 px-2.5 py-1">
            Bravo Neuro
          </span>
          <span className="rounded-full border border-dashed border-border/80 px-2.5 py-1">
            Part 10 KPI cards active
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl xl:text-[2.8rem]">
            Retail waste-risk operations dashboard for branch-level decisions.
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Branch control is now URL-backed for the demo flow. KPI values, risk
            rows, drawer detail, and manager tasks remain staged for the later
            data-wiring parts.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:w-[30rem]">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Selected branch
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {selectedBranch.branchName}
              </p>
            </div>
            <Store className="mt-1 size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 flex items-start gap-2 text-sm leading-5 text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span>{selectedBranch.location}</span>
          </p>
          <p className="mt-2 text-sm font-medium text-foreground/75">
            {demandProfileLabels[selectedBranch.demandProfile]}
          </p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Branch selector
            <select
              className="mt-2 w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              value={activeBranchId}
              onChange={(event) => handleBranchChange(event.target.value)}
            >
              {branches.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Daily status
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {getBranchStatus(selectedBranch.branchId)}
              </p>
            </div>
            <CalendarClock className="mt-1 size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDemoDate(generatedAt)}
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-border/80 bg-card/70 px-3 py-2 text-xs leading-5 text-muted-foreground">
            The branch URL is ready for later KPI and table data wiring.
          </div>
        </div>
      </div>
    </div>
  );
}
