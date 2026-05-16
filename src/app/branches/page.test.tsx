import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import BranchesPage from "./page";

test("Branches page renders all branch comparison summaries", async () => {
  const element = await BranchesPage({
    searchParams: Promise.resolve({
      branch: "ganjlik",
    }),
    testStaticMode: true,
  });
  const markup = renderToStaticMarkup(element);

  assert.match(markup, /Branch comparison/);
  assert.match(markup, /Bravo Ganjlik/);
  assert.match(markup, /Bravo Yasamal/);
  assert.match(markup, /Bravo 28 May/);
  assert.match(markup, /Protected value/);
});
