import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import { getDashboardData } from "@/lib/dashboardData";

import SavingsCard from "./SavingsCard";

const detail = getDashboardData("ganjlik").productDetailsById["greek-yogurt-500g"];

test("SavingsCard renders before and after comparison for actionable products", () => {
  assert.ok(detail);
  assert.ok(detail.recommendation);
  assert.ok(detail.savings);

  const markup = renderToStaticMarkup(
    <SavingsCard
      recommendation={detail.recommendation}
      savings={detail.savings}
      unitPriceAzN={detail.product.unitPrice}
    />,
  );

  assert.match(markup, /Savings comparison/);
  assert.match(markup, /Without action/);
  assert.match(markup, /With action/);
  assert.match(markup, /Recovered value/);
  assert.match(markup, /Action cost/);
  assert.match(markup, /Waste avoided/);
  assert.match(markup, /Method/);
});

test("SavingsCard keeps a dedicated empty state when savings data is missing", () => {
  const markup = renderToStaticMarkup(
    <SavingsCard recommendation={null} savings={null} unitPriceAzN={3.99} />,
  );

  assert.match(markup, /Savings comparison/);
  assert.match(markup, /not available for this product yet/);
});
