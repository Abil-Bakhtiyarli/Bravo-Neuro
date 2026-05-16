import type { BranchComparisonSummary } from "@/lib/branchComparison";
import { cn } from "@/lib/utils";

type BranchComparisonCardProps = {
  comparisons: readonly BranchComparisonSummary[];
};

const riskBadgeStyles = {
  critical: "border-rose-300/65 bg-rose-100/60 text-rose-900",
  high: "border-amber-300/65 bg-amber-100/60 text-amber-900",
  medium: "border-sky-300/65 bg-sky-100/60 text-sky-900",
  low: "border-emerald-300/65 bg-emerald-100/60 text-emerald-900",
} as const;

export default function BranchComparisonCard({ comparisons }: BranchComparisonCardProps) {
  return (
    <section className="demo-card animate-demo-fade-up animate-demo-delay-3 p-5 sm:p-6">
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
              "demo-surface-interactive rounded-2xl border p-4 transition-[background-color,border-color,box-shadow,transform] duration-200",
              branch.isSelected
                ? "demo-surface-interactive-selected"
                : "demo-surface-interactive-hover",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{branch.branchName}</p>
                  {branch.isSelected ? (
                    <span className="rounded-full border border-emerald-300/65 bg-emerald-100/65 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-900">
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
