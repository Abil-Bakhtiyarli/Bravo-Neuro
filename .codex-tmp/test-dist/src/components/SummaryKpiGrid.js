"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SummaryKpiGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const iconByKey = {
    "possible-loss": lucide_react_1.AlertTriangle,
    "recoverable-value": lucide_react_1.BanknoteArrowDown,
    "net-saved-value": lucide_react_1.TrendingUp,
    "risky-products": lucide_react_1.PackageSearch,
    "tasks-today": lucide_react_1.CalendarClock,
};
const toneStyles = {
    warning: {
        badge: "border-amber-300/60 bg-amber-100/55 text-amber-800",
        icon: "bg-amber-100/60 text-amber-800",
    },
    success: {
        badge: "border-emerald-300/60 bg-emerald-100/55 text-emerald-800",
        icon: "bg-emerald-100/60 text-emerald-800",
    },
    neutral: {
        badge: "border-border/90 bg-muted/76 text-foreground/78",
        icon: "bg-muted/82 text-foreground/80",
    },
    info: {
        badge: "border-sky-300/60 bg-sky-100/55 text-sky-800",
        icon: "bg-sky-100/60 text-sky-800",
    },
};
function SummaryKpiGrid({ items }) {
    return ((0, jsx_runtime_1.jsx)("section", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: items.map((item) => {
            const Icon = iconByKey[item.key];
            const styles = toneStyles[item.accentTone];
            return ((0, jsx_runtime_1.jsxs)("article", { className: "demo-card animate-demo-fade-up p-5 transition-transform duration-200 hover:-translate-y-0.5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-foreground/80", children: item.label }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-3xl font-semibold tracking-tight text-foreground", children: item.displayValue })] }), (0, jsx_runtime_1.jsx)("span", { className: `demo-surface-panel p-2.5 ${styles.icon}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "size-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "line-clamp-2 text-sm text-muted-foreground", children: item.helperText }), (0, jsx_runtime_1.jsx)("span", { className: `inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${styles.badge}`, children: item.statusBadge })] })] }, item.key));
        }) }));
}
