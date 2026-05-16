import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import AssistantPage from "./page";

test("Assistant page renders the branch-aware assistant shell and context panel", async () => {
  const element = await AssistantPage({
    searchParams: Promise.resolve({
      branch: "ganjlik",
      product: "greek-yogurt-500g",
    }),
    testStaticMode: true,
  });
  const markup = renderToStaticMarkup(element);

  assert.match(markup, /AI assistant/);
  assert.match(markup, /Branch-aware Gemini assistant/);
  assert.match(markup, /Live branch context/);
  assert.match(markup, /Selected product/);
});
