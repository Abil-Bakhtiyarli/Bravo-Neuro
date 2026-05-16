import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import { getAvailableBranchOptions, getDashboardData } from "@/lib/dashboardData";

import DetailPageHeader from "./DetailPageHeader";

test("DetailPageHeader renders the branch selector, subtitle, and live data surface", () => {
  const branches = getAvailableBranchOptions();
  const dashboardData = getDashboardData("ganjlik");
  const markup = renderToStaticMarkup(
    <DetailPageHeader
      branches={branches}
      selectedBranchId="ganjlik"
      title="Risk products"
      subtitle="Branch-level expiry, stock, and waste-risk queue."
      generatedAt={dashboardData.generatedAt}
      preservedSearchParamKeys={["q", "risk"]}
      staticMode
    />,
  );

  assert.match(markup, /Risk products/);
  assert.match(markup, /Branch-level expiry, stock, and waste-risk queue/);
  assert.match(markup, /Branch/);
  assert.match(markup, /Live data/);
  assert.doesNotMatch(markup, /Demo Mode/);
});
