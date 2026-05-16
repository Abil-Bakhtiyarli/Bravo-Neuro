"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SavingsCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const savingsComparison_1 = require("@/lib/savingsComparison");
function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "AZN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}
function formatUnits(value) {
    const roundedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
    return `${roundedValue} units`;
}
function ComparisonPanel({ icon: Icon, label, value, helper, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-border/70 bg-background/88 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: label }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-2xl font-semibold tracking-tight text-foreground", children: value })] }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-2xl border border-border/70 bg-card/90 p-2.5 text-muted-foreground", children: (0, jsx_runtime_1.jsx)(Icon, { className: "size-4" }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-foreground/78", children: helper })] }));
}
function MetricTile({ label, value }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/70 bg-background/88 p-3.5", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: label }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm font-semibold leading-6 text-foreground", children: value })] }));
}
function SavingsCard({ recommendation, savings, unitPriceAzN }) {
    if (!recommendation || !savings) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-border/75 bg-card/90 p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CircleDollarSign, { className: "size-4" }), "Savings comparison"] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-sm leading-6 text-muted-foreground", children: "This product does not currently carry a separate before-and-after savings scenario." })] }));
    }
    const comparison = (0, savingsComparison_1.buildSavingsComparisonViewModel)(recommendation, savings);
    const averageValuePerRecoveredUnit = comparison.estimatedRecoveredUnits > 0
        ? comparison.grossRecoveredValueAzN / comparison.estimatedRecoveredUnits
        : unitPriceAzN;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-border/75 bg-card/90 p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CircleDollarSign, { className: "size-4" }), "Savings comparison"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 rounded-3xl border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid gap-3 sm:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(ComparisonPanel, { icon: lucide_react_1.TrendingDown, label: "Without action", value: formatCurrency(comparison.beforeActionLossAzN), helper: `${formatUnits(comparison.unitsAtRisk)} remain exposed to waste if the branch does nothing.` }), (0, jsx_runtime_1.jsx)(ComparisonPanel, { icon: lucide_react_1.TrendingUp, label: "With action", value: formatCurrency(comparison.netSavedValueAzN), helper: `${formatCurrency(comparison.afterActionResidualLossAzN)} stays exposed after the recommended move.` })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid gap-3 sm:grid-cols-3", children: [(0, jsx_runtime_1.jsx)(MetricTile, { label: "Recovered value", value: formatCurrency(comparison.grossRecoveredValueAzN) }), (0, jsx_runtime_1.jsx)(MetricTile, { label: "Action cost", value: formatCurrency(comparison.totalActionCostAzN) }), (0, jsx_runtime_1.jsx)(MetricTile, { label: "Waste avoided", value: formatUnits(comparison.estimatedWasteUnitsAvoided) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 rounded-2xl border border-border/70 bg-background/88 p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Method" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm leading-6 text-foreground/80", children: comparison.methodology }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-3 text-sm leading-6 text-foreground/80", children: ["Recovered units are valued at", " ", (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-foreground", children: formatCurrency(averageValuePerRecoveredUnit) }), " ", "per unit for this action scenario."] })] })] })] }));
}
