"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodayDecisionCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const button_1 = require("./ui/button");
const actionTypeMeta = {
    discount: {
        icon: lucide_react_1.BadgePercent,
        label: "Dynamic discount",
        badge: "border-rose-200/90 bg-rose-50/90 text-rose-700",
    },
    transfer: {
        icon: lucide_react_1.ArrowRightLeft,
        label: "Stock transfer",
        badge: "border-violet-200/90 bg-violet-50/90 text-violet-700",
    },
    "reorder-adjustment": {
        icon: lucide_react_1.ChartColumnIncreasing,
        label: "Reorder adjustment",
        badge: "border-cyan-200/90 bg-cyan-50/90 text-cyan-700",
    },
    "shelf-action": {
        icon: lucide_react_1.Store,
        label: "Shelf action",
        badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
    },
    investigation: {
        icon: lucide_react_1.ScanSearch,
        label: "Investigation",
        badge: "border-slate-300/90 bg-slate-100/90 text-slate-700",
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
function TodayDecisionCard({ primaryTask, fallbackRiskRow, detail, onOpenProduct, }) {
    const productId = primaryTask?.productId ?? fallbackRiskRow?.productId ?? null;
    if (!productId) {
        return ((0, jsx_runtime_1.jsxs)("section", { className: "rounded-[2rem] border border-border/80 bg-card/92 p-5 shadow-[0_18px_54px_-42px_rgba(15,23,42,0.52)] sm:p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Today's AI decision" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-3 text-2xl font-semibold tracking-tight text-foreground", children: "No action needed" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: "This branch currently has no medium, high, or critical products requiring intervention." })] }));
    }
    const actionType = primaryTask?.actionType ?? fallbackRiskRow?.actionType ?? null;
    const actionMeta = actionType ? actionTypeMeta[actionType] : null;
    const ActionIcon = actionMeta?.icon ?? lucide_react_1.Store;
    const productName = primaryTask?.productName ?? fallbackRiskRow?.productName ?? detail?.product.name ?? "Selected product";
    const summary = primaryTask?.summary ?? fallbackRiskRow?.recommendationSummary ?? detail?.recommendation?.summary ?? "Review product detail";
    const riskLevel = primaryTask?.riskLevel ?? fallbackRiskRow?.riskLevel ?? detail?.risk.riskLevel ?? "medium";
    const netSavedValue = detail?.savings?.netSavedValueAzN ??
        primaryTask?.expectedNetSavedValueAzN ??
        fallbackRiskRow?.netSavedValueAzN ??
        0;
    return ((0, jsx_runtime_1.jsxs)("section", { className: "animate-demo-fade-up animate-demo-delay-1 rounded-3xl border border-emerald-300/70 bg-[linear-gradient(180deg,rgba(227,246,237,0.92),rgba(241,247,244,0.96))] p-5 shadow-[0_18px_36px_-28px_rgba(5,150,105,0.22)] sm:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800", children: "Today's AI decision" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-3 text-2xl font-semibold tracking-tight text-foreground", children: productName }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 max-w-2xl text-sm text-foreground/80", children: summary })] }), actionMeta ? ((0, jsx_runtime_1.jsxs)("span", { className: (0, utils_1.cn)("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]", actionMeta.badge), children: [(0, jsx_runtime_1.jsx)(ActionIcon, { className: "size-4" }), actionMeta.label] })) : null] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 grid gap-3 sm:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "demo-surface-panel p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Risk level" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-lg font-semibold capitalize text-foreground", children: riskLevel })] }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-surface-panel p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Expected net saved" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-lg font-semibold text-foreground", children: formatCurrency(netSavedValue) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-300/65 pt-5", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-foreground/70", children: "Open the full proof and confirm the next move." }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", onClick: () => onOpenProduct(productId), children: ["View product", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "size-4" })] })] })] }));
}
