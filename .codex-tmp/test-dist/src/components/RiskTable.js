"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RiskTable;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const riskTableInteraction_1 = require("@/lib/riskTableInteraction");
const utils_1 = require("@/lib/utils");
const riskLevelStyles = {
    critical: {
        badge: "border-rose-200/90 bg-rose-50/95 text-rose-700",
        rail: "bg-rose-500",
        label: "Critical",
    },
    high: {
        badge: "border-amber-200/90 bg-amber-50/95 text-amber-700",
        rail: "bg-amber-500",
        label: "High",
    },
    medium: {
        badge: "border-sky-200/90 bg-sky-50/95 text-sky-700",
        rail: "bg-sky-500",
        label: "Medium",
    },
    low: {
        badge: "border-emerald-200/90 bg-emerald-50/95 text-emerald-700",
        rail: "bg-emerald-500",
        label: "Low",
    },
};
const actionStyles = {
    discount: {
        badge: "border-rose-200/90 bg-rose-50/90 text-rose-700",
        label: "Dynamic discount",
    },
    transfer: {
        badge: "border-violet-200/90 bg-violet-50/90 text-violet-700",
        label: "Stock transfer",
    },
    "reorder-adjustment": {
        badge: "border-cyan-200/90 bg-cyan-50/90 text-cyan-700",
        label: "Reorder adjustment",
    },
    "shelf-action": {
        badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
        label: "Shelf action",
    },
    investigation: {
        badge: "border-slate-300/90 bg-slate-100/90 text-slate-700",
        label: "Investigation",
    },
};
function formatExpiry(daysUntilExpiry) {
    if (daysUntilExpiry <= 0) {
        return "Expires today";
    }
    if (daysUntilExpiry === 1) {
        return "1 day left";
    }
    return `${daysUntilExpiry} days left`;
}
function formatStock(totalStock) {
    return `${totalStock} units`;
}
function formatCoverage(daysOfStockRemaining) {
    if (daysOfStockRemaining === null) {
        return "Coverage unavailable";
    }
    if (daysOfStockRemaining <= 1) {
        return `${daysOfStockRemaining.toFixed(1)} day of cover`;
    }
    return `${daysOfStockRemaining.toFixed(1)} days of cover`;
}
function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "AZN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
function getExpiryTone(daysUntilExpiry) {
    if (daysUntilExpiry <= 1) {
        return "text-rose-700";
    }
    if (daysUntilExpiry <= 3) {
        return "text-amber-700";
    }
    return "text-foreground/80";
}
function RiskTable({ rows, searchValue, riskFilter, selectedProductId, onSearchChange, onRiskFilterChange, onSelectProduct, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-border/80 bg-card/92 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.55)]", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-5 border-b border-border/80 px-5 py-5 sm:px-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-accent/75 px-2.5 py-1", children: "Risk watchlist" }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-dashed border-border/80 px-2.5 py-1", children: "Branch risk queue" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Product risk table" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-2xl font-semibold tracking-tight text-foreground", children: "Products needing attention" })] }), (0, jsx_runtime_1.jsx)("p", { className: "max-w-3xl text-sm leading-6 text-muted-foreground", children: "Review the selected branch's products in priority order, then open the drawer to confirm the risk story and action economics." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-3 sm:grid-cols-3 lg:min-w-[34rem]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/75 bg-background/80 p-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Search" }), (0, jsx_runtime_1.jsxs)("label", { className: "mt-2 flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm text-muted-foreground focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/10", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "size-4" }), (0, jsx_runtime_1.jsx)("input", { "aria-label": "Search product or category", className: "w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground", placeholder: "Search product or category", value: searchValue, onChange: (event) => onSearchChange(event.target.value) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/75 bg-background/80 p-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Rows in view" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm text-foreground/80", children: [(0, jsx_runtime_1.jsxs)("span", { children: [rows.length, " products"] }), (0, jsx_runtime_1.jsx)(lucide_react_1.SlidersHorizontal, { className: "size-4 text-muted-foreground" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/75 bg-background/80 p-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Risk level" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm text-foreground/80", children: [(0, jsx_runtime_1.jsxs)("select", { "aria-label": "Filter by risk level", className: "w-full bg-transparent outline-none", value: riskFilter, onChange: (event) => onRiskFilterChange(event.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All active risk rows" }), (0, jsx_runtime_1.jsx)("option", { value: "critical", children: "Critical only" }), (0, jsx_runtime_1.jsx)("option", { value: "high", children: "High only" }), (0, jsx_runtime_1.jsx)("option", { value: "medium", children: "Medium only" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.SlidersHorizontal, { className: "size-4 text-muted-foreground" })] })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "overflow-x-auto px-3 pb-3 sm:px-4 sm:pb-4", children: [(0, jsx_runtime_1.jsxs)("table", { className: "min-w-[64rem] border-separate border-spacing-y-3 text-left", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("th", { className: "px-3 pt-3 pb-1", children: "Product" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 pt-3 pb-1", children: "Category" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 pt-3 pb-1", children: "Stock" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 pt-3 pb-1", children: "Expiry" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 pt-3 pb-1", children: "Risk" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 pt-3 pb-1", children: "Recommended action" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: rows.map((row) => {
                                    const risk = riskLevelStyles[row.riskLevel];
                                    const action = actionStyles[row.actionType];
                                    const isSelected = row.productId === selectedProductId;
                                    return ((0, jsx_runtime_1.jsxs)("tr", { tabIndex: 0, "aria-selected": isSelected, "data-selected": isSelected ? "true" : "false", className: (0, utils_1.cn)("group cursor-pointer outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5", isSelected && "translate-y-[-1px]"), onClick: () => onSelectProduct(row.productId), onKeyDown: (event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                onSelectProduct(row.productId);
                                            }
                                        }, children: [(0, jsx_runtime_1.jsxs)("td", { className: (0, utils_1.cn)("relative overflow-hidden rounded-l-2xl border-y border-l px-3 py-4 align-middle shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200", isSelected
                                                    ? "border-foreground/30 bg-accent/80"
                                                    : "border-border/75 bg-background/85 group-hover:bg-background"), children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("absolute inset-y-3 left-0 w-1 rounded-full", risk.rail), "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-[14rem] pl-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-foreground", children: row.productName }), isSelected ? ((0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-foreground/20 bg-background/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: "Selected for detail" })) : null] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm text-muted-foreground", children: ["Score ", row.riskScore, " | possible waste ", formatCurrency(row.possibleLossAzN)] })] })] }), (0, jsx_runtime_1.jsx)("td", { className: (0, utils_1.cn)("border-y px-3 py-4 text-sm text-foreground/80 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200", isSelected
                                                    ? "border-foreground/30 bg-accent/80"
                                                    : "border-border/75 bg-background/85 group-hover:bg-background"), children: riskTableInteraction_1.categoryLabels[row.category] }), (0, jsx_runtime_1.jsx)("td", { className: (0, utils_1.cn)("border-y px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200", isSelected
                                                    ? "border-foreground/30 bg-accent/80"
                                                    : "border-border/75 bg-background/85 group-hover:bg-background"), children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-foreground", children: formatStock(row.totalStock) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: formatCoverage(row.daysOfStockRemaining) })] }) }), (0, jsx_runtime_1.jsx)("td", { className: (0, utils_1.cn)("border-y px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200", isSelected
                                                    ? "border-foreground/30 bg-accent/80"
                                                    : "border-border/75 bg-background/85 group-hover:bg-background"), children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { className: (0, utils_1.cn)("text-sm font-medium", getExpiryTone(row.daysUntilExpiry)), children: formatExpiry(row.daysUntilExpiry) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Intervention window before the next expiry check" })] }) }), (0, jsx_runtime_1.jsx)("td", { className: (0, utils_1.cn)("border-y px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200", isSelected
                                                    ? "border-foreground/30 bg-accent/80"
                                                    : "border-border/75 bg-background/85 group-hover:bg-background"), children: (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]", risk.badge), children: risk.label }) }), (0, jsx_runtime_1.jsx)("td", { className: (0, utils_1.cn)("rounded-r-2xl border-y border-r px-3 py-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.8)] transition-colors duration-200", isSelected
                                                    ? "border-foreground/30 bg-accent/80"
                                                    : "border-border/75 bg-background/85 group-hover:bg-background"), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex min-w-[16rem] flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", action.badge), children: action.label }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground", children: "Estimated outcome" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-6 text-foreground/80", children: row.recommendationSummary }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-medium text-muted-foreground", children: ["Estimated net saved ", formatCurrency(row.netSavedValueAzN)] })] }) })] }, `${row.branchId}:${row.productId}`));
                                }) })] }), rows.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-10 text-center text-sm text-muted-foreground", children: "No products match the current search and risk filter. Clear the search text or widen the risk level to rebuild the queue." })) : null] })] }));
}
