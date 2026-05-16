import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import ForecastPage from "./page";

test("Forecast page renders branch-aware revenue outlook", async () => {
  const element = await ForecastPage({
    searchParams: Promise.resolve({
      branch: "yasamal",
    }),
    testStaticMode: true,
  });
  const markup = renderToStaticMarkup(element);

  assert.match(markup, /Revenue forecast/i);
  assert.match(markup, /Four-week branch forecast/);
  assert.match(markup, /Bravo Yasamal/);
  assert.match(markup, /Forecast drivers/);
  assert.match(markup, /Projected revenue by category/);
});
