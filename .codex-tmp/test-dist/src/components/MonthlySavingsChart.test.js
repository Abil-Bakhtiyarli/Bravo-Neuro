"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const server_1 = require("react-dom/server");
const MonthlySavingsChart_1 = __importDefault(require("./MonthlySavingsChart"));
const series = [
    {
        branchId: "ganjlik",
        monthKey: "2026-04",
        monthLabel: "Apr",
        netSavedValueAzN: 44.8,
        recoveredValueAzN: 52.2,
        possibleLossAzN: 224.3,
        taskCount: 4,
    },
    {
        branchId: "ganjlik",
        monthKey: "2026-05",
        monthLabel: "May",
        netSavedValueAzN: 46.2,
        recoveredValueAzN: 53.9,
        possibleLossAzN: 239.8,
        taskCount: 4,
    },
];
(0, node_test_1.default)("MonthlySavingsChart renders title and latest branch summary", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(MonthlySavingsChart_1.default, { branchName: "Bravo Ganjlik", series: series }));
    strict_1.default.match(markup, /Monthly net saved value/);
    strict_1.default.match(markup, /Bravo Ganjlik/);
    strict_1.default.match(markup, /2-month total/);
});
(0, node_test_1.default)("MonthlySavingsChart renders an explicit empty state", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(MonthlySavingsChart_1.default, { branchName: "Bravo Ganjlik", series: [] }));
    strict_1.default.match(markup, /Monthly net saved value/);
    strict_1.default.match(markup, /history is not available/i);
});
