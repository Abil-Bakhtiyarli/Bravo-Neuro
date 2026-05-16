import { runAssistantChat } from "@/lib/assistant/gemini";
import type { AssistantChatRequest, AssistantChatResponse } from "@/lib/types";

function createSseChunk(payload: Record<string, unknown>) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function splitMessageIntoChunks(message: string) {
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

async function parseRequestBody(request: Request): Promise<AssistantChatRequest> {
  const payload = (await request.json()) as Partial<AssistantChatRequest>;

  return {
    branchId: payload.branchId ?? "",
    productId: payload.productId ?? null,
    message: typeof payload.message === "string" ? payload.message : "",
    history: Array.isArray(payload.history) ? payload.history : [],
  };
}

export async function POST(request: Request) {
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

    const assistantResponse = await runAssistantChat(payload);
    const stream = new ReadableStream({
      start(controller) {
        const chunks = splitMessageIntoChunks(assistantResponse.message);

        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(createSseChunk({ type: "chunk", content: chunk })));
        }

        controller.enqueue(
          encoder.encode(
            createSseChunk({
              type: "done",
              response: assistantResponse,
            } satisfies { type: "done"; response: AssistantChatResponse }),
          ),
        );
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Assistant request failed unexpectedly.";

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
