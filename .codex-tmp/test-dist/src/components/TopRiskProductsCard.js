"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopRiskProductsCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const riskBadgeStyles = {
    critical: "border-rose-300/80 bg-rose-100 text-rose-800",
    high: "border-amber-300/80 bg-amber-100 text-amber-800",
    medium: "border-sky-300/80 bg-sky-100 text-sky-800",
    low: "border-emerald-300/80 bg-emerald-100 text-emerald-800",
};
const actionLabels = {
    discount: "Discount",
    transfer: "Transfer",
    "reorder-adjustment": "Reorder",
    "shelf-action": "Shelf action",
    investigation: "Investigate",
};
function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "AZN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
function getNetSavedValue(detail, fallbackValue) {
    return detail?.savings?.netSavedValueAzN ?? fallbackValue;
}
function TopRiskProductsCard({ rows, productDetailsById, selectedProductId, onOpenProduct, }) {
    const topRows = rows.slice(0, 5);
    return ((0, jsx_runtime_1.jsxs)("section", { className: "animate-demo-fade-up animate-demo-delay-2 rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)] sm:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Top risk products" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-xl font-semibold tracking-tight text-foreground", children: "Highest-priority review queue" })] }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: "Top 5" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 space-y-3", children: [topRows.map((row) => {
                        const detail = productDetailsById[row.productId];
                        const isSelected = selectedProductId === row.productId;
                        return ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => onOpenProduct(row.productId), className: (0, utils_1.cn)("flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200", isSelected
                                ? "border-emerald-300/80 bg-emerald-50/70 shadow-[0_18px_45px_-38px_rgba(5,150,105,0.5)]"
                                : "border-border/75 bg-background/88 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-background hover:shadow-[0_16px_36px_-30px_rgba(15,23,42,0.38)]"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-foreground", children: row.productName }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", riskBadgeStyles[row.riskLevel]), children: row.riskLevel })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { children: actionLabels[row.actionType] }), (0, jsx_runtime_1.jsx)("span", { children: formatCurrency(getNetSavedValue(detail, row.netSavedValueAzN)) })] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "size-4 shrink-0 text-muted-foreground" })] }, row.productId));
                    }), topRows.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "rounded-2xl border border-border/75 bg-background/88 p-4 text-sm leading-6 text-muted-foreground", children: "No risky products are currently queued for this branch." })) : null] })] }));
}
