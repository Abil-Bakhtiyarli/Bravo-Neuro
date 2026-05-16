"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BranchComparisonCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
const riskBadgeStyles = {
    critical: "border-rose-300/65 bg-rose-100/60 text-rose-900",
    high: "border-amber-300/65 bg-amber-100/60 text-amber-900",
    medium: "border-sky-300/65 bg-sky-100/60 text-sky-900",
    low: "border-emerald-300/65 bg-emerald-100/60 text-emerald-900",
};
function BranchComparisonCard({ comparisons }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "demo-card animate-demo-fade-up animate-demo-delay-3 p-5 sm:p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Branch comparison" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-xl font-semibold tracking-tight text-foreground", children: "Snapshot across all branches" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-5 space-y-3", children: comparisons.map((branch) => ((0, jsx_runtime_1.jsxs)("article", { className: (0, utils_1.cn)("demo-surface-interactive rounded-2xl border p-4 transition-[background-color,border-color,box-shadow,transform] duration-200", branch.isSelected
                        ? "demo-surface-interactive-selected"
                        : "demo-surface-interactive-hover"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-foreground", children: branch.branchName }), branch.isSelected ? ((0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-emerald-300/65 bg-emerald-100/65 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-900", children: "Active" })) : null] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-2 text-sm text-muted-foreground", children: [branch.riskyProductsCount, " risky products | Top action: ", branch.topActionLabel] })] }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", riskBadgeStyles[branch.highestRiskLevel]), children: branch.highestRiskLevel })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Protected value" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-foreground", children: branch.protectedValueDisplay })] })] }, branch.branchId))) })] }));
}
