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

import DashboardLayout from "@/components/DashboardLayout";

const kpiCards = [
  {
    label: "Possible waste",
    value: "AZN 240.0",
    helper: "Highest exposure sits in dairy and bakery lots.",
    tone: "Exposure snapshot",
    icon: AlertTriangle,
  },
  {
    label: "Recoverable value",
    value: "AZN 53.8",
    helper: "Discount and transfer placeholders reserved for Part 11.",
    tone: "Recovery path",
    icon: BanknoteArrowDown,
  },
  {
    label: "Risky products",
    value: "4",
    helper: "Medium, high, and critical rows will flow from dashboard data.",
    tone: "Priority count",
    icon: PackageSearch,
  },
  {
    label: "Tasks today",
    value: "4",
    helper: "Action plan remains static until branch state arrives in Part 9.",
    tone: "Workflow load",
    icon: CalendarClock,
  },
] as const;

const placeholderRows = [
  {
    product: "Greek Yogurt 500g",
    category: "Dairy",
    stock: "30 units",
    expiry: "1 day",
    risk: "Critical",
    action: "Dynamic discount",
  },
  {
    product: "Butter Croissant",
    category: "Bakery",
    stock: "20 units",
    expiry: "1 day",
    risk: "High",
    action: "Dynamic discount",
  },
  {
    product: "Sourdough Bread",
    category: "Bakery",
    stock: "24 units",
    expiry: "2 days",
    risk: "High",
    action: "Dynamic discount",
  },
  {
    product: "Strawberries 250g",
    category: "Fruit",
    stock: "18 units",
    expiry: "3 days",
    risk: "High",
    action: "Transfer candidate",
  },
] as const;

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

function TopBar() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          <span className="rounded-full border border-border/80 bg-accent/75 px-2.5 py-1">
            Bravo Neuro
          </span>
          <span className="rounded-full border border-dashed border-border/80 px-2.5 py-1">
            Part 8 layout foundation
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl xl:text-[2.8rem]">
            Retail waste-risk operations dashboard with the full demo story
            blocked in.
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Static shell only for now: dashboard structure, surface hierarchy,
            and placeholder decision areas are ready for live branch controls,
            KPI wiring, risk rows, drawer detail, and task interactions.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem]">
        <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Selected branch
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Bravo Ganjlik
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Branch switching starts in Part 9.
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Daily status
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Review cycle queued
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Saturday, 16 May 2026
          </p>
        </div>
      </div>
    </div>
  );
}

function KpiStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiCards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {card.tone}
                </p>
                <h2 className="mt-2 text-sm font-medium text-foreground/80">
                  {card.label}
                </h2>
              </div>
              <div className="rounded-2xl border border-border/80 bg-background/80 p-2 text-foreground/80">
                <Icon className="size-4" />
              </div>
            </div>
            <p className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {card.helper}
            </p>
          </article>
        );
      })}
    </div>
  );
}

function MainPane() {
  return (
    <div className="rounded-3xl border border-border/80 bg-card/92 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.55)]">
      <div className="flex flex-col gap-4 border-b border-border/80 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product risk table
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Products needing attention
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
            <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1.5">
              Search placeholder
            </span>
            <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1.5">
              Category filter later
            </span>
            <span className="rounded-full border border-dashed border-border/80 px-3 py-1.5">
              Risk badge states later
            </span>
          </div>
        </div>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Static rows below reserve the exact story arc for later parts:
          expiry pressure, action urgency, and one clear recommended next step
          per product.
        </p>
      </div>

      <div className="overflow-x-auto px-3 pb-3 sm:px-4 sm:pb-4">
        <table className="min-w-full border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <th className="px-3 pt-3 pb-1">Product</th>
              <th className="px-3 pt-3 pb-1">Category</th>
              <th className="px-3 pt-3 pb-1">Stock</th>
              <th className="px-3 pt-3 pb-1">Expiry</th>
              <th className="px-3 pt-3 pb-1">Risk</th>
              <th className="px-3 pt-3 pb-1">Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {placeholderRows.map((row, index) => (
              <tr
                key={row.product}
                className="rounded-2xl border border-border/75 bg-background/82 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)]"
              >
                <td className="rounded-l-2xl border-y border-l border-border/75 px-3 py-4 align-middle">
                  <div className="min-w-[12rem]">
                    <p className="font-medium text-foreground">{row.product}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Product story slot #{index + 1}
                    </p>
                  </div>
                </td>
                <td className="border-y border-border/75 px-3 py-4 text-sm text-foreground/80">
                  {row.category}
                </td>
                <td className="border-y border-border/75 px-3 py-4 text-sm text-foreground/80">
                  {row.stock}
                </td>
                <td className="border-y border-border/75 px-3 py-4 text-sm text-foreground/80">
                  {row.expiry}
                </td>
                <td className="border-y border-border/75 px-3 py-4">
                  <span className="inline-flex rounded-full border border-border/80 bg-muted/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75">
                    {row.risk}
                  </span>
                </td>
                <td className="rounded-r-2xl border-y border-r border-border/75 px-3 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground/85">
                      {row.action}
                    </span>
                    <span className="hidden rounded-full border border-border/80 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
                      Click state later
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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
            Part 9 adds the real header structure and visual branch control.
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-3.5">
            <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-foreground/70" />
            Part 10 and Part 11 replace the KPI placeholders with reusable UI
            and live values.
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-3.5">
            <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-foreground/70" />
            Parts 12-18 progressively activate the table, drawer, recommendation,
            savings, and task workflow.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <DashboardLayout
      topBar={<TopBar />}
      kpiStrip={<KpiStrip />}
      mainPane={<MainPane />}
      sidePane={<SidePane />}
      detailHint={<DetailHint />}
    />
  );
}
