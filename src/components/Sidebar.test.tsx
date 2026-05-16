import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import Sidebar from "./Sidebar";

test("Sidebar enables the live detail pages and keeps future sections disabled", () => {
  const markup = renderToStaticMarkup(<Sidebar pathnameOverride="/risk" />);

  assert.match(markup, /href="\/risk"/);
  assert.match(markup, /href="\/actions"/);
  assert.match(markup, /href="\/branches"/);
  assert.match(markup, /aria-current="page"/);
  assert.match(markup, /src="\/bravo-neuro-logo\.svg"/);
  assert.match(markup, /Live snapshot/);
  assert.match(markup, /Overview, risk, actions, and branches stay in one branch context/);
  assert.match(markup, /Soon/);
  assert.doesNotMatch(markup, /Demo Mode/);
});
