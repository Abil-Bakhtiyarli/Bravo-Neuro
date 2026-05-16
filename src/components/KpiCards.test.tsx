import assert from "node:assert/strict";
import test from "node:test";

import { AlertTriangle, TrendingUp } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

import KpiCards, { type KpiCardItem } from "./KpiCards";

const items: KpiCardItem[] = [
  {
    key: "possible-loss",
    label: "Possible waste",
    displayValue: "AZN 12.0",
    helperText: "Exposure helper text.",
    statusBadge: "Exposure",
    icon: AlertTriangle,
    accentTone: "warning",
  },
  {
    key: "net-saved-value",
    label: "Net saved value",
    displayValue: "AZN 8.4",
    helperText: "Net helper text.",
    statusBadge: "Net gain",
    icon: TrendingUp,
    accentTone: "success",
  },
];

test("KpiCards renders the default grid presentation", () => {
  const markup = renderToStaticMarkup(<KpiCards items={items} />);

  assert.match(markup, /xl:grid-cols-4/);
  assert.match(markup, /Possible waste/);
  assert.match(markup, /Net saved value/);
  assert.match(markup, /Synced with the current branch snapshot/);
});

test("KpiCards supports a vertical rail presentation", () => {
  const markup = renderToStaticMarkup(<KpiCards items={items} orientation="rail" />);

  assert.match(markup, /xl:grid-cols-1/);
  assert.match(markup, /min-h-\[10\.75rem\]/);
  assert.doesNotMatch(markup, /xl:grid-cols-4/);
});
