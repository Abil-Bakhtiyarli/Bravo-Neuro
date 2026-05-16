"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RevenueForecastChart;
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
function RevenueForecastChart({ branchName, points, }) {
    const [isChartReady, setIsChartReady] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const frameId = window.requestAnimationFrame(() => {
            setIsChartReady(true);
        });
        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("section", { className: "demo-card animate-demo-fade-up animate-demo-delay-2 p-5 sm:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Revenue view" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-xl font-semibold tracking-tight text-foreground", children: "Four-week branch forecast" })] }), (0, jsx_runtime_1.jsx)("span", { className: "demo-surface-chip px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: branchName })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: "Projected weekly revenue is anchored to the current branch run rate and adjusted with conservative demand assumptions." }), (0, jsx_runtime_1.jsx)("div", { className: "demo-surface-panel mt-5 h-72 min-w-0 rounded-3xl bg-[linear-gradient(180deg,rgba(237,242,247,0.94),rgba(229,235,241,0.92))] p-3", children: isChartReady ? ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", minWidth: 0, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: points, margin: { top: 12, right: 12, left: 0, bottom: 0 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { vertical: false, strokeDasharray: "3 3", stroke: "rgba(148, 163, 184, 0.3)" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "weekLabel", tickLine: false, axisLine: false, tick: { fill: "rgba(71, 85, 105, 0.9)", fontSize: 12 } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tickLine: false, axisLine: false, width: 72, tick: { fill: "rgba(71, 85, 105, 0.9)", fontSize: 12 }, tickFormatter: (value) => `AZN ${Number(value).toFixed(0)}` }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { cursor: { fill: "rgba(15, 23, 42, 0.04)" }, formatter: (value, name) => [
                                    formatCurrency(Number(value ?? 0)),
                                    name === "projectedRevenueAzN" ? "Projected" : "Baseline",
                                ], labelFormatter: (label) => `Period: ${label}`, contentStyle: {
                                    borderRadius: "18px",
                                    border: "1px solid rgba(180, 192, 205, 0.9)",
                                    background: "rgba(239, 244, 248, 0.98)",
                                    boxShadow: "0 12px 28px -20px rgba(15,23,42,0.28)",
                                } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "projectedRevenueAzN", name: "Projected", radius: [12, 12, 0, 0], fill: "var(--color-chart-1)", maxBarSize: 34 }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "baselineRevenueAzN", name: "Baseline", stroke: "var(--color-chart-3)", strokeWidth: 2.5, dot: { r: 3 } })] }) })) : ((0, jsx_runtime_1.jsx)("div", { "aria-hidden": "true", className: "h-full w-full rounded-[1.25rem] bg-slate-200/45" })) })] }));
}
