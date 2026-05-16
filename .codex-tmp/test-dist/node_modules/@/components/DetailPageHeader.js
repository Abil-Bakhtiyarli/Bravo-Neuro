"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailPageHeaderPanel = DetailPageHeaderPanel;
exports.default = DetailPageHeader;
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
function buildRouteSearchParams(currentSearchParams, nextBranchId, preservedSearchParamKeys) {
    const nextParams = new URLSearchParams();
    nextParams.set("branch", nextBranchId);
    for (const key of preservedSearchParamKeys) {
        if (key === "branch" || key === "product") {
            continue;
        }
        for (const value of currentSearchParams.getAll(key)) {
            nextParams.append(key, value);
        }
    }
    return nextParams;
}
function DetailPageHeaderPanel({ branches, selectedBranchId, title, subtitle, generatedAt, onBranchChange, }) {
    return ((0, jsx_runtime_1.jsx)("section", { className: "animate-demo-fade-up rounded-3xl border border-border/80 bg-card/92 p-5 shadow-[0_20px_54px_-40px_rgba(15,23,42,0.55)] sm:p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Operations" }), (0, jsx_runtime_1.jsx)("h1", { className: "mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 max-w-3xl text-sm text-muted-foreground", children: subtitle }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground", children: [(0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-2 rounded-full border border-border/75 bg-background/90 px-3 py-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Store, { className: "size-4" }), branches.find((branch) => branch.branchId === selectedBranchId)?.branchName ?? branches[0]?.branchName] }), (0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-2 rounded-full border border-border/75 bg-background/90 px-3 py-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CalendarClock, { className: "size-4" }), formatDemoDate(generatedAt)] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [(0, jsx_runtime_1.jsxs)("label", { className: "min-w-[14rem] text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: ["Branch", (0, jsx_runtime_1.jsxs)("div", { className: "relative mt-2", children: [(0, jsx_runtime_1.jsx)("select", { className: "w-full appearance-none rounded-2xl border border-border/80 bg-background px-4 py-3 pr-10 text-sm font-medium tracking-normal text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10", value: selectedBranchId, onChange: (event) => onBranchChange(event.target.value), children: branches.map((branch) => ((0, jsx_runtime_1.jsx)("option", { value: branch.branchId, children: branch.branchName }, branch.branchId))) }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-900", children: "Live branch data" })] })] }) }));
}
function DetailPageHeaderInteractive({ branches, selectedBranchId, title, subtitle, generatedAt, preservedSearchParamKeys = [], }) {
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    function handleBranchChange(nextBranchId) {
        const nextParams = buildRouteSearchParams(new URLSearchParams(searchParams?.toString() ?? ""), nextBranchId, preservedSearchParamKeys);
        const query = nextParams.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
    return ((0, jsx_runtime_1.jsx)(DetailPageHeaderPanel, { branches: branches, selectedBranchId: selectedBranchId, title: title, subtitle: subtitle, generatedAt: generatedAt, onBranchChange: handleBranchChange }));
}
function DetailPageHeader(props) {
    if (props.staticMode) {
        return (0, jsx_runtime_1.jsx)(DetailPageHeaderPanel, { ...props, onBranchChange: () => undefined });
    }
    return (0, jsx_runtime_1.jsx)(DetailPageHeaderInteractive, { ...props });
}
