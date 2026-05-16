"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompactDashboardHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
function formatDemoDate(generatedAt) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(generatedAt));
}
function CompactDashboardHeaderPanel({ branches, selectedBranchId, generatedAt, onBranchChange, }) {
    return ((0, jsx_runtime_1.jsx)("section", { className: "demo-card animate-demo-fade-up p-5 sm:p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Dashboard" }), (0, jsx_runtime_1.jsx)("h1", { className: "mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]", children: "Branch overview" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("span", { className: "demo-surface-chip inline-flex items-center gap-2 px-3 py-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Store, { className: "size-4" }), branches.find((branch) => branch.branchId === selectedBranchId)?.branchName ?? branches[0]?.branchName] }), (0, jsx_runtime_1.jsxs)("span", { className: "demo-surface-chip inline-flex items-center gap-2 px-3 py-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CalendarClock, { className: "size-4" }), formatDemoDate(generatedAt)] }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-emerald-50/65 px-3 py-1.5 text-emerald-900", children: "AI risk scan completed" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end", children: [(0, jsx_runtime_1.jsxs)("label", { className: "min-w-[14rem] text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: ["Branch", (0, jsx_runtime_1.jsxs)("div", { className: "relative mt-2", children: [(0, jsx_runtime_1.jsx)("select", { className: "demo-surface-panel w-full appearance-none px-4 py-3 pr-10 text-sm font-medium tracking-normal text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10", value: selectedBranchId, onChange: (event) => onBranchChange(event.target.value), children: branches.map((branch) => ((0, jsx_runtime_1.jsx)("option", { value: branch.branchId, children: branch.branchName }, branch.branchId))) }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 rounded-2xl border border-emerald-300/70 bg-emerald-50/65 px-4 py-3 text-sm font-medium text-emerald-900", children: [(0, jsx_runtime_1.jsxs)("span", { "aria-hidden": "true", className: "relative inline-flex size-3 items-center justify-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "animate-demo-live-pulse absolute inset-0 rounded-full bg-emerald-400/55" }), (0, jsx_runtime_1.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-emerald-500" })] }), "Live data"] })] })] }) }));
}
function CompactDashboardHeaderInteractive({ branches, selectedBranchId, generatedAt, }) {
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    function handleBranchChange(nextBranchId) {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set("branch", nextBranchId);
        nextParams.delete("product");
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    }
    return ((0, jsx_runtime_1.jsx)(CompactDashboardHeaderPanel, { branches: branches, selectedBranchId: selectedBranchId, generatedAt: generatedAt, onBranchChange: handleBranchChange }));
}
function CompactDashboardHeader(props) {
    if (props.staticMode) {
        return (0, jsx_runtime_1.jsx)(CompactDashboardHeaderPanel, { ...props, onBranchChange: () => undefined });
    }
    return (0, jsx_runtime_1.jsx)(CompactDashboardHeaderInteractive, { ...props });
}
