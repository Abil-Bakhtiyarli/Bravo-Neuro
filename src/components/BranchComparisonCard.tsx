import type { BranchComparisonSummary } from "@/lib/branchComparison";
import { cn } from "@/lib/utils";

type BranchComparisonCardProps = {
  comparisons: readonly BranchComparisonSummary[];
};

const riskBadgeStyles = {
  critical: "border-rose-300/80 bg-rose-100 text-rose-800",
  high: "border-amber-300/80 bg-amber-100 text-amber-800",
  medium: "border-sky-300/80 bg-sky-100 text-sky-800",
  low: "border-emerald-300/80 bg-emerald-100 text-emerald-800",
} as const;

export default function BranchComparisonCard({ comparisons }: BranchComparisonCardProps) {
  return (
    <section className="animate-demo-fade-up animate-demo-delay-3 rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Branch comparison
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        Snapshot across all branches
      </h2>

      <div className="mt-5 space-y-3">
        {comparisons.map((branch) => (
          <article
            key={branch.branchId}
            className={cn(
              "rounded-2xl border p-4 transition-[background-color,border-color,box-shadow,transform] duration-200",
              branch.isSelected
                ? "border-emerald-300/80 bg-emerald-50/70 shadow-[0_18px_45px_-38px_rgba(5,150,105,0.5)]"
                : "border-border/75 bg-background/88 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-30px_rgba(15,23,42,0.38)]",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{branch.branchName}</p>
                  {branch.isSelected ? (
                    <span className="rounded-full border border-emerald-200/90 bg-emerald-100/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {branch.riskyProductsCount} risky products | Top action: {branch.topActionLabel}
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                  riskBadgeStyles[branch.highestRiskLevel],
                )}
              >
                {branch.highestRiskLevel}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Protected value
              </p>
              <p className="text-sm font-semibold text-foreground">{branch.protectedValueDisplay}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
