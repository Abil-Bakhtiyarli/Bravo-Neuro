"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TransfersOverview;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const urgencyBadgeStyles = {
    critical: "border-rose-300/65 bg-rose-100/60 text-rose-900",
    watch: "border-amber-300/65 bg-amber-100/60 text-amber-900",
    planned: "border-sky-300/65 bg-sky-100/60 text-sky-900",
};
function formatCurrency(value) {
    return `AZN ${value.toFixed(1)}`;
}
function formatCoverage(value) {
    if (value === null) {
        return "No run rate";
    }
    return `${value.toFixed(1)} days`;
}
function TransfersOverview({ data }) {
    const summaryCards = [
        {
            label: "Active lanes",
            value: String(data.activeTransferCount),
            helperText: "Current branch handoffs that can protect margin before expiry.",
            icon: lucide_react_1.Package2,
            tone: "text-sky-900 bg-sky-100/60",
        },
        {
            label: "Value protected",
            value: formatCurrency(data.valueProtectedAzN),
            helperText: "Estimated full-price value that stays sellable if these lanes move on time.",
            icon: lucide_react_1.ShieldCheck,
            tone: "text-emerald-900 bg-emerald-100/60",
        },
        {
            label: "Units to move",
            value: String(data.unitsToMove),
            helperText: "Total cartons or selling units flagged for near-term branch balancing.",
            icon: lucide_react_1.ArrowUpRight,
            tone: "text-foreground/80 bg-muted/82",
        },
        {
            label: "Urgent today",
            value: String(data.urgentTransferCount),
            helperText: "Lanes that should move in the next dispatch window to avoid markdown pressure.",
            icon: lucide_react_1.Clock3,
            tone: "text-rose-900 bg-rose-100/60",
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsx)("section", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: summaryCards.map((card) => {
                    const Icon = card.icon;
                    return ((0, jsx_runtime_1.jsxs)("article", { className: "demo-card animate-demo-fade-up p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-foreground/80", children: card.label }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-3xl font-semibold tracking-tight text-foreground", children: card.value })] }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("demo-surface-panel p-2.5", card.tone), children: (0, jsx_runtime_1.jsx)(Icon, { className: "size-4" }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-sm leading-6 text-muted-foreground", children: card.helperText })] }, card.label));
                }) }), (0, jsx_runtime_1.jsxs)("section", { className: "demo-card animate-demo-fade-up animate-demo-delay-2 p-5 sm:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Transfers" }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-2 text-xl font-semibold tracking-tight text-foreground", children: "Inter-branch transfer recommendations" })] }), (0, jsx_runtime_1.jsx)("span", { className: "demo-surface-chip px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: data.branchName })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: "These lanes are fake for the hackathon build, but each one is grounded in the current branch demand and shelf-life pattern." }), (0, jsx_runtime_1.jsx)("div", { className: "mt-5 space-y-3", children: data.lanes.map((lane) => {
                            const DirectionIcon = lane.direction === "outbound" ? lucide_react_1.ArrowUpRight : lucide_react_1.ArrowDownLeft;
                            return ((0, jsx_runtime_1.jsxs)("article", { className: "demo-surface-interactive demo-surface-interactive-hover rounded-2xl border p-4 transition-[background-color,border-color,box-shadow,transform] duration-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "demo-surface-panel p-2 text-foreground/80", children: (0, jsx_runtime_1.jsx)(DirectionIcon, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-foreground", children: lane.productName }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/75 bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: lane.direction === "outbound" ? "Outbound" : "Inbound" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: [lane.direction === "outbound" ? "To" : "From", " ", lane.counterpartBranchName, " | ", lane.summary] })] }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", urgencyBadgeStyles[lane.urgency]), children: lane.urgency })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2 xl:grid-cols-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Quantity" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm font-semibold text-foreground", children: [lane.quantityUnits, " units"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Value protected" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm font-semibold text-foreground", children: formatCurrency(lane.expectedValueProtectedAzN) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Sell-through gap" }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-sm font-semibold text-foreground", children: [lane.speedMultiplier.toFixed(2), "x"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Stock cover" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm font-semibold text-foreground", children: formatCoverage(lane.stockCoverageDays) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Next window" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm font-semibold text-foreground", children: lane.transferWindowLabel }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-xs text-muted-foreground", children: lane.statusLabel })] })] })] }, lane.transferId));
                        }) })] })] }));
}
