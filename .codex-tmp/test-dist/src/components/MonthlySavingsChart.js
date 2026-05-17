"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MonthlySavingsChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const recharts_1 = require("recharts");
function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "AZN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(value);
}
function MonthlySavingsChart({ branchName, series, }) {
    const [isChartReady, setIsChartReady] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const frameId = window.requestAnimationFrame(() => {
            setIsChartReady(true);
        });
        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);
    if (series.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("section", { className: "demo-card animate-demo-fade-up p-5", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Monthly savings trend" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-3 text-xl font-semibold tracking-tight text-foreground", children: "Monthly net saved value" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: "Monthly branch history is not available for this view yet." })] }));
    }
    const latestMonth = series[series.length - 1];
    const periodTotal = series.reduce((total, point) => total + point.netSavedValueAzN, 0);
    return ((0, jsx_runtime_1.jsxs)("section", { className: "demo-card animate-demo-fade-up p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Monthly savings trend" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-xl font-semibold tracking-tight text-foreground", children: "Monthly net saved value" })] }), (0, jsx_runtime_1.jsx)("span", { className: "demo-surface-chip px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: branchName })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm text-muted-foreground", children: "Extended recovery trend for the active branch with variable monthly performance." }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "demo-surface-panel px-3.5 py-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Latest month" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-base font-semibold text-foreground", children: [latestMonth.monthLabel, " ", formatCurrency(latestMonth.netSavedValueAzN)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-surface-panel px-3.5 py-3", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: [series.length, "-month total"] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-base font-semibold text-foreground", children: formatCurrency(periodTotal) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "demo-surface-panel mt-4 h-56 min-w-0 rounded-3xl bg-[linear-gradient(180deg,rgba(237,242,247,0.94),rgba(229,235,241,0.92))] p-3", children: isChartReady ? ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", minWidth: 0, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: series, margin: { top: 12, right: 8, left: -24, bottom: 0 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { vertical: false, strokeDasharray: "3 3", stroke: "rgba(148, 163, 184, 0.3)" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "monthLabel", tickLine: false, axisLine: false, tick: { fill: "rgba(71, 85, 105, 0.9)", fontSize: 12 }, minTickGap: 8, tickMargin: 8 }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { cursor: { fill: "rgba(15, 23, 42, 0.04)" }, formatter: (value) => [formatCurrency(Number(value ?? 0)), "Net saved"], labelFormatter: (label) => `Month: ${label}`, contentStyle: {
                                    borderRadius: "18px",
                                    border: "1px solid rgba(180, 192, 205, 0.9)",
                                    background: "rgba(239, 244, 248, 0.98)",
                                    boxShadow: "0 12px 28px -20px rgba(15,23,42,0.28)",
                                } }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "netSavedValueAzN", radius: [12, 12, 0, 0], fill: "var(--color-chart-1)", maxBarSize: 28 })] }) })) : ((0, jsx_runtime_1.jsx)("div", { "aria-hidden": "true", className: "h-full w-full rounded-[1.25rem] bg-slate-200/45" })) })] }));
}
