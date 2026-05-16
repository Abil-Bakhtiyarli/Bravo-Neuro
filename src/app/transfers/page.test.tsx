import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import TransfersPage from "./page";

test("Transfers page renders branch-aware transfer lanes", async () => {
  const element = await TransfersPage({
    searchParams: Promise.resolve({
      branch: "ganjlik",
    }),
    testStaticMode: true,
  });
  const markup = renderToStaticMarkup(element);

  assert.match(markup, /Transfers/);
  assert.match(markup, /Inter-branch transfer recommendations/);
  assert.match(markup, /Bravo Ganjlik/);
  assert.match(markup, /Value protected/);
  assert.match(markup, /Strawberries 250g/);
});
