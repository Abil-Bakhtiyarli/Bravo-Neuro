"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAssistantChat = runAssistantChat;
require("server-only");
const context_1 = require("@/lib/assistant/context");
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_HISTORY_LIMIT = 8;
const SYSTEM_INSTRUCTION = [
    "You are the Bravo Neuro assistant for retail waste-risk decisions.",
    "Answer only from the supplied Bravo Neuro branch and product data.",
    "Do not invent branch names, product facts, savings values, or recommendations.",
    "If the data provided does not support an answer, say that directly.",
    "Prefer short, operational answers with explicit next actions when the data supports them.",
].join(" ");
function getGeminiModel() {
    return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}
function getGeminiApiKey() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY environment variable.");
    }
    return apiKey;
}
async function createGeminiClient() {
    const sdkModule = (await Promise.resolve().then(() => __importStar(require("@google/genai"))));
    return new sdkModule.GoogleGenAI({
        apiKey: getGeminiApiKey(),
    });
}
function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "AZN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
function formatRiskRow(row) {
    return [
        `${row.productName} (${row.riskLevel}, score ${row.riskScore})`,
        `${row.daysUntilExpiry}d to expiry`,
        `${row.totalStock} units in stock`,
        `${formatCurrency(row.netSavedValueAzN)} net protected`,
        `Recommended action: ${row.recommendationSummary}`,
    ].join(" | ");
}
function formatActionItem(item) {
    return [
        `${item.productName} (${item.actionType})`,
        `priority ${item.priorityRank}`,
        `${item.daysUntilExpiry}d to expiry`,
        `${formatCurrency(item.expectedNetSavedValueAzN)} expected net saved`,
        item.summary,
    ].join(" | ");
}
function formatProductDetail(detail) {
    const recommendation = detail.recommendation?.summary ?? "No active recommendation";
    const savings = detail.savings
        ? `${formatCurrency(detail.savings.netSavedValueAzN)} net saved potential`
        : "No savings estimate";
    return [
        `${detail.product.name} in ${detail.branch.branchName}`,
        `${detail.totalStock} units across ${detail.lotCount} lots`,
        `${detail.daysUntilEarliestExpiry}d until earliest expiry`,
        `Risk ${detail.risk.riskLevel} (${detail.risk.roundedScore})`,
        recommendation,
        savings,
    ].join(" | ");
}
function buildSnapshotSummary(branchId, productId) {
    const snapshot = (0, context_1.buildAssistantContextSnapshot)(branchId, productId);
    return [
        `Selected branch: ${snapshot.branch.branchName}.`,
        `KPIs: ${snapshot.branch.kpis.map((kpi) => `${kpi.label} ${kpi.unit === "azn" ? formatCurrency(kpi.value) : kpi.value}`).join("; ")}.`,
        `Top risks: ${snapshot.branch.topRiskProducts.map(formatRiskRow).join(" || ") || "No risky products queued."}`,
        `Top actions: ${snapshot.branch.actionPlan.map(formatActionItem).join(" || ") || "No actions queued."}`,
        snapshot.selectedProduct ? `Selected product: ${formatProductDetail(snapshot.selectedProduct)}.` : "No selected product.",
    ].join("\n");
}
function mapHistoryToContents(history, currentMessage) {
    const normalized = (history ?? [])
        .slice(-DEFAULT_HISTORY_LIMIT)
        .filter((item) => item.content.trim().length > 0);
    return [
        ...normalized.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
        })),
        {
            role: "user",
            parts: [{ text: currentMessage }],
        },
    ];
}
function getToolDeclarations() {
    return [
        {
            name: "get_branch_snapshot",
            description: "Get the current branch KPI summary, top risks, actions, and recent savings history.",
            parameters: {
                type: "OBJECT",
                properties: {
                    branchId: {
                        type: "STRING",
                        description: "The active branch id.",
                    },
                },
                required: ["branchId"],
            },
        },
        {
            name: "get_product_detail",
            description: "Get the selected product detail, risk, recommendation, and savings context for a branch.",
            parameters: {
                type: "OBJECT",
                properties: {
                    branchId: {
                        type: "STRING",
                        description: "The active branch id.",
                    },
                    productId: {
                        type: "STRING",
                        description: "The product id in the selected branch.",
                    },
                },
                required: ["branchId", "productId"],
            },
        },
        {
            name: "list_top_risk_products",
            description: "List the top risk products for the selected branch.",
            parameters: {
                type: "OBJECT",
                properties: {
                    branchId: {
                        type: "STRING",
                        description: "The active branch id.",
                    },
                    limit: {
                        type: "NUMBER",
                        description: "Maximum number of products to return.",
                    },
                },
                required: ["branchId"],
            },
        },
        {
            name: "list_branch_actions",
            description: "List the highest-priority action items for the selected branch.",
            parameters: {
                type: "OBJECT",
                properties: {
                    branchId: {
                        type: "STRING",
                        description: "The active branch id.",
                    },
                    limit: {
                        type: "NUMBER",
                        description: "Maximum number of actions to return.",
                    },
                },
                required: ["branchId"],
            },
        },
    ];
}
function normalizeLimit(limit, fallback) {
    if (typeof limit !== "number" || !Number.isFinite(limit)) {
        return fallback;
    }
    return Math.min(Math.max(Math.floor(limit), 1), 10);
}
function executeToolCall(toolName, args, request) {
    const branchId = typeof args.branchId === "string" ? args.branchId : request.branchId;
    switch (toolName) {
        case "get_branch_snapshot": {
            const snapshot = (0, context_1.buildAssistantContextSnapshot)(branchId);
            return {
                result: snapshot.branch,
                citations: [(0, context_1.buildBranchSnapshotCitation)(branchId)],
            };
        }
        case "get_product_detail": {
            const productId = typeof args.productId === "string" ? args.productId : request.productId ?? null;
            const snapshot = (0, context_1.buildAssistantContextSnapshot)(branchId, productId);
            return {
                result: snapshot.selectedProduct
                    ? {
                        detail: snapshot.selectedProduct,
                        riskRow: snapshot.selectedProductRiskRow,
                        action: snapshot.selectedProductAction,
                    }
                    : {
                        detail: null,
                        riskRow: null,
                        action: null,
                        message: "No selected product detail is available for this branch and product id.",
                    },
                citations: snapshot.selectedProduct
                    ? [(0, context_1.buildProductDetailCitation)(snapshot.selectedProduct)]
                    : [(0, context_1.buildBranchSnapshotCitation)(branchId)],
            };
        }
        case "list_top_risk_products": {
            const snapshot = (0, context_1.buildAssistantContextSnapshot)(branchId);
            const limit = normalizeLimit(args.limit, 5);
            const rows = snapshot.branch.topRiskProducts.slice(0, limit);
            return {
                result: rows,
                citations: rows.map((row) => ({
                    kind: "risk-row",
                    label: row.productName,
                    branchId,
                    productId: row.productId,
                })),
            };
        }
        case "list_branch_actions": {
            const snapshot = (0, context_1.buildAssistantContextSnapshot)(branchId);
            const limit = normalizeLimit(args.limit, 5);
            const items = snapshot.branch.actionPlan.slice(0, limit);
            return {
                result: items,
                citations: items.map((item) => ({
                    kind: "action-item",
                    label: item.productName,
                    branchId,
                    productId: item.productId,
                })),
            };
        }
        default:
            return {
                result: { error: `Unsupported tool: ${toolName}` },
                citations: [(0, context_1.buildBranchSnapshotCitation)(branchId)],
            };
    }
}
function getResponseText(response) {
    if (response && typeof response === "object" && "text" in response && typeof response.text === "string") {
        return response.text;
    }
    const candidates = response && typeof response === "object" && "candidates" in response
        ? response
            .candidates
        : undefined;
    const text = candidates?.flatMap((candidate) => candidate.content?.parts ?? [])
        .map((part) => part.text ?? "")
        .join("")
        .trim();
    return text || "I could not produce a grounded answer from the current branch data.";
}
function getFunctionCalls(response) {
    if (response && typeof response === "object" && "functionCalls" in response) {
        return response
            .functionCalls ?? [];
    }
    return [];
}
function dedupeCitations(citations) {
    const seen = new Set();
    return citations.filter((citation) => {
        const key = `${citation.kind}:${citation.branchId}:${citation.productId ?? ""}:${citation.label}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
async function runAssistantChat(request, dependencies = {}) {
    const client = dependencies.createClient
        ? await dependencies.createClient()
        : await createGeminiClient();
    const contents = mapHistoryToContents(request.history, request.message);
    const contextSummary = buildSnapshotSummary(request.branchId, request.productId);
    const citations = [(0, context_1.buildBranchSnapshotCitation)(request.branchId)];
    let iterationCount = 0;
    while (iterationCount < 4) {
        const response = await client.models.generateContent({
            model: getGeminiModel(),
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Bravo context:\n${contextSummary}\n\nUse tools if you need more detail. If data is missing, say so plainly.`,
                        },
                    ],
                },
                ...contents,
            ],
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [
                    {
                        functionDeclarations: getToolDeclarations(),
                    },
                ],
            },
        });
        const functionCalls = getFunctionCalls(response);
        if (functionCalls.length === 0) {
            return {
                message: getResponseText(response),
                citations: dedupeCitations(citations),
            };
        }
        const responseContent = response && typeof response === "object" && "candidates" in response
            ? response.candidates?.[0]?.content
            : null;
        if (responseContent) {
            contents.push(responseContent);
        }
        for (const toolCall of functionCalls) {
            const toolResult = executeToolCall(toolCall.name, toolCall.args ?? {}, request);
            citations.push(...toolResult.citations);
            contents.push({
                role: "user",
                parts: [
                    {
                        functionResponse: {
                            name: toolCall.name,
                            response: toolResult.result,
                        },
                    },
                ],
            });
        }
        iterationCount += 1;
    }
    return {
        message: "I could not finish the grounded tool lookup cycle. Please try a narrower question.",
        citations: dedupeCitations(citations),
    };
}
