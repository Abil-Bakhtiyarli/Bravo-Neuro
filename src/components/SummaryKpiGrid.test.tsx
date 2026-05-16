import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import { getDashboardData } from "@/lib/dashboardData";
import { buildDashboardKpiPresentationItems } from "@/lib/dashboardKpiPresentation";

import SummaryKpiGrid from "./SummaryKpiGrid";

test("SummaryKpiGrid renders the four overview KPIs without the legacy footer copy", () => {
  const dashboardData = getDashboardData("ganjlik");
  const markup = renderToStaticMarkup(
    <SummaryKpiGrid
      items={buildDashboardKpiPresentationItems(dashboardData).filter(
        (item) =>
          item.key === "risky-products" ||
          item.key === "net-saved-value" ||
          item.key === "possible-loss" ||
          item.key === "tasks-today",
      )}
    />,
  );

  assert.match(markup, /Risky products/);
  assert.match(markup, /Net saved value/);
  assert.match(markup, /Possible waste/);
  assert.match(markup, /Tasks today/);
  assert.doesNotMatch(markup, /Branch KPI/);
  assert.doesNotMatch(markup, /Synced with the current branch snapshot/);
});
