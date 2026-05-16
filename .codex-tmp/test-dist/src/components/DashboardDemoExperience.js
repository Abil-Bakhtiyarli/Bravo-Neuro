"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardDemoExperience;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const riskTableInteraction_1 = require("@/lib/riskTableInteraction");
const utils_1 = require("@/lib/utils");
const DailyActionPlan_1 = __importDefault(require("./DailyActionPlan"));
const MonthlySavingsChart_1 = __importDefault(require("./MonthlySavingsChart"));
const ProductRiskDrawer_1 = __importDefault(require("./ProductRiskDrawer"));
const RiskTable_1 = __importDefault(require("./RiskTable"));
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
function buildUrl(pathname, searchParams) {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
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
        return `${days.toFixed(1)} day of cover`;
    }
    return `${days.toFixed(1)} days of cover`;
}
function SelectedProductPanel({ detail, onOpenDrawer, }) {
    if (!detail || !detail.recommendation || !detail.savings) {
        return ((0, jsx_runtime_1.jsxs)("section", { className: "demo-card p-5 sm:p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "demo-muted-label", children: "Selected product" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-3 demo-section-title", children: "Choose a product to review" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: "Pick a task or watchlist row to load the selected product story and open the full proof detail." })] }));
    }
    const actionMeta = actionTypeMeta[detail.recommendation.actionType];
    const ActionIcon = actionMeta.icon;
    return ((0, jsx_runtime_1.jsxs)("section", { className: "demo-card animate-demo-slide-in-right p-5 sm:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "demo-muted-label", children: "Selected product" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-3 demo-section-title", children: detail.product.name }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: "Review the current risk, the first action to take today, and the value still recoverable for this branch." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/75 bg-background/90 px-4 py-3 text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "demo-muted-label", children: "Risk score" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-3xl font-semibold tracking-tight text-foreground", children: detail.risk.roundedScore }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm font-medium capitalize text-foreground/75", children: detail.risk.riskLevel })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/75 bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: detail.branch.branchName }), (0, jsx_runtime_1.jsxs)("span", { className: (0, utils_1.cn)("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", actionMeta.badge), children: [(0, jsx_runtime_1.jsx)(ActionIcon, { className: "size-3.5" }), actionMeta.label] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 grid gap-3 sm:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/70 bg-background/88 p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "demo-muted-label", children: "Immediate risk" }), (0, jsx_runtime_1.jsxs)("ul", { className: "mt-3 space-y-2 text-sm leading-6 text-foreground/85", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CalendarClock, { className: "size-4 text-muted-foreground" }), formatDaysLabel(detail.daysUntilEarliestExpiry)] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Boxes, { className: "size-4 text-muted-foreground" }), detail.totalStock, " units on hand"] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "size-4 text-muted-foreground" }), formatCoverage(detail.daysOfStockRemaining)] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/70 bg-background/88 p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "demo-muted-label", children: "Expected impact" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground", children: "Possible waste" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-lg font-semibold text-foreground", children: formatCurrency(detail.savings.possibleLossAzN) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground", children: "Net saved" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-lg font-semibold text-foreground", children: formatCurrency(detail.savings.netSavedValueAzN) })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 rounded-2xl border border-border/70 bg-card/90 p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "demo-muted-label", children: "Recommended action" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-base font-semibold text-foreground", children: detail.recommendation.summary }), detail.explanation ? ((0, jsx_runtime_1.jsx)("ul", { className: "mt-4 space-y-2 text-sm leading-6 text-foreground/80", children: detail.explanation.driverHighlights.slice(0, 3).map((highlight) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "mt-1 size-4 shrink-0 text-muted-foreground" }), (0, jsx_runtime_1.jsx)("span", { children: highlight })] }, highlight))) })) : null] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Open the full product detail for methodology, savings detail, and recommendation proof." }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", onClick: onOpenDrawer, children: ["Open product detail", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "size-4" })] })] })] }));
}
function DashboardDemoExperience({ branchId, branchName, tasks, rows, productDetailsById, monthlySavingsSeries, initialRequestedProductId = null, initialQuery = "", initialRiskFilter = "all", staticMode = false, }) {
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const [drawerProductId, setDrawerProductId] = (0, react_1.useState)(null);
    const query = searchParams?.get("q") ?? initialQuery;
    const requestedRiskFilter = searchParams?.get("risk");
    const riskFilter = requestedRiskFilter
        ? (0, riskTableInteraction_1.parseRiskTableFilterValue)(requestedRiskFilter)
        : initialRiskFilter;
    const requestedProductId = searchParams?.get("product") ?? initialRequestedProductId;
    const filteredRows = (0, react_1.useMemo)(() => (0, riskTableInteraction_1.filterRiskTableRows)(rows, query, riskFilter), [query, riskFilter, rows]);
    const selectedProductId = (0, react_1.useMemo)(() => (0, riskTableInteraction_1.getVisibleSelectedProductId)(filteredRows, requestedProductId), [filteredRows, requestedProductId]);
    const selectedDetail = selectedProductId ? (productDetailsById[selectedProductId] ?? null) : null;
    (0, react_1.useEffect)(() => {
        if (requestedProductId === selectedProductId) {
            return;
        }
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            product: selectedProductId,
        });
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }, [pathname, requestedProductId, searchParams, selectedProductId]);
    function handleSelectProduct(productId) {
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            product: productId,
        });
        window.history.pushState(null, "", buildUrl(pathname, nextParams));
    }
    function handleSearchChange(nextQuery) {
        const nextFilteredRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, nextQuery, riskFilter);
        const nextSelectedProductId = (0, riskTableInteraction_1.getVisibleSelectedProductId)(nextFilteredRows, requestedProductId);
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            q: nextQuery,
            product: nextSelectedProductId,
        });
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }
    function handleRiskFilterChange(nextRiskFilter) {
        const nextFilteredRows = (0, riskTableInteraction_1.filterRiskTableRows)(rows, query, nextRiskFilter);
        const nextSelectedProductId = (0, riskTableInteraction_1.getVisibleSelectedProductId)(nextFilteredRows, requestedProductId);
        const nextParams = (0, riskTableInteraction_1.updateRiskTableSearchParams)(new URLSearchParams(searchParams?.toString() ?? ""), {
            risk: nextRiskFilter,
            product: nextSelectedProductId,
        });
        window.history.replaceState(null, "", buildUrl(pathname, nextParams));
    }
    function handleDrawerOpenChange(open) {
        setDrawerProductId(open ? selectedProductId : null);
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(24rem,0.9fr)] xl:items-start", children: [(0, jsx_runtime_1.jsx)(DailyActionPlan_1.default, { branchId: branchId, tasks: tasks, selectedProductId: selectedProductId, onSelectTask: handleSelectProduct, staticMode: staticMode }), (0, jsx_runtime_1.jsx)("div", { className: "min-w-0 xl:sticky xl:top-8", children: (0, jsx_runtime_1.jsx)(SelectedProductPanel, { detail: selectedDetail, onOpenDrawer: () => setDrawerProductId(selectedProductId) }) })] }), (0, jsx_runtime_1.jsx)(RiskTable_1.default, { rows: filteredRows, searchValue: query, riskFilter: riskFilter, selectedProductId: selectedProductId, onSearchChange: handleSearchChange, onRiskFilterChange: handleRiskFilterChange, onSelectProduct: handleSelectProduct }), (0, jsx_runtime_1.jsx)(MonthlySavingsChart_1.default, { branchName: branchName, series: monthlySavingsSeries }), (0, jsx_runtime_1.jsx)(ProductRiskDrawer_1.default, { detail: selectedDetail, open: drawerProductId === selectedProductId && selectedDetail !== null, onOpenChange: handleDrawerOpenChange })] }));
}
