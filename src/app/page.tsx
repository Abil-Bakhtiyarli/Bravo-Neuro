import {
  AlertTriangle,
  ArrowRightLeft,
  BanknoteArrowDown,
  CalendarClock,
  CircleCheckBig,
  FlaskConical,
  PackageSearch,
  TrendingUp,
} from "lucide-react";

import DashboardHeader from "@/components/DashboardHeader";
import DashboardLayout from "@/components/DashboardLayout";
import KpiCards, { type KpiCardItem } from "@/components/KpiCards";
import RiskTable from "@/components/RiskTable";
import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";
import {
  buildDashboardKpiPresentationItems,
  type DashboardKpiPresentationItem,
} from "@/lib/dashboardKpiPresentation";
import type { BranchId } from "@/lib/types";

function toKpiCardItem(item: DashboardKpiPresentationItem): KpiCardItem {
  switch (item.key) {
    case "possible-loss":
      return {
        ...item,
        icon: AlertTriangle,
      };
    case "recoverable-value":
      return {
        ...item,
        icon: BanknoteArrowDown,
      };
    case "risky-products":
      return {
        ...item,
        icon: PackageSearch,
      };
    case "tasks-today":
      return {
        ...item,
        icon: CalendarClock,
      };
    default:
      throw new Error(`Unsupported KPI card key: ${String(item.key)}`);
  }
}

const actionPlanRows = [
  {
    title: "Approve dairy markdown block",
    detail: "Static task shell for the morning handoff.",
    value: "AZN 4.7 recovery",
    badge: "Pending",
  },
  {
    title: "Prepare inter-branch transfer",
    detail: "Destination logic arrives later from recommendation data.",
    value: "12 units placeholder",
    badge: "Pending",
  },
  {
    title: "Recheck bakery shelf exposure",
    detail: "Status buttons and transitions start in a later part.",
    value: "Visibility review",
    badge: "Queued",
  },
  {
    title: "Confirm evening waste pickup note",
    detail: "Task state remains visual-only in this dashboard foundation.",
    value: "Ops follow-up",
    badge: "Queued",
  },
] as const;

type MainPaneProps = {
  rows: Parameters<typeof RiskTable>[0]["rows"];
};

function MainPane({ rows }: MainPaneProps) {
  return <RiskTable rows={rows} />;
}

function SidePane() {
  return (
    <div className="rounded-3xl border border-border/80 bg-card/92 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.55)]">
      <div className="border-b border-border/80 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Daily action plan
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Manager handoff queue
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Part 8 reserves the task rail and completion affordances. Real task
          status wiring stays for later UI slices.
        </p>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {actionPlanRows.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border/75 bg-background/82 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span className="rounded-full border border-border/80 bg-muted/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/75">
                {item.badge}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
              <span className="text-sm font-medium text-foreground/80">
                {item.value}
              </span>
              <button
                type="button"
                className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                Status control later
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DetailHint() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-3xl border border-dashed border-border/80 bg-background/72 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product detail drawer
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Reserved product story canvas
            </h2>
          </div>
          <FlaskConical className="mt-1 size-5 text-muted-foreground" />
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
          Later parts will replace this reserved surface with the selected
          product drawer: risk score, top drivers, explanation text,
          recommendation card, and savings comparison card.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/75 bg-card/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Risk explanation
            </p>
            <div className="mt-4 h-2.5 rounded-full bg-muted/80" />
            <div className="mt-3 h-2.5 w-4/5 rounded-full bg-muted/70" />
            <div className="mt-3 h-2.5 w-3/5 rounded-full bg-muted/60" />
          </div>
          <div className="rounded-2xl border border-border/75 bg-card/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Recommendation
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
              <ArrowRightLeft className="size-4 text-muted-foreground" />
              Action card placeholder
            </div>
            <div className="mt-3 h-2.5 w-2/3 rounded-full bg-muted/70" />
          </div>
          <div className="rounded-2xl border border-border/75 bg-card/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Savings
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
              <TrendingUp className="size-4 text-muted-foreground" />
              AZN impact placeholder
            </div>
            <div className="mt-3 h-2.5 w-1/2 rounded-full bg-muted/70" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card/88 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Part boundary
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          What starts next
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
          <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-3.5">
            <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-foreground/70" />
            Part 9 locked in the real header structure and URL-backed branch control.
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-3.5">
            <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-foreground/70" />
            Parts 10 and 11 now cover reusable KPI presentation and live branch-aware
            values.
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-3.5">
            <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-foreground/70" />
            Part 12 now locks the risk table presentation before Parts 13-18 activate
            live rows, drawer detail, recommendations, savings, and tasks.
          </li>
        </ul>
      </div>
    </div>
  );
}

type HomeProps = {
  searchParams: Promise<{ branch?: string | string[] }>;
};

function resolveSelectedBranchId(
  requestedBranch: string | string[] | undefined,
  branchIds: BranchId[],
) {
  const requestedValue = Array.isArray(requestedBranch)
    ? requestedBranch[0]
    : requestedBranch;

  if (requestedValue && branchIds.includes(requestedValue)) {
    return requestedValue;
  }

  return branchIds[0];
}

export default async function Home({ searchParams }: HomeProps) {
  const branches = getAvailableBranchOptions();
  const selectedBranchId = resolveSelectedBranchId(
    (await searchParams).branch,
    branches.map((branch) => branch.branchId),
  );
  const dashboardData = getDashboardData(selectedBranchId);
  const kpiCards = buildDashboardKpiPresentationItems(dashboardData).map(toKpiCardItem);

  return (
    <DashboardLayout
      topBar={
        <DashboardHeader
          branches={branches}
          selectedBranchId={selectedBranchId}
          generatedAt={dashboardData.generatedAt}
        />
      }
      kpiStrip={<KpiCards items={kpiCards} />}
      mainPane={<MainPane rows={dashboardData.riskTable} />}
      sidePane={<SidePane />}
      detailHint={<DetailHint />}
    />
  );
}
