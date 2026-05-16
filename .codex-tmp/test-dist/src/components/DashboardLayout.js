"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
function DashboardLayout({ topBar, kpiStrip, mainStory, secondarySection, }) {
    const hasSecondarySection = secondarySection !== null && secondarySection !== undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex w-full flex-col gap-6", children: [(0, jsx_runtime_1.jsx)("section", { className: "rounded-3xl border border-border/80 bg-card/90 p-4 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:p-5", children: topBar }), (0, jsx_runtime_1.jsx)("section", { className: "min-w-0", children: kpiStrip }), hasSecondarySection ? ((0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(24rem,0.9fr)] xl:items-start", children: [(0, jsx_runtime_1.jsx)("section", { className: "min-w-0", children: mainStory }), (0, jsx_runtime_1.jsx)("aside", { className: "min-w-0", children: secondarySection })] })) : ((0, jsx_runtime_1.jsx)("section", { className: "min-w-0", children: mainStory }))] }));
}
