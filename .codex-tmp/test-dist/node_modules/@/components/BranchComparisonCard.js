"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BranchComparisonCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
const riskBadgeStyles = {
    critical: "border-rose-300/80 bg-rose-100 text-rose-800",
    high: "border-amber-300/80 bg-amber-100 text-amber-800",
    medium: "border-sky-300/80 bg-sky-100 text-sky-800",
    low: "border-emerald-300/80 bg-emerald-100 text-emerald-800",
};
function BranchComparisonCard({ comparisons }) {
    return ((0, jsx_runtime_1.jsxs)("section", { className: "animate-demo-fade-up animate-demo-delay-3 rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)] sm:p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Branch comparison" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-xl font-semibold tracking-tight text-foreground", children: "Snapshot across all branches" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-5 space-y-3", children: comparisons.map((branch) => ((0, jsx_runtime_1.jsxs)("article", { className: (0, utils_1.cn)("rounded-2xl border p-4 transition-[background-color,border-color,box-shadow,transform] duration-200", branch.isSelected
                        ? "border-emerald-300/80 bg-emerald-50/70 shadow-[0_18px_45px_-38px_rgba(5,150,105,0.5)]"
                        : "border-border/75 bg-background/88 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-30px_rgba(15,23,42,0.38)]"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-foreground", children: branch.branchName }), branch.isSelected ? ((0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-emerald-200/90 bg-emerald-100/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800", children: "Active" })) : null] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-2 text-sm text-muted-foreground", children: [branch.riskyProductsCount, " risky products | Top action: ", branch.topActionLabel] })] }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", riskBadgeStyles[branch.highestRiskLevel]), children: branch.highestRiskLevel })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Protected value" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-foreground", children: branch.protectedValueDisplay })] })] }, branch.branchId))) })] }));
}
