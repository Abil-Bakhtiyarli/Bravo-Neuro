"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStorageKey = getTaskStorageKey;
exports.getNextTaskStatus = getNextTaskStatus;
exports.parsePersistedTaskStatuses = parsePersistedTaskStatuses;
exports.mergeTaskStatuses = mergeTaskStatuses;
exports.buildTaskSelectionSearchParams = buildTaskSelectionSearchParams;
exports.DailyActionPlanPanel = DailyActionPlanPanel;
exports.default = DailyActionPlan;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const riskTableInteraction_1 = require("@/lib/riskTableInteraction");
const utils_1 = require("@/lib/utils");
const button_1 = require("./ui/button");
const TASK_STATUS_STORAGE_KEY = "bravo-neuro:task-status:v2";
const actionTypeMeta = {
    discount: {
        icon: lucide_react_1.BadgePercent,
        label: "Dynamic discount",
        badge: "border-rose-200/90 bg-rose-50/90 text-rose-700",
    },
    transfer: {
        icon: lucide_react_1.ArrowRightLeft,
        label: "Stock transfer",
        badge: "border-violet-200/90 bg-violet-50/90 text-violet-700",
    },
    "reorder-adjustment": {
        icon: lucide_react_1.RefreshCcw,
        label: "Reorder adjustment",
        badge: "border-cyan-200/90 bg-cyan-50/90 text-cyan-700",
    },
    "shelf-action": {
        icon: lucide_react_1.Store,
        label: "Shelf action",
        badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
    },
    investigation: {
        icon: lucide_react_1.ScanSearch,
        label: "Investigation",
        badge: "border-slate-300/90 bg-slate-100/90 text-slate-700",
    },
};
const riskLevelMeta = {
    critical: {
        label: "Critical",
        badgeClassName: "border-rose-300/90 bg-rose-100/90 text-rose-800 animate-demo-soft-pulse-critical",
    },
    high: {
        label: "High",
        badgeClassName: "border-amber-300/90 bg-amber-100/90 text-amber-800",
    },
    medium: {
        label: "Medium",
        badgeClassName: "border-sky-300/90 bg-sky-100/90 text-sky-800",
    },
    low: {
        label: "Low",
        badgeClassName: "border-slate-300/90 bg-slate-100/90 text-slate-700",
    },
};
const taskStatusMeta = {
    pending: {
        label: "Pending",
        buttonLabel: "Accept task",
        buttonVariant: "default",
        badgeClassName: "border-amber-200/90 bg-amber-50/90 text-amber-700",
    },
    accepted: {
        label: "Accepted",
        buttonLabel: "Mark complete",
        buttonVariant: "secondary",
        badgeClassName: "border-sky-200/90 bg-sky-50/90 text-sky-700",
    },
    completed: {
        label: "Completed",
        buttonLabel: "Completed",
        buttonVariant: "outline",
        badgeClassName: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
    },
};
function buildUrl(pathname, searchParams) {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
}
function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "AZN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
function formatExpiry(daysUntilExpiry) {
    if (daysUntilExpiry <= 0) {
        return "Expires today";
    }
    if (daysUntilExpiry === 1) {
        return "1 day left";
    }
    return `${daysUntilExpiry} days left`;
}
function formatStockRiskSummary(task) {
    const scoreLabel = `${task.riskScore}/100 risk score`;
    if (task.daysUntilExpiry <= 1) {
        return `${scoreLabel}. Act ${task.daysUntilExpiry <= 0 ? "today" : "before tomorrow"} to avoid write-off.`;
    }
    if (task.daysUntilExpiry <= 3) {
        return `${scoreLabel}. Short expiry window needs branch action this week.`;
    }
    return `${scoreLabel}. Exposure is rising and should be handled in this review cycle.`;
}
function getTaskStorageKey(branchId) {
    return `${TASK_STATUS_STORAGE_KEY}:${branchId}`;
}
function getNextTaskStatus(status) {
    if (status === "pending") {
        return "accepted";
    }
    if (status === "accepted") {
        return "completed";
    }
    return "completed";
}
function parsePersistedTaskStatuses(serializedValue, validTaskIds) {
    if (!serializedValue) {
        return {};
    }
    try {
        const parsed = JSON.parse(serializedValue);
        const validTaskIdSet = new Set(validTaskIds);
        return Object.entries(parsed).reduce((accumulator, [taskId, status]) => {
            if (validTaskIdSet.has(taskId) &&
                (status === "pending" || status === "accepted" || status === "completed")) {
                accumulator[taskId] = status;
            }
            return accumulator;
        }, {});
    }
    catch {
        return {};
    }
}
function mergeTaskStatuses(tasks, statusMap) {
    return tasks.map((task) => ({
        ...task,
        status: statusMap[task.taskId] ?? task.status,
    }));
}
function buildTaskSelectionSearchParams(current, productId) {
    return (0, riskTableInteraction_1.updateRiskTableSearchParams)(current, {
        product: productId,
        q: null,
        risk: null,
    });
}
function DailyActionPlanPanel({ tasks, selectedProductId, onSelectTask, onAdvanceStatus, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border border-border/80 bg-card/92 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.55)]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-b border-border/80 px-5 py-5 sm:px-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: (0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-border/80 bg-accent/75 px-2.5 py-1", children: "Priority queue" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "mt-4 text-2xl font-semibold tracking-tight text-foreground", children: "Today's branch actions" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: "Review the highest-risk products first, keep the current selection in sync, and advance task status without leaving the dashboard." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 p-4 sm:p-5", children: [tasks.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "rounded-2xl border border-dashed border-border/75 bg-background/88 px-4 py-8 text-center text-sm leading-6 text-muted-foreground", children: "No actions are queued for this branch right now. Switch branches to review another product story." })) : null, tasks.map((task) => {
                        const isSelected = task.productId === selectedProductId;
                        const actionMeta = actionTypeMeta[task.actionType];
                        const riskMeta = riskLevelMeta[task.riskLevel];
                        const statusMeta = taskStatusMeta[task.status];
                        const ActionIcon = actionMeta.icon;
                        return ((0, jsx_runtime_1.jsxs)("article", { tabIndex: 0, "data-selected": isSelected ? "true" : "false", className: (0, utils_1.cn)("rounded-2xl border bg-background/82 p-4 outline-none transition-all duration-200", "cursor-pointer hover:-translate-y-0.5 focus-visible:-translate-y-0.5", isSelected
                                ? "border-foreground/30 bg-accent/75 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.7)]"
                                : "border-border/75", task.priorityRank === 1 &&
                                "border-rose-200/80 bg-gradient-to-r from-rose-50/85 via-background/94 to-background/94", task.status === "completed" && "bg-emerald-50/45"), onClick: () => onSelectTask(task.productId), onKeyDown: (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    onSelectTask(task.productId);
                                }
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "rounded-full border border-border/75 bg-card/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: ["Priority ", task.priorityRank] }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", riskMeta.badgeClassName), children: riskMeta.label }), (0, jsx_runtime_1.jsxs)("span", { className: (0, utils_1.cn)("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", actionMeta.badge), children: [(0, jsx_runtime_1.jsx)(ActionIcon, { className: "size-3.5" }), actionMeta.label] }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", statusMeta.badgeClassName), children: statusMeta.label }), isSelected ? ((0, jsx_runtime_1.jsx)("span", { className: "rounded-full border border-foreground/20 bg-background/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75", children: "Selected" })) : null] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex flex-wrap items-start justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-foreground", children: task.productName }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80", children: [(0, jsx_runtime_1.jsx)("span", { children: formatExpiry(task.daysUntilExpiry) }), (0, jsx_runtime_1.jsx)("span", { children: formatStockRiskSummary(task) })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm leading-6 text-foreground/85", children: task.summary })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl border border-border/75 bg-card/90 px-3.5 py-3 text-left lg:min-w-36 lg:text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: "Expected net saved" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-xl font-semibold text-foreground", children: formatCurrency(task.expectedNetSavedValueAzN) })] })] })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", size: "sm", variant: statusMeta.buttonVariant, disabled: task.status === "completed", className: "shrink-0 lg:self-center", onClick: (event) => {
                                                event.stopPropagation();
                                                onAdvanceStatus(task.taskId);
                                            }, children: [task.status === "completed" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCheck, { className: "size-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.CircleCheckBig, { className: "size-4" })), statusMeta.buttonLabel] })] }), isSelected ? ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 rounded-2xl border border-border/70 bg-card/90 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ClipboardList, { className: "size-4" }), "Selected task checklist"] }), (0, jsx_runtime_1.jsx)("ol", { className: "mt-3 space-y-2", children: task.checklistSteps.map((step, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex gap-3 rounded-2xl border border-border/65 bg-background/88 px-3.5 py-3 text-sm leading-6 text-foreground/80", children: [(0, jsx_runtime_1.jsx)("span", { className: "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border/75 bg-card text-[11px] font-semibold text-foreground/75", children: index + 1 }), (0, jsx_runtime_1.jsx)("span", { children: step })] }, `${task.taskId}:step:${index + 1}`))) })] })) : null] }, task.taskId));
                    })] })] }));
}
function DailyActionPlanInteractive({ branchId, tasks, selectedProductId: controlledSelectedProductId, onSelectTask: controlledOnSelectTask, }) {
    const router = (0, navigation_1.useRouter)();
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const selectedProductId = controlledSelectedProductId ?? searchParams?.get("product") ?? null;
    const [taskStatuses, setTaskStatuses] = (0, react_1.useState)({});
    const visibleTasks = (0, react_1.useMemo)(() => mergeTaskStatuses(tasks, taskStatuses), [taskStatuses, tasks]);
    (0, react_1.useEffect)(() => {
        const frameId = window.requestAnimationFrame(() => {
            setTaskStatuses(parsePersistedTaskStatuses(window.localStorage.getItem(getTaskStorageKey(branchId)), tasks.map((task) => task.taskId)));
        });
        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [branchId, tasks]);
    function persistTaskStatuses(nextStatuses) {
        setTaskStatuses(nextStatuses);
        window.localStorage.setItem(getTaskStorageKey(branchId), JSON.stringify(nextStatuses));
    }
    function handleSelectTask(productId) {
        if (controlledOnSelectTask) {
            controlledOnSelectTask(productId);
            return;
        }
        const nextParams = buildTaskSelectionSearchParams(new URLSearchParams(searchParams?.toString() ?? ""), productId);
        router.push(buildUrl(pathname, nextParams), { scroll: false });
    }
    function handleAdvanceStatus(taskId) {
        const currentStatus = visibleTasks.find((task) => task.taskId === taskId)?.status;
        if (!currentStatus || currentStatus === "completed") {
            return;
        }
        persistTaskStatuses({
            ...taskStatuses,
            [taskId]: getNextTaskStatus(currentStatus),
        });
    }
    return ((0, jsx_runtime_1.jsx)(DailyActionPlanPanel, { tasks: visibleTasks, selectedProductId: selectedProductId, onSelectTask: handleSelectTask, onAdvanceStatus: handleAdvanceStatus }));
}
function DailyActionPlanStatic({ tasks, selectedProductId, onSelectTask, }) {
    return ((0, jsx_runtime_1.jsx)(DailyActionPlanPanel, { tasks: tasks, selectedProductId: selectedProductId ?? null, onSelectTask: onSelectTask ?? (() => undefined), onAdvanceStatus: () => undefined }));
}
function DailyActionPlan({ staticMode = false, ...props }) {
    if (staticMode) {
        return ((0, jsx_runtime_1.jsx)(DailyActionPlanStatic, { tasks: props.tasks, selectedProductId: props.selectedProductId, onSelectTask: props.onSelectTask }));
    }
    return (0, jsx_runtime_1.jsx)(DailyActionPlanInteractive, { ...props });
}
