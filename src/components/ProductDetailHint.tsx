"use client";

import { ArrowRightLeft, FlaskConical, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import type { RiskTableItem } from "@/lib/types";
import { getSelectedRiskTableRow } from "@/lib/riskTableInteraction";

type ProductDetailHintProps = {
  rows: readonly RiskTableItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductDetailHint({ rows }: ProductDetailHintProps) {
  const searchParams = useSearchParams();
  const selectedProductId = searchParams.get("product");
  const selectedRow = useMemo(
    () => getSelectedRiskTableRow(rows, selectedProductId),
    [rows, selectedProductId],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-3xl border border-dashed border-border/80 bg-background/72 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product detail drawer
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {selectedRow ? "Selection ready for Part 15" : "Reserved product story canvas"}
            </h2>
          </div>
          <FlaskConical className="mt-1 size-5 text-muted-foreground" />
        </div>

        {selectedRow ? (
          <>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              {selectedRow.productName} is now selected from the live risk table. Part 15 can
              attach the full drawer to this URL-backed selection without changing the table
              state model.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/75 bg-card/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Current risk
                </p>
                <p className="mt-4 text-lg font-semibold text-foreground">
                  {selectedRow.riskLevel} | {selectedRow.riskScore}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Drawer explanation starts next part.
                </p>
              </div>
              <div className="rounded-2xl border border-border/75 bg-card/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Recommendation
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
                  <ArrowRightLeft className="size-4 text-muted-foreground" />
                  Selected action is ready
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedRow.recommendationSummary}
                </p>
              </div>
              <div className="rounded-2xl border border-border/75 bg-card/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Savings
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  Net recovery staged
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatCurrency(selectedRow.netSavedValueAzN)} potential net recovery.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              Later parts will replace this reserved surface with the selected product drawer:
              risk score, top drivers, explanation text, recommendation card, and savings
              comparison card.
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
          </>
        )}
      </div>

      <div className="rounded-3xl border border-border/80 bg-card/88 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Part boundary
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          What starts next
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
          <li className="rounded-2xl border border-border/70 bg-background/80 p-3.5">
            Part 14 now makes the risk table searchable, filterable, and URL-selectable.
          </li>
          <li className="rounded-2xl border border-border/70 bg-background/80 p-3.5">
            Part 15 attaches the product drawer to the selected `product` query param.
          </li>
          <li className="rounded-2xl border border-border/70 bg-background/80 p-3.5">
            Recommendation and savings cards still remain separate dedicated slices after the
            drawer shell lands.
          </li>
        </ul>
      </div>
    </div>
  );
}
