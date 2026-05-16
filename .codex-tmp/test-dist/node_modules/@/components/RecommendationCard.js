"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecommendationCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const actionPresentation = {
    discount: {
        badge: "Dynamic discount",
        title: "Launch markdown today",
        icon: lucide_react_1.BadgePercent,
        accent: "border-rose-200 bg-rose-50 text-rose-700",
    },
    transfer: {
        badge: "Stock transfer",
        title: "Move stock to faster branch",
        icon: lucide_react_1.Truck,
        accent: "border-sky-200 bg-sky-50 text-sky-700",
    },
    "reorder-adjustment": {
        badge: "Reorder adjustment",
        title: "Trim the next replenishment",
        icon: lucide_react_1.PackageMinus,
        accent: "border-amber-200 bg-amber-50 text-amber-700",
    },
    "shelf-action": {
        badge: "Shelf action",
        title: "Improve front-of-store visibility",
        icon: lucide_react_1.Store,
        accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    investigation: {
        badge: "Investigation",
        title: "Validate the branch signal",
        icon: lucide_react_1.ScanSearch,
        accent: "border-violet-200 bg-violet-50 text-violet-700",
    },
};
const reasonCodeLabels = {
    "near-expiry": "Near expiry",
    "high-risk-score": "High risk score",
    "excess-stock": "Excess stock",
    "faster-branch-demand": "Faster branch demand",
    "transfer-feasible": "Transfer is feasible",
    oversupply: "Oversupply",
    "waste-trend": "Waste trend",
    "visibility-boost": "Visibility boost",
    "data-conflict": "Data conflict",
    "unclear-primary-action": "Primary action is unclear",
};
function formatPercent(value) {
    return `${value}%`;
}
function formatMultiplier(value) {
    return `${value.toFixed(2)}x`;
}
function formatUnits(value) {
    const roundedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
    return `${roundedValue} units`;
}
function buildMetrics(recommendation) {
    switch (recommendation.actionType) {
        case "discount":
            return [
                {
                    label: "Base markdown",
                    value: formatPercent(recommendation.discountPercent),
                },
                {
                    label: "Fallback markdown",
                    value: formatPercent(recommendation.fallbackDiscountPercent),
                },
                {
                    label: "Target by tomorrow",
                    value: formatUnits(recommendation.targetUnitsByTomorrow),
                },
                {
                    label: "Expected with markdown",
                    value: formatUnits(recommendation.expectedUnitsByTomorrow),
                },
            ];
        case "transfer":
            return [
                {
                    label: "Destination branch",
                    value: recommendation.destinationBranchName,
                },
                {
                    label: "Transfer quantity",
                    value: formatUnits(recommendation.transferQuantity),
                },
                {
                    label: "Sales speed lift",
                    value: formatMultiplier(recommendation.salesSpeedMultiplier),
                },
            ];
        case "reorder-adjustment":
            return [
                {
                    label: "Next order move",
                    value: recommendation.adjustment === "pause" ? "Pause order" : "Reduce order",
                },
                {
                    label: "Suggested multiplier",
                    value: formatMultiplier(recommendation.suggestedOrderMultiplier),
                },
            ];
        case "shelf-action":
            return [
                {
                    label: "Target placement",
                    value: recommendation.targetPlacement,
                },
            ];
        case "investigation":
            return recommendation.checks.map((check, index) => ({
                label: `Follow-up ${index + 1}`,
                value: check,
            }));
        default:
            return [];
    }
}
function MetricTile({ label, value }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/70 bg-background/88 p-3.5", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: label }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm font-semibold leading-6 text-foreground", children: value })] }));
}
function RecommendationCard({ recommendation }) {
    if (!recommendation) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-border/75 bg-card/90 p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRightLeft, { className: "size-4" }), "Recommended action"] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-sm leading-6 text-muted-foreground", children: "This product does not need a primary action in the current branch snapshot." })] }));
    }
    const presentation = actionPresentation[recommendation.actionType];
    const Icon = presentation.icon;
    const metrics = buildMetrics(recommendation);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-border/75 bg-card/90 p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRightLeft, { className: "size-4" }), "Recommended action"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 rounded-3xl border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("span", { className: `inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${presentation.accent}`, children: presentation.badge }), (0, jsx_runtime_1.jsx)("h3", { className: "mt-3 text-xl font-semibold tracking-tight text-foreground", children: presentation.title }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-foreground/85", children: recommendation.summary })] }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-2xl border border-border/70 bg-background/88 p-3 text-muted-foreground", children: (0, jsx_runtime_1.jsx)(Icon, { className: "size-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: metrics.map((metric) => ((0, jsx_runtime_1.jsx)(MetricTile, { ...metric }, `${metric.label}:${metric.value}`))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 rounded-2xl border border-border/70 bg-background/88 p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Support signals" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-3 flex flex-wrap gap-2", children: recommendation.reasonCodes.map((reasonCode) => ((0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/70 bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground/75", children: reasonCodeLabels[reasonCode] }, reasonCode))) }), recommendation.actionType === "investigation" ? ((0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-foreground/80", children: "These follow-ups stay explicit because the branch signal is not reliable enough to auto-commit to markdown, transfer, reorder, or shelf execution." })) : ((0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-foreground/80", children: "This card surfaces the specific move the manager should execute first, without re-running recommendation logic in the UI." }))] })] })] }));
}
