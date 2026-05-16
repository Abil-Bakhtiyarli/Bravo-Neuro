"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SetupProgressChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const recharts_1 = require("recharts");
function SetupProgressChart({ data, }) {
    return ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: data, margin: { top: 8, right: 8, left: -24, bottom: 0 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { vertical: false, strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "label", tickLine: false, axisLine: false }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tickLine: false, axisLine: false, domain: [0, 100], width: 32 }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { cursor: { fill: "rgba(24, 24, 27, 0.05)" } }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "value", radius: [10, 10, 0, 0], fill: "var(--color-primary)" })] }) }));
}
