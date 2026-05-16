import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import type { MonthlySavingsSeriesPoint } from "@/lib/types";

import MonthlySavingsChart from "./MonthlySavingsChart";

const series: MonthlySavingsSeriesPoint[] = [
  {
    branchId: "ganjlik",
    monthKey: "2026-04",
    monthLabel: "Apr",
    netSavedValueAzN: 44.8,
    recoveredValueAzN: 52.2,
    possibleLossAzN: 224.3,
    taskCount: 4,
  },
  {
    branchId: "ganjlik",
    monthKey: "2026-05",
    monthLabel: "May",
    netSavedValueAzN: 46.2,
    recoveredValueAzN: 53.9,
    possibleLossAzN: 239.8,
    taskCount: 4,
  },
];

test("MonthlySavingsChart renders title and latest branch summary", () => {
  const markup = renderToStaticMarkup(
    <MonthlySavingsChart branchName="Bravo Ganjlik" series={series} />,
  );

  assert.match(markup, /Monthly net saved value/);
  assert.match(markup, /Bravo Ganjlik/);
  assert.match(markup, /Six-month total/);
});

test("MonthlySavingsChart renders an explicit empty state", () => {
  const markup = renderToStaticMarkup(
    <MonthlySavingsChart branchName="Bravo Ganjlik" series={[]} />,
  );

  assert.match(markup, /Monthly net saved value/);
  assert.match(markup, /history is not available/i);
});
