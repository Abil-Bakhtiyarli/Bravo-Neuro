import { ArrowDownLeft, ArrowUpRight, Clock3, Package2, ShieldCheck } from "lucide-react";

import type { TransfersPageData, TransferLaneUrgency } from "@/lib/operationsDemoData";
import { cn } from "@/lib/utils";

type TransfersOverviewProps = {
  data: TransfersPageData;
};

const urgencyBadgeStyles: Record<TransferLaneUrgency, string> = {
  critical: "border-rose-300/65 bg-rose-100/60 text-rose-900",
  watch: "border-amber-300/65 bg-amber-100/60 text-amber-900",
  planned: "border-sky-300/65 bg-sky-100/60 text-sky-900",
};

function formatCurrency(value: number) {
  return `AZN ${value.toFixed(1)}`;
}

function formatCoverage(value: number | null) {
  if (value === null) {
    return "No run rate";
  }

  return `${value.toFixed(1)} days`;
}

export default function TransfersOverview({ data }: TransfersOverviewProps) {
  const summaryCards = [
    {
      label: "Active lanes",
      value: String(data.activeTransferCount),
      helperText: "Current branch handoffs that can protect margin before expiry.",
      icon: Package2,
      tone: "text-sky-900 bg-sky-100/60",
    },
    {
      label: "Value protected",
      value: formatCurrency(data.valueProtectedAzN),
      helperText: "Estimated full-price value that stays sellable if these lanes move on time.",
      icon: ShieldCheck,
      tone: "text-emerald-900 bg-emerald-100/60",
    },
    {
      label: "Units to move",
      value: String(data.unitsToMove),
      helperText: "Total cartons or selling units flagged for near-term branch balancing.",
      icon: ArrowUpRight,
      tone: "text-foreground/80 bg-muted/82",
    },
    {
      label: "Urgent today",
      value: String(data.urgentTransferCount),
      helperText: "Lanes that should move in the next dispatch window to avoid markdown pressure.",
      icon: Clock3,
      tone: "text-rose-900 bg-rose-100/60",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} className="demo-card animate-demo-fade-up p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground/80">{card.label}</p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                    {card.value}
                  </p>
                </div>
                <span className={cn("demo-surface-panel p-2.5", card.tone)}>
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.helperText}</p>
            </article>
          );
        })}
      </section>

      <section className="demo-card animate-demo-fade-up animate-demo-delay-2 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Transfers
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Inter-branch transfer recommendations
            </h2>
          </div>
          <span className="demo-surface-chip px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
            {data.branchName}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          These lanes are fake for the hackathon build, but each one is grounded in the current branch demand and shelf-life pattern.
        </p>

        <div className="mt-5 space-y-3">
          {data.lanes.map((lane) => {
            const DirectionIcon = lane.direction === "outbound" ? ArrowUpRight : ArrowDownLeft;

            return (
              <article
                key={lane.transferId}
                className="demo-surface-interactive demo-surface-interactive-hover rounded-2xl border p-4 transition-[background-color,border-color,box-shadow,transform] duration-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="demo-surface-panel p-2 text-foreground/80">
                        <DirectionIcon className="size-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{lane.productName}</p>
                      <span className="rounded-full border border-border/75 bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {lane.direction === "outbound" ? "Outbound" : "Inbound"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {lane.direction === "outbound" ? "To" : "From"} {lane.counterpartBranchName} | {lane.summary}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      urgencyBadgeStyles[lane.urgency],
                    )}
                  >
                    {lane.urgency}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2 xl:grid-cols-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Quantity
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{lane.quantityUnits} units</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Value protected
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatCurrency(lane.expectedValueProtectedAzN)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Sell-through gap
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{lane.speedMultiplier.toFixed(2)}x</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Stock cover
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatCoverage(lane.stockCoverageDays)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Next window
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{lane.transferWindowLabel}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{lane.statusLabel}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
