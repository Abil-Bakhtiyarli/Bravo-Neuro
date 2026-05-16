import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import ActionsPage from "./page";

test("Actions page renders the branch queue and shared product detail modal", async () => {
  const element = await ActionsPage({
    searchParams: Promise.resolve({
      branch: "ganjlik",
      product: "greek-yogurt-500g",
    }),
    testStaticMode: true,
  });
  const markup = renderToStaticMarkup(element);

  assert.match(markup, /Discount actions and execution plan/);
  assert.match(markup, /Today&#x27;s branch actions/);
  assert.match(markup, /Accept task/);
});
