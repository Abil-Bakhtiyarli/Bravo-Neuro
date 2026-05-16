"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, LoaderCircle, SendHorizontal, Sparkles } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import type {
  AssistantChatMessage,
  AssistantChatRequest,
  AssistantCitation,
  AssistantContextSnapshot,
  BranchId,
  ProductId,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type AssistantExperienceProps = {
  branchId: BranchId;
  initialProductId: ProductId | null;
  contextSnapshot: AssistantContextSnapshot;
  staticMode?: boolean;
};

type AssistantTurn = {
  id: string;
  role: AssistantChatMessage["role"];
  content: string;
  citations?: AssistantCitation[];
  pending?: boolean;
  error?: boolean;
};

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

function updateProductSearchParam(current: URLSearchParams, productId: string | null) {
  if (productId) {
    current.set("product", productId);
  } else {
    current.delete("product");
  }

  return current;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "AZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function buildInitialAssistantTurn(snapshot: AssistantContextSnapshot): AssistantTurn {
  const selectedName = snapshot.selectedProduct?.product.name;
  const branch = snapshot.branch.branchName;
  const topRisk = snapshot.branch.topRiskProducts[0];
  const nextAction = snapshot.branch.actionPlan[0];
  const lines = [
    `Ask about ${branch} operations, risk drivers, or recommended actions.`,
    selectedName
      ? `The current product focus is ${selectedName}.`
      : topRisk
        ? `The highest-priority risk right now is ${topRisk.productName}.`
        : "There is no selected product yet.",
    nextAction
      ? `The top action queue item is ${nextAction.productName} with ${formatCurrency(nextAction.expectedNetSavedValueAzN)} potential net protection.`
      : "This branch has no queued action items right now.",
  ];

  return {
    id: "assistant-intro",
    role: "assistant",
    content: lines.join(" "),
    citations: [
      {
        kind: "branch-kpi",
        label: `${branch} context`,
        branchId: snapshot.branch.branchId,
      },
    ],
  };
}

function parseSsePayload(payload: string) {
  return payload
    .split("\n\n")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const line = entry
        .split("\n")
        .find((item) => item.startsWith("data: "));

      if (!line) {
        return [];
      }

      try {
        return [JSON.parse(line.slice("data: ".length)) as Record<string, unknown>];
      } catch {
        return [];
      }
    });
}

function CitationBadge({ citation }: { citation: AssistantCitation }) {
  const toneClassName = {
    "branch-kpi": "border-sky-300/75 bg-sky-100/70 text-sky-950",
    "risk-row": "border-rose-300/75 bg-rose-100/70 text-rose-950",
    "action-item": "border-amber-300/75 bg-amber-100/75 text-amber-950",
    "product-detail": "border-emerald-300/75 bg-emerald-100/75 text-emerald-950",
    "savings-series": "border-violet-300/75 bg-violet-100/75 text-violet-950",
  }[citation.kind];

  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]",
        toneClassName,
      )}
    >
      {citation.label}
    </span>
  );
}

export default function AssistantExperience({
  branchId,
  initialProductId,
  contextSnapshot,
  staticMode = false,
}: AssistantExperienceProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<AssistantTurn[]>([
    buildInitialAssistantTurn(contextSnapshot),
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedProductId = contextSnapshot.selectedProduct?.product.productId ?? null;
  const activeProductId = selectedProductId ?? initialProductId;
  const branchSummary = useMemo(
    () =>
      contextSnapshot.branch.kpis.map((kpi) => ({
        key: kpi.key,
        label: kpi.label,
        value: kpi.unit === "azn" ? formatCurrency(kpi.value) : kpi.value.toString(),
      })),
    [contextSnapshot.branch.kpis],
  );

  useEffect(() => {
    if (!initialProductId || selectedProductId || staticMode) {
      return;
    }

    const nextParams = updateProductSearchParam(
      new URLSearchParams(searchParams?.toString() ?? ""),
      null,
    );
    window.history.replaceState(null, "", buildUrl(pathname, nextParams));
  }, [initialProductId, pathname, searchParams, selectedProductId, staticMode]);

  async function submitMessage(message: string) {
    const normalizedMessage = message.trim();

    if (!normalizedMessage || isSubmitting || staticMode) {
      return;
    }

    const userTurn: AssistantTurn = {
      id: `user-${Date.now()}`,
      role: "user",
      content: normalizedMessage,
    };
    const pendingId = `assistant-${Date.now()}`;
    const priorTurns = turns.filter((turn) => !turn.pending && !turn.error);

    setTurns((current) => [
      ...current,
      userTurn,
      {
        id: pendingId,
        role: "assistant",
        content: "",
        pending: true,
      },
    ]);
    setDraft("");
    setIsSubmitting(true);

    try {
      const requestBody: AssistantChatRequest = {
        branchId,
        productId: activeProductId,
        message: normalizedMessage,
        history: priorTurns.map((turn) => ({
          role: turn.role,
          content: turn.content,
        })),
      };
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok || !response.body) {
        throw new Error("The assistant endpoint did not return a readable stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const segments = buffer.split("\n\n");

        buffer = segments.pop() ?? "";

        for (const segment of segments) {
          const events = parseSsePayload(segment);

          for (const event of events) {
            if (event.type === "chunk" && typeof event.content === "string") {
              setTurns((current) =>
                current.map((turn) =>
                  turn.id === pendingId
                    ? {
                        ...turn,
                        content: `${turn.content}${turn.content ? " " : ""}${event.content}`,
                      }
                    : turn,
                ),
              );
            }

            if (event.type === "done" && event.response && typeof event.response === "object") {
              const payload = event.response as {
                message?: string;
                citations?: AssistantCitation[];
              };

              setTurns((current) =>
                current.map((turn) =>
                  turn.id === pendingId
                    ? {
                        ...turn,
                        content: payload.message ?? turn.content,
                        citations: Array.isArray(payload.citations) ? payload.citations : [],
                        pending: false,
                      }
                    : turn,
                ),
              );
            }

            if (event.type === "error" && typeof event.message === "string") {
              const errorMessage = event.message;

              setTurns((current) =>
                current.map((turn) =>
                  turn.id === pendingId
                    ? {
                        ...turn,
                        content: errorMessage,
                        pending: false,
                        error: true,
                      }
                    : turn,
                ),
              );
            }
          }
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Assistant request failed unexpectedly.";

      setTurns((current) =>
        current.map((turn) =>
          turn.id === pendingId
            ? {
                ...turn,
                content: message,
                pending: false,
                error: true,
              }
            : turn,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChipClick(prompt: string) {
    setDraft(prompt);
  }

  function handleOpenSelectedProduct() {
    if (!contextSnapshot.branch.topRiskProducts[0] || staticMode) {
      return;
    }

    const productId = contextSnapshot.branch.topRiskProducts[0].productId;
    const nextParams = updateProductSearchParam(
      new URLSearchParams(searchParams?.toString() ?? ""),
      productId,
    );
    window.history.pushState(null, "", buildUrl(pathname, nextParams));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.95fr)] xl:items-start">
      <section className="demo-card animate-demo-fade-up overflow-hidden">
        <div className="border-b border-border/80 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(16,185,129,0.1),rgba(245,158,11,0.1))] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-900/80">
                Guided analysis
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Branch-aware assistant
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/75">
                Ask for grounded reasoning about risk, savings, transfers, or branch actions. The assistant only answers from the current Bravo data context.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-300/70 bg-white/70 px-4 py-3 text-sm font-medium text-sky-950 shadow-[0_16px_32px_-26px_rgba(37,99,235,0.24)]">
              Read-only mode
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {contextSnapshot.promptChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip.prompt)}
                className="rounded-full border border-sky-300/70 bg-white/72 px-3 py-2 text-sm font-medium text-sky-950 transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <div className="max-h-[34rem] space-y-4 overflow-y-auto pr-1">
            {turns.map((turn) => (
              <article
                key={turn.id}
                className={cn(
                  "max-w-[92%] rounded-3xl border px-4 py-3 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.34)]",
                  turn.role === "assistant"
                    ? turn.error
                      ? "border-rose-300/70 bg-rose-50/88 text-rose-950"
                      : "border-sky-200/75 bg-sky-50/88 text-slate-900"
                    : "ml-auto border-emerald-300/75 bg-emerald-100/80 text-emerald-950",
                )}
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">
                  {turn.role === "assistant" ? <Bot className="size-3.5" /> : <Sparkles className="size-3.5" />}
                  <span>{turn.role === "assistant" ? "Assistant" : "You"}</span>
                  {turn.pending ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{turn.content || "Thinking..."}</p>
                {turn.citations && turn.citations.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {turn.citations.map((citation, index) => (
                      <CitationBadge
                        key={`${turn.id}-${citation.kind}-${citation.productId ?? "branch"}-${index}`}
                        citation={citation}
                      />
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void submitMessage(draft);
            }}
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Ask the assistant
              </span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-3xl border border-border/85 bg-card/90 px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask why a product is risky, what the branch should do today, or how a recommendation protects value."
                disabled={isSubmitting || staticMode}
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                The assistant cites the branch snapshot, risk rows, actions, and selected product detail it used.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || staticMode || draft.trim().length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/75 bg-sky-100/85 px-4 py-2 text-sm font-semibold text-sky-950 transition hover:-translate-y-0.5 hover:bg-sky-200/80 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <SendHorizontal className="size-4" />
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      <aside className="flex flex-col gap-4 xl:sticky xl:top-7">
        <section className="demo-card animate-demo-fade-up animate-demo-delay-1 p-5 sm:p-6">
          <p className="demo-muted-label">Live branch context</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {contextSnapshot.branch.branchName}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {branchSummary.map((item) => (
              <div key={item.key} className="demo-surface-panel p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="demo-card animate-demo-fade-up animate-demo-delay-2 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="demo-muted-label">Selected product</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {contextSnapshot.selectedProduct?.product.name ?? "No product selected"}
              </h3>
            </div>
            {!contextSnapshot.selectedProduct && contextSnapshot.branch.topRiskProducts[0] ? (
              <button
                type="button"
                onClick={handleOpenSelectedProduct}
                className="rounded-full border border-emerald-300/70 bg-emerald-100/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-200/70"
              >
                Open top risk
              </button>
            ) : null}
          </div>

          {contextSnapshot.selectedProduct ? (
            <div className="mt-4 space-y-3">
              <div className="demo-surface-panel p-3">
                <p className="text-sm font-semibold text-foreground">
                  Risk {contextSnapshot.selectedProduct.risk.riskLevel} ({contextSnapshot.selectedProduct.risk.roundedScore})
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {contextSnapshot.selectedProduct.daysUntilEarliestExpiry} days to earliest expiry and {contextSnapshot.selectedProduct.totalStock} units in stock.
                </p>
              </div>
              <div className="demo-surface-panel p-3">
                <p className="text-sm font-semibold text-foreground">
                  {contextSnapshot.selectedProduct.recommendation?.summary ?? "No active recommendation"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {contextSnapshot.selectedProduct.savings
                    ? `${formatCurrency(contextSnapshot.selectedProduct.savings.netSavedValueAzN)} estimated net value protection.`
                    : "Savings estimate unavailable."}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Keep the conversation branch-wide, or open a product from the risk surfaces to ground the assistant on one item.
            </p>
          )}
        </section>

        <section className="demo-card animate-demo-fade-up animate-demo-delay-3 p-5 sm:p-6">
          <p className="demo-muted-label">Current queue</p>
          <div className="mt-4 space-y-3">
            {contextSnapshot.branch.actionPlan.slice(0, 3).map((item) => (
              <div key={item.taskId} className="demo-surface-panel p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                  <span className="rounded-full border border-amber-300/70 bg-amber-100/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-950">
                    {item.actionType}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
