"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowRightLeft,
  BadgePercent,
  CheckCheck,
  ChevronRight,
  CircleCheckBig,
  ClipboardList,
  PackageSearch,
  RefreshCcw,
  ScanSearch,
  Store,
} from "lucide-react";

import { updateRiskTableSearchParams } from "@/lib/riskTableInteraction";
import type {
  ActionPlanItem,
  BranchId,
  RecommendationActionType,
  TaskStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

type TaskStatusMap = Partial<Record<string, TaskStatus>>;

export type DailyActionPlanProps = {
  branchId: BranchId;
  tasks: readonly ActionPlanItem[];
};

type DailyActionPlanPanelProps = {
  tasks: readonly ActionPlanItem[];
  selectedProductId: string | null;
  onSelectTask: (productId: string) => void;
  onAdvanceStatus: (taskId: string) => void;
};

const TASK_STATUS_STORAGE_KEY = "bravo-neuro:task-status:v1";

const actionTypeMeta: Record<
  RecommendationActionType,
  {
    icon: typeof BadgePercent;
    label: string;
    badge: string;
  }
> = {
  discount: {
    icon: BadgePercent,
    label: "Dynamic discount",
    badge: "border-rose-200/90 bg-rose-50/90 text-rose-700",
  },
  transfer: {
    icon: ArrowRightLeft,
    label: "Stock transfer",
    badge: "border-violet-200/90 bg-violet-50/90 text-violet-700",
  },
  "reorder-adjustment": {
    icon: RefreshCcw,
    label: "Reorder adjustment",
    badge: "border-cyan-200/90 bg-cyan-50/90 text-cyan-700",
  },
  "shelf-action": {
    icon: Store,
    label: "Shelf action",
    badge: "border-emerald-200/90 bg-emerald-50/90 text-emerald-700",
  },
  investigation: {
    icon: ScanSearch,
    label: "Investigation",
    badge: "border-slate-300/90 bg-slate-100/90 text-slate-700",
  },
};

const taskStatusMeta: Record<
  TaskStatus,
  {
    label: string;
    buttonLabel: string;
    buttonVariant: "default" | "secondary" | "outline";
    badgeClassName: string;
  }
> = {
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

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatExpiry(daysUntilExpiry: number) {
  if (daysUntilExpiry <= 0) {
    return "Expires today";
  }

  if (daysUntilExpiry === 1) {
    return "1 day left";
  }

  return `${daysUntilExpiry} days left`;
}

export function getTaskStorageKey(branchId: BranchId) {
  return `${TASK_STATUS_STORAGE_KEY}:${branchId}`;
}

export function getNextTaskStatus(status: TaskStatus): TaskStatus {
  if (status === "pending") {
    return "accepted";
  }

  if (status === "accepted") {
    return "completed";
  }

  return "completed";
}

export function parsePersistedTaskStatuses(
  serializedValue: string | null,
  validTaskIds: readonly string[],
): TaskStatusMap {
  if (!serializedValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(serializedValue) as Record<string, unknown>;
    const validTaskIdSet = new Set(validTaskIds);

    return Object.entries(parsed).reduce<TaskStatusMap>((accumulator, [taskId, status]) => {
      if (
        validTaskIdSet.has(taskId) &&
        (status === "pending" || status === "accepted" || status === "completed")
      ) {
        accumulator[taskId] = status;
      }

      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

export function mergeTaskStatuses(
  tasks: readonly ActionPlanItem[],
  statusMap: TaskStatusMap,
): ActionPlanItem[] {
  return tasks.map((task) => ({
    ...task,
    status: statusMap[task.taskId] ?? task.status,
  }));
}

export function buildTaskSelectionSearchParams(
  current: URLSearchParams,
  productId: string,
) {
  return updateRiskTableSearchParams(current, {
    product: productId,
    q: null,
    risk: null,
  });
}

export function DailyActionPlanPanel({
  tasks,
  selectedProductId,
  onSelectTask,
  onAdvanceStatus,
}: DailyActionPlanPanelProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card/92 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.55)]">
      <div className="border-b border-border/80 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <span className="rounded-full border border-border/80 bg-accent/75 px-2.5 py-1">
            Daily action plan
          </span>
          <span className="rounded-full border border-dashed border-border/80 px-2.5 py-1">
            Manager execution queue
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Manager handoff queue
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Recommendation-backed tasks stay branch-scoped, priority-ranked, and locally persistent
          so the branch lead can move from review to execution without leaving the dashboard.
        </p>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/75 bg-background/88 px-4 py-8 text-center text-sm leading-6 text-muted-foreground">
            No manager actions are queued for this branch right now. Switch branches or revisit the risk filters if you need another product story.
          </div>
        ) : null}
        {tasks.map((task) => {
          const isSelected = task.productId === selectedProductId;
          const actionMeta = actionTypeMeta[task.actionType];
          const statusMeta = taskStatusMeta[task.status];
          const ActionIcon = actionMeta.icon;
          const isExpanded = task.status !== "pending";

          return (
            <article
              key={task.taskId}
              tabIndex={0}
              data-selected={isSelected ? "true" : "false"}
              className={cn(
                "rounded-2xl border bg-background/82 p-4 outline-none transition-all duration-200",
                "cursor-pointer hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
                isSelected
                  ? "border-foreground/30 bg-accent/75 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.7)]"
                  : "border-border/75",
                task.status === "completed" && "bg-emerald-50/45",
              )}
              onClick={() => onSelectTask(task.productId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectTask(task.productId);
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border/75 bg-card/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
                      Priority {task.priorityRank}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                        actionMeta.badge,
                      )}
                    >
                      <ActionIcon className="size-3.5" />
                      {actionMeta.label}
                    </span>
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                        statusMeta.badgeClassName,
                      )}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{task.productName}</h3>
                      {isSelected ? (
                        <span className="rounded-full border border-foreground/20 bg-background/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
                          Selected for detail
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground/80">{task.summary}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/75 bg-card/90 px-3 py-2 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Expected net saved
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {formatCurrency(task.expectedNetSavedValueAzN)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-card/90 px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Expiry window
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatExpiry(task.daysUntilExpiry)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/90 px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Recovered value
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatCurrency(task.expectedRecoveredValueAzN)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/90 px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Execution detail
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {task.checklistSteps.length} steps ready
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/70 bg-card/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <ClipboardList className="size-4" />
                    Execution checklist
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    {isExpanded ? "Expanded" : "Expand after acceptance"}
                    <ChevronRight className={cn("size-4 transition-transform", isExpanded && "rotate-90")} />
                  </span>
                </div>
                <ol className="mt-3 space-y-2">
                  {(isExpanded ? task.checklistSteps : task.checklistSteps.slice(0, 1)).map((step, index) => (
                    <li
                      key={`${task.taskId}:step:${index + 1}`}
                      className="flex gap-3 rounded-2xl border border-border/65 bg-background/88 px-3.5 py-3 text-sm leading-6 text-foreground/80"
                    >
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border/75 bg-card text-[11px] font-semibold text-foreground/75">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <PackageSearch className="size-4" />
                  Open the product drawer to review the supporting risk story and savings case.
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={statusMeta.buttonVariant}
                  disabled={task.status === "completed"}
                  onClick={(event) => {
                    event.stopPropagation();
                    onAdvanceStatus(task.taskId);
                  }}
                >
                  {task.status === "completed" ? <CheckCheck className="size-4" /> : <CircleCheckBig className="size-4" />}
                  {statusMeta.buttonLabel}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function DailyActionPlan({ branchId, tasks }: DailyActionPlanProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedProductId = searchParams.get("product");
  const [taskStatuses, setTaskStatuses] = useState<TaskStatusMap>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    return parsePersistedTaskStatuses(
      window.localStorage.getItem(getTaskStorageKey(branchId)),
      tasks.map((task) => task.taskId),
    );
  });

  const visibleTasks = useMemo(() => mergeTaskStatuses(tasks, taskStatuses), [taskStatuses, tasks]);

  function persistTaskStatuses(nextStatuses: TaskStatusMap) {
    setTaskStatuses(nextStatuses);
    window.localStorage.setItem(getTaskStorageKey(branchId), JSON.stringify(nextStatuses));
  }

  function handleSelectTask(productId: string) {
    const nextParams = buildTaskSelectionSearchParams(
      new URLSearchParams(searchParams.toString()),
      productId,
    );

    window.history.pushState(null, "", buildUrl(pathname, nextParams));
  }

  function handleAdvanceStatus(taskId: string) {
    const currentStatus = visibleTasks.find((task) => task.taskId === taskId)?.status;

    if (!currentStatus || currentStatus === "completed") {
      return;
    }

    persistTaskStatuses({
      ...taskStatuses,
      [taskId]: getNextTaskStatus(currentStatus),
    });
  }

  return (
    <DailyActionPlanPanel
      tasks={visibleTasks}
      selectedProductId={selectedProductId}
      onSelectTask={handleSelectTask}
      onAdvanceStatus={handleAdvanceStatus}
    />
  );
}
