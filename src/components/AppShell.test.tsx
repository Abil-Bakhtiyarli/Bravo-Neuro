import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import AppShell from "@/components/AppShell";

test("AppShell renders provided content inside the main shell", () => {
  const markup = renderToStaticMarkup(
    <AppShell sidebar={<aside>Custom sidebar</aside>}>
      <section>Dashboard content</section>
    </AppShell>,
  );

  assert.match(markup, /Custom sidebar/);
  assert.match(markup, /Dashboard content/);
  assert.match(markup, /max-w-\[96rem\]/);
});
