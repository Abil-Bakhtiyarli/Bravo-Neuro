"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KpiCards;
const jsx_runtime_1 = require("react/jsx-runtime");
const toneStyles = {
    warning: {
        badge: "border-amber-200/90 bg-amber-50/90 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
        icon: "bg-amber-50/80 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
        ring: "from-amber-200/70 via-amber-100/30 to-transparent",
    },
    success: {
        badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
        icon: "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
        ring: "from-emerald-200/70 via-emerald-100/30 to-transparent",
    },
    neutral: {
        badge: "border-border/80 bg-muted/80 text-foreground/75 dark:bg-muted/60 dark:text-foreground/80",
        icon: "bg-background/85 text-foreground/80 dark:bg-muted/60 dark:text-foreground/80",
        ring: "from-slate-200/65 via-slate-100/25 to-transparent",
    },
    info: {
        badge: "border-sky-200/90 bg-sky-50/90 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
        icon: "bg-sky-50/80 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200",
        ring: "from-sky-200/70 via-sky-100/30 to-transparent",
    },
};
function KpiCards({ items, orientation = "grid" }) {
    const isRail = orientation === "rail";
    return ((0, jsx_runtime_1.jsx)("div", { className: isRail ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-1" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: items.map((item) => {
            const Icon = item.icon;
            const tone = item.accentTone ?? "neutral";
            const styles = toneStyles[tone];
            return ((0, jsx_runtime_1.jsxs)("article", { className: "relative overflow-hidden rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)]", children: [(0, jsx_runtime_1.jsx)("div", { className: `pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${styles.ring}`, "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("div", { className: `relative flex flex-col ${isRail ? "min-h-[10.75rem]" : "min-h-[12.5rem]"}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Branch KPI" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-sm font-medium text-foreground/85", children: item.label })] }), (0, jsx_runtime_1.jsx)("div", { className: `rounded-2xl border border-border/80 p-2.5 shadow-sm ${styles.icon}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "size-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: `flex items-start justify-between gap-4 ${isRail ? "mt-5" : "mt-6"}`, children: [(0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-semibold tracking-tight text-foreground", children: item.displayValue }), (0, jsx_runtime_1.jsx)("span", { className: `inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles.badge}`, children: item.statusBadge })] }), (0, jsx_runtime_1.jsx)("p", { className: `text-sm leading-6 text-muted-foreground ${isRail ? "mt-3" : "mt-4"}`, children: item.helperText }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-auto pt-5", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-px bg-border/70" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground", children: "Synced with the current branch snapshot" })] })] })] }, item.key));
        }) }));
}
