import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import RiskPage from "./page";

test("Risk page renders the detail header and full risk table surface", async () => {
  const element = await RiskPage({
    searchParams: Promise.resolve({
      branch: "ganjlik",
      product: "greek-yogurt-500g",
      q: "yogurt",
      risk: "critical",
    }),
    testStaticMode: true,
  });
  const markup = renderToStaticMarkup(element);

  assert.match(markup, /Risk products/);
  assert.match(markup, /Search product or category/);
  assert.match(markup, /Rows in view/);
});
