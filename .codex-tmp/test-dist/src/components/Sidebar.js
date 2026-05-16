"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const utils_1 = require("@/lib/utils");
const navItems = [
    { label: "Dashboard", href: "/", icon: lucide_react_1.LayoutDashboard },
    { label: "Risk Products", href: "/risk", icon: lucide_react_1.AlertTriangle },
    { label: "Discount Actions", href: "/actions", icon: lucide_react_1.BadgePercent },
    { label: "Transfers", href: "/transfers", icon: lucide_react_1.ArrowRightLeft, disabled: true },
    { label: "Revenue Forecast", href: "/forecast", icon: lucide_react_1.TrendingUp, disabled: true },
    { label: "Branches", href: "/branches", icon: lucide_react_1.Store },
    { label: "AI Assistant", href: "/assistant", icon: lucide_react_1.Bot, disabled: true },
];
function NavLink({ item, mobile = false, pathnameOverride, }) {
    const pathnameFromRouter = (0, navigation_1.usePathname)();
    const pathname = pathnameOverride ?? pathnameFromRouter;
    const isActive = pathname === item.href;
    const Icon = item.icon;
    const sharedClassName = (0, utils_1.cn)("flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200", mobile ? "whitespace-nowrap" : "w-full", item.disabled
        ? "cursor-not-allowed border border-transparent text-muted-foreground/70"
        : isActive
            ? "border border-emerald-300/65 bg-emerald-100/55 text-emerald-950 shadow-[0_12px_24px_-22px_rgba(5,150,105,0.28)] ring-1 ring-emerald-200/50"
            : "text-foreground/78 hover:-translate-y-0.5 hover:border hover:border-border/85 hover:bg-muted/72 hover:text-foreground");
    if (item.disabled) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: sharedClassName, "aria-disabled": "true", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "size-4 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "min-w-0 flex-1", children: item.label }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Soon" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, className: sharedClassName, "aria-current": isActive ? "page" : undefined, children: [(0, jsx_runtime_1.jsx)(Icon, { className: "size-4 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "min-w-0 flex-1", children: item.label })] }));
}
function Sidebar({ pathnameOverride }) {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-b border-border/90 bg-sidebar/94 px-4 py-3 backdrop-blur lg:hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "min-w-0", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "/bravo-neuro-logo.svg", alt: "Bravo Neuro", width: 1289, height: 816, className: "h-8 w-auto", priority: true }) }), (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-emerald-300/65 bg-emerald-100/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-900", children: "Live" })] }), (0, jsx_runtime_1.jsx)("nav", { className: "-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1", children: navItems.map((item) => ((0, jsx_runtime_1.jsx)(NavLink, { item: item, mobile: true, pathnameOverride: pathnameOverride }, item.href))) })] }), (0, jsx_runtime_1.jsx)("aside", { className: "hidden w-64 shrink-0 border-r border-border/90 bg-sidebar/96 lg:flex lg:h-screen lg:flex-col", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex h-full flex-col px-5 py-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "border-b border-border/90 pb-5", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "/bravo-neuro-logo.svg", alt: "Bravo Neuro", width: 1289, height: 816, className: "h-11 w-auto", priority: true }) }), (0, jsx_runtime_1.jsx)("nav", { className: "mt-5 flex flex-1 flex-col gap-1.5", children: navItems.map((item) => ((0, jsx_runtime_1.jsx)(NavLink, { item: item, pathnameOverride: pathnameOverride }, item.href))) }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-border/90 pt-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-emerald-300/70 bg-emerald-50/65 p-4 shadow-[0_14px_28px_-26px_rgba(5,150,105,0.18)]", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800", children: "Live snapshot" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm leading-6 text-emerald-950/85", children: "Overview, risk, actions, and branches stay in one branch context." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-card mt-4 p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Session" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm font-medium text-foreground", children: "Hackathon build" })] })] })] }) })] }));
}
