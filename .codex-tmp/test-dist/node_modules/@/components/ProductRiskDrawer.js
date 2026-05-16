"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRiskDrawerContent = ProductRiskDrawerContent;
exports.default = ProductRiskDrawer;
const jsx_runtime_1 = require("react/jsx-runtime");
const dialog_1 = require("@base-ui/react/dialog");
const lucide_react_1 = require("lucide-react");
const riskTableInteraction_1 = require("@/lib/riskTableInteraction");
const utils_1 = require("@/lib/utils");
const RecommendationCard_1 = __importDefault(require("./RecommendationCard"));
const SavingsCard_1 = __importDefault(require("./SavingsCard"));
const button_1 = require("./ui/button");
const riskLevelStyles = {
    critical: {
        badge: "border-rose-300/80 bg-rose-100 text-rose-800",
        accent: "bg-rose-500",
        panel: "from-rose-100/95 via-white to-rose-50/80",
        label: "Critical",
    },
    high: {
        badge: "border-amber-300/80 bg-amber-100 text-amber-800",
        accent: "bg-amber-500",
        panel: "from-amber-100/95 via-white to-amber-50/80",
        label: "High",
    },
    medium: {
        badge: "border-sky-300/80 bg-sky-100 text-sky-800",
        accent: "bg-sky-500",
        panel: "from-sky-100/95 via-white to-sky-50/80",
        label: "Medium",
    },
    low: {
        badge: "border-emerald-300/80 bg-emerald-100 text-emerald-800",
        accent: "bg-emerald-500",
        panel: "from-emerald-100/95 via-white to-emerald-50/80",
        label: "Low",
    },
};
function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "AZN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
function formatDaysLabel(days) {
    if (days <= 0) {
        return "Expires today";
    }
    if (days === 1) {
        return "1 day left";
    }
    return `${days} days left`;
}
function formatCoverage(days) {
    if (days === null) {
        return "Coverage unavailable";
    }
    if (days <= 1) {
        return `${days.toFixed(1)} day`;
    }
    return `${days.toFixed(1)} days`;
}
function formatDriverContribution(driver) {
    return `+${driver.weightedContribution.toFixed(1)} weighted points`;
}
function SnapshotCard({ icon: Icon, label, value, helper, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/70 bg-background/88 p-3.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: label }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-base font-semibold text-foreground", children: value })] }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/70 bg-card/90 p-2 text-muted-foreground", children: (0, jsx_runtime_1.jsx)(Icon, { className: "size-4" }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-xs leading-5 text-muted-foreground", children: helper })] }));
}
function ProductRiskDrawerContent({ detail, withinDialog = true, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-[min(100%,56rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.985),rgba(248,250,252,0.98))] shadow-[0_38px_110px_-42px_rgba(15,23,42,0.85)]", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("border-b border-border/80 bg-gradient-to-br px-5 py-5 sm:px-6 lg:px-7", riskLevelStyles[detail.risk.riskLevel].panel), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-background/85 px-2.5 py-1", children: "Product detail" }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-background/85 px-2.5 py-1", children: detail.branch.branchName }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-background/85 px-2.5 py-1", children: riskTableInteraction_1.categoryLabels[detail.product.category] })] }), withinDialog ? ((0, jsx_runtime_1.jsx)(dialog_1.Dialog.Title, { className: "mt-4 text-3xl font-semibold tracking-tight text-foreground", children: detail.product.name })) : ((0, jsx_runtime_1.jsx)("h2", { className: "mt-4 text-3xl font-semibold tracking-tight text-foreground", children: detail.product.name })), withinDialog ? ((0, jsx_runtime_1.jsx)(dialog_1.Dialog.Description, { className: "mt-3 max-w-3xl text-sm leading-6 text-foreground/78", children: "Review why this item is exposed, which action the branch should take first, and how much value is still recoverable from the current situation." })) : ((0, jsx_runtime_1.jsx)("p", { className: "mt-3 max-w-3xl text-sm leading-6 text-foreground/78", children: "Review why this item is exposed, which action the branch should take first, and how much value is still recoverable from the current situation." }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/75 bg-background/88 px-4 py-3 text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Risk score" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-2xl font-semibold text-foreground", children: detail.risk.roundedScore }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", riskLevelStyles[detail.risk.riskLevel].badge), children: riskLevelStyles[detail.risk.riskLevel].label })] }), withinDialog ? ((0, jsx_runtime_1.jsx)(dialog_1.Dialog.Close, { render: (0, jsx_runtime_1.jsx)(button_1.Button, { "aria-label": "Close product detail modal", size: "icon-sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "size-4" }) }) })) : ((0, jsx_runtime_1.jsx)(button_1.Button, { "aria-label": "Close product detail modal", size: "icon-sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "size-4" }) }))] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto px-5 py-5 sm:px-6 lg:px-7 lg:py-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)] xl:items-start", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BadgePercent, { className: "size-4" }), "Top drivers"] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 space-y-3", children: detail.risk.mainDrivers.map((driver) => ((0, jsx_runtime_1.jsx)("div", { className: "rounded-2xl border border-border/70 bg-background/88 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-foreground", children: driver.label }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-muted-foreground", children: ["Weight ", (driver.weight * 100).toFixed(0), "% | raw score ", driver.rawScore] })] }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/75 bg-card/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75", children: formatDriverContribution(driver) })] }) }, driver.key))) })] }), detail.explanation ? ((0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRightLeft, { className: "size-4" }), "Explanation"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 rounded-3xl border border-border/75 bg-card/90 p-5", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-6 text-foreground/85", children: detail.explanation.summary }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 space-y-2", children: detail.explanation.driverHighlights.map((highlight) => ((0, jsx_runtime_1.jsx)("div", { className: "rounded-2xl border border-border/70 bg-background/88 px-3.5 py-3 text-sm leading-6 text-foreground/80", children: highlight }, highlight))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 rounded-2xl border border-border/70 bg-background/88 p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Recommendation rationale" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm leading-6 text-foreground/80", children: detail.explanation.recommendationRationale })] })] })] })) : null, (0, jsx_runtime_1.jsx)("section", { children: (0, jsx_runtime_1.jsx)(SavingsCard_1.default, { recommendation: detail.recommendation, savings: detail.savings, unitPriceAzN: detail.product.unitPrice }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("h-2.5 w-2.5 rounded-full", riskLevelStyles[detail.risk.riskLevel].accent) }), "Operational snapshot"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(SnapshotCard, { icon: lucide_react_1.Package, label: "Total stock", value: `${detail.totalStock} units`, helper: `Current on-hand stock across ${detail.lotCount} lot${detail.lotCount === 1 ? "" : "s"}.` }), (0, jsx_runtime_1.jsx)(SnapshotCard, { icon: lucide_react_1.CalendarClock, label: "Earliest expiry", value: formatDaysLabel(detail.daysUntilEarliestExpiry), helper: detail.earliestExpiryDate }), (0, jsx_runtime_1.jsx)(SnapshotCard, { icon: lucide_react_1.Boxes, label: "Stock cover", value: formatCoverage(detail.daysOfStockRemaining), helper: "Expected branch coverage at current daily sales." }), (0, jsx_runtime_1.jsx)(SnapshotCard, { icon: lucide_react_1.Warehouse, label: "Stock value", value: formatCurrency(detail.stockValueAzN), helper: "Retail value currently exposed on shelf and in backroom." }), (0, jsx_runtime_1.jsx)(SnapshotCard, { icon: lucide_react_1.AlertTriangle, label: "Main driver count", value: `${detail.risk.mainDrivers.length}`, helper: "Non-zero drivers feeding the current risk score." }), (0, jsx_runtime_1.jsx)(SnapshotCard, { icon: lucide_react_1.Sparkles, label: "Latest expiry", value: detail.latestExpiryDate, helper: "Longest-dated lot still in the current branch inventory." })] })] }), (0, jsx_runtime_1.jsx)("section", { children: (0, jsx_runtime_1.jsx)(RecommendationCard_1.default, { recommendation: detail.recommendation }) })] })] }) })] }));
}
function ProductRiskDrawer({ detail, open, onOpenChange, }) {
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog.Root, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(dialog_1.Dialog.Portal, { children: [(0, jsx_runtime_1.jsx)(dialog_1.Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-slate-950/52 backdrop-blur-[4px]" }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog.Popup, { className: "fixed inset-0 z-50 flex items-center justify-center p-3 outline-none sm:p-6 xl:p-8", children: detail ? (0, jsx_runtime_1.jsx)(ProductRiskDrawerContent, { detail: detail }) : null })] }) }));
}
