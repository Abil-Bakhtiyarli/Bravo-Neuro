import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import BranchComparisonCard from "./BranchComparisonCard";

test("BranchComparisonCard renders all branches and marks the selected branch", () => {
  const markup = renderToStaticMarkup(
    <BranchComparisonCard
      comparisons={[
        {
          branchId: "ganjlik",
          branchName: "Bravo Ganjlik",
          protectedValueDisplay: "AZN 12.4",
          riskyProductsCount: 3,
          highestRiskLevel: "critical",
          topActionLabel: "Launch markdown today",
          isSelected: true,
        },
        {
          branchId: "may28",
          branchName: "Bravo 28 May",
          protectedValueDisplay: "AZN 9.8",
          riskyProductsCount: 2,
          highestRiskLevel: "high",
          topActionLabel: "Move stock today",
          isSelected: false,
        },
        {
          branchId: "yasamal",
          branchName: "Bravo Yasamal",
          protectedValueDisplay: "AZN 3.4",
          riskyProductsCount: 1,
          highestRiskLevel: "medium",
          topActionLabel: "Check reorder level",
          isSelected: false,
        },
      ]}
    />,
  );

  assert.match(markup, /Bravo Ganjlik/);
  assert.match(markup, /Bravo 28 May/);
  assert.match(markup, /Bravo Yasamal/);
  assert.match(markup, /Active/);
});
