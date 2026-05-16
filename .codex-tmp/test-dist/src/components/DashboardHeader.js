"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const branchStatusText = {
    ganjlik: "Morning review ready",
    yasamal: "Family demand review ready",
    may28: "Transit peak review ready",
};
const demandProfileLabels = {
    commuter: "Commuter demand",
    family: "Family demand",
    "premium-mixed": "Premium mixed demand",
};
function formatDemoDate(generatedAt) {
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(generatedAt));
}
function getBranchStatus(branchId) {
    return branchStatusText[branchId] ?? "Daily review ready";
}
function DashboardHeader({ branches, selectedBranchId, generatedAt, }) {
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const branchIds = (0, react_1.useMemo)(() => branches.map((branch) => branch.branchId), [branches]);
    const requestedBranchId = searchParams.get("branch");
    const activeBranchId = requestedBranchId && branchIds.includes(requestedBranchId)
        ? requestedBranchId
        : selectedBranchId;
    const selectedBranch = (0, react_1.useMemo)(() => branches.find((branch) => branch.branchId === activeBranchId) ?? branches[0], [activeBranchId, branches]);
    function handleBranchChange(nextBranchId) {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set("branch", nextBranchId);
        nextParams.delete("product");
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-accent/75 px-2.5 py-1", children: "Bravo Neuro" }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-dashed border-border/80 px-2.5 py-1", children: "Part 19 demo polish" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h1", { className: "max-w-4xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl xl:text-[2.8rem]", children: "Retail waste-risk operations dashboard for branch-level decisions." }), (0, jsx_runtime_1.jsx)("p", { className: "max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base", children: "Track branch waste exposure, monthly protected value, product-level risk, and manager actions from one server-driven demo snapshot." })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-3 sm:grid-cols-2 lg:w-[30rem]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/70 bg-background/80 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Selected branch" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-lg font-semibold text-foreground", children: selectedBranch.branchName })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Store, { className: "mt-1 size-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-2 flex items-start gap-2 text-sm leading-5 text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mt-0.5 size-3.5 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: selectedBranch.location })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm font-medium text-foreground/75", children: demandProfileLabels[selectedBranch.demandProfile] }), (0, jsx_runtime_1.jsxs)("label", { className: "mt-4 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: ["Branch selector", (0, jsx_runtime_1.jsx)("select", { className: "mt-2 w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10", value: activeBranchId, onChange: (event) => handleBranchChange(event.target.value), children: branches.map((branch) => ((0, jsx_runtime_1.jsx)("option", { value: branch.branchId, children: branch.branchName }, branch.branchId))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/70 bg-background/80 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Daily status" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-lg font-semibold text-foreground", children: getBranchStatus(selectedBranch.branchId) })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.CalendarClock, { className: "mt-1 size-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-muted-foreground", children: formatDemoDate(generatedAt) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 rounded-xl border border-dashed border-border/80 bg-card/70 px-3 py-2 text-xs leading-5 text-muted-foreground", children: "Changing branches refreshes the chart, KPI rail, risk queue, and drawer context together." })] })] })] }));
}
