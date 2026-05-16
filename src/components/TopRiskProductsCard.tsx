import { ChevronRight } from "lucide-react";

import type { BranchDashboardData, ProductDetailData } from "@/lib/types";
import { cn } from "@/lib/utils";

type TopRiskProductsCardProps = {
  rows: BranchDashboardData["riskTable"];
  productDetailsById: BranchDashboardData["productDetailsById"];
  selectedProductId: string | null;
  onOpenProduct: (productId: string) => void;
};

const riskBadgeStyles = {
  critical: "border-rose-300/80 bg-rose-100 text-rose-800",
  high: "border-amber-300/80 bg-amber-100 text-amber-800",
  medium: "border-sky-300/80 bg-sky-100 text-sky-800",
  low: "border-emerald-300/80 bg-emerald-100 text-emerald-800",
} as const;

const actionLabels = {
  discount: "Discount",
  transfer: "Transfer",
  "reorder-adjustment": "Reorder",
  "shelf-action": "Shelf action",
  investigation: "Investigate",
} as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getNetSavedValue(detail: ProductDetailData | null | undefined, fallbackValue: number) {
  return detail?.savings?.netSavedValueAzN ?? fallbackValue;
}

export default function TopRiskProductsCard({
  rows,
  productDetailsById,
  selectedProductId,
  onOpenProduct,
}: TopRiskProductsCardProps) {
  const topRows = rows.slice(0, 5);

  return (
    <section className="animate-demo-fade-up animate-demo-delay-2 rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Top risk products
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Highest-priority review queue
          </h2>
        </div>
        <span className="rounded-full border border-border/80 bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
          Top 5
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {topRows.map((row) => {
          const detail = productDetailsById[row.productId];
          const isSelected = selectedProductId === row.productId;

          return (
            <button
              key={row.productId}
              type="button"
              onClick={() => onOpenProduct(row.productId)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200",
                isSelected
                  ? "border-emerald-300/80 bg-emerald-50/70 shadow-[0_18px_45px_-38px_rgba(5,150,105,0.5)]"
                  : "border-border/75 bg-background/88 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-background hover:shadow-[0_16px_36px_-30px_rgba(15,23,42,0.38)]",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{row.productName}</p>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      riskBadgeStyles[row.riskLevel],
                    )}
                  >
                    {row.riskLevel}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{actionLabels[row.actionType]}</span>
                  <span>{formatCurrency(getNetSavedValue(detail, row.netSavedValueAzN))}</span>
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          );
        })}

        {topRows.length === 0 ? (
          <div className="rounded-2xl border border-border/75 bg-background/88 p-4 text-sm leading-6 text-muted-foreground">
            No risky products are currently queued for this branch.
          </div>
        ) : null}
      </div>
    </section>
  );
}
