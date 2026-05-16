import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import { getDashboardData } from "@/lib/dashboardData";

import ProductRiskDrawer, { ProductRiskDrawerContent } from "./ProductRiskDrawer";

const detail = getDashboardData("ganjlik").productDetailsById["greek-yogurt-500g"];

test("ProductRiskDrawer renders the selected product story when open", () => {
  assert.ok(detail);

  const markup = renderToStaticMarkup(
    <ProductRiskDrawerContent detail={detail} withinDialog={false} />,
  );

  assert.match(markup, /Greek Yogurt 500g/);
  assert.match(markup, /Risk score/);
  assert.match(markup, /Top drivers/);
  assert.match(markup, /Explanation/);
  assert.match(markup, /Recommended action/);
  assert.match(markup, /Launch markdown today/);
  assert.match(markup, /Base markdown/);
  assert.match(markup, /Savings comparison/);
  assert.match(markup, /Without action/);
  assert.match(markup, /With action/);
  assert.match(markup, /Action cost/);
  assert.match(markup, /Product detail/);
  assert.doesNotMatch(markup, /Product detail drawer/);
});

test("ProductRiskDrawer omits content when closed", () => {
  const markup = renderToStaticMarkup(
    <ProductRiskDrawer detail={detail ?? null} open={false} onOpenChange={() => undefined} />,
  );

  assert.doesNotMatch(markup, /Greek Yogurt 500g/);
  assert.doesNotMatch(markup, /Recommendation card/);
});
