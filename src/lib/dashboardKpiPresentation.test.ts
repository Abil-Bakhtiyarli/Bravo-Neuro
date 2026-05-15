import assert from "node:assert/strict";
import test from "node:test";

import { getDashboardData } from "./dashboardData";
import { buildDashboardKpiPresentationItems } from "./dashboardKpiPresentation";

test("buildDashboardKpiPresentationItems keeps the visible KPI strip to four ordered cards", () => {
  const dashboardData = getDashboardData("ganjlik");
  const items = buildDashboardKpiPresentationItems(dashboardData);

  assert.equal(items.length, 4);
  assert.deepEqual(
    items.map((item) => item.key),
    ["possible-loss", "recoverable-value", "risky-products", "tasks-today"],
  );
});

test("buildDashboardKpiPresentationItems excludes net saved value and keeps tasks visible", () => {
  const dashboardData = getDashboardData("ganjlik");
  const items = buildDashboardKpiPresentationItems(dashboardData);
  const tasksKpi = dashboardData.kpis.find((item) => item.key === "tasks-today");
  const dashboardKpiKeys = dashboardData.kpis.map((item) => item.key);

  assert.ok(tasksKpi);
  assert.ok(dashboardKpiKeys.includes("net-saved-value"));
  assert.equal(items.at(-1)?.key, "tasks-today");
  assert.equal(items.at(-1)?.numericValue, tasksKpi.value);
  assert.match(items.at(-1)?.helperText ?? "", /Bravo Ganjlik/i);
});
