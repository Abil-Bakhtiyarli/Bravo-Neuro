"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const gemini_1 = require("@/lib/assistant/gemini");
function createSseChunk(payload) {
    return `data: ${JSON.stringify(payload)}\n\n`;
}
function splitMessageIntoChunks(message) {
    const normalized = message.trim();
    if (!normalized) {
        return ["I could not produce a response."];
    }
    const parts = normalized
        .match(/.{1,80}(\s|$)/g)
        ?.map((part) => part.trim())
        .filter(Boolean);
    return parts && parts.length > 0 ? parts : [normalized];
}
async function parseRequestBody(request) {
    const payload = (await request.json());
    return {
        branchId: payload.branchId ?? "",
        productId: payload.productId ?? null,
        message: typeof payload.message === "string" ? payload.message : "",
        history: Array.isArray(payload.history) ? payload.history : [],
    };
}
async function POST(request) {
    const encoder = new TextEncoder();
    try {
        const payload = await parseRequestBody(request);
        if (!payload.branchId || !payload.message.trim()) {
            return new Response(JSON.stringify({ error: "branchId and message are required." }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        const assistantResponse = await (0, gemini_1.runAssistantChat)(payload);
        const stream = new ReadableStream({
            start(controller) {
                const chunks = splitMessageIntoChunks(assistantResponse.message);
                for (const chunk of chunks) {
                    controller.enqueue(encoder.encode(createSseChunk({ type: "chunk", content: chunk })));
                }
                controller.enqueue(encoder.encode(createSseChunk({
                    type: "done",
                    response: assistantResponse,
                })));
                controller.close();
            },
        });
        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Assistant request failed unexpectedly.";
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode(createSseChunk({ type: "error", message })));
                controller.close();
            },
        });
        return new Response(stream, {
            status: 500,
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
            },
        });
    }
}
