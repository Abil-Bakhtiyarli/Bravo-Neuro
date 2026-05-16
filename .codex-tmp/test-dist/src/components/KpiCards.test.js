"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const lucide_react_1 = require("lucide-react");
const server_1 = require("react-dom/server");
const KpiCards_1 = __importDefault(require("./KpiCards"));
const items = [
    {
        key: "possible-loss",
        label: "Possible waste",
        displayValue: "AZN 12.0",
        helperText: "Exposure helper text.",
        statusBadge: "Exposure",
        icon: lucide_react_1.AlertTriangle,
        accentTone: "warning",
    },
    {
        key: "net-saved-value",
        label: "Net saved value",
        displayValue: "AZN 8.4",
        helperText: "Net helper text.",
        statusBadge: "Net gain",
        icon: lucide_react_1.TrendingUp,
        accentTone: "success",
    },
];
(0, node_test_1.default)("KpiCards renders the default grid presentation", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(KpiCards_1.default, { items: items }));
    strict_1.default.match(markup, /xl:grid-cols-4/);
    strict_1.default.match(markup, /Possible waste/);
    strict_1.default.match(markup, /Net saved value/);
    strict_1.default.match(markup, /Synced with the current branch snapshot/);
});
(0, node_test_1.default)("KpiCards supports a vertical rail presentation", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(KpiCards_1.default, { items: items, orientation: "rail" }));
    strict_1.default.match(markup, /xl:grid-cols-1/);
    strict_1.default.match(markup, /min-h-\[10\.75rem\]/);
    strict_1.default.doesNotMatch(markup, /xl:grid-cols-4/);
});
