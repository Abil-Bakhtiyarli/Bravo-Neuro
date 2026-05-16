# Bravo Neuro

Bravo Neuro is a Next.js dashboard prototype for retail waste-risk decisions. The repo now contains the Part 0 foundation, the Part 1 seed data layer, the Part 2 enriched data loader, the Part 3 waste-risk scorer, the Part 4 recommendation engine, the Part 5 savings calculator, the Part 6 explanation generator, the Part 7 server data layer, the Part 8 dashboard layout foundation, the Part 9 header and branch control, the Part 10 KPI card UI, the Part 11 KPI data wiring slice, the Part 12 risk table UI slice, the Part 13 risk table data wiring slice, the Part 14 interaction layer, the Part 15 product detail drawer, the Part 16 recommendation card, the Part 17 savings comparison card, the Part 18 daily action plan, and the Part 19 demo polish pass: app scaffold, UI stack, typed domain models, realistic seed data, import-time validation, branch-first loader helpers, a deterministic explainable scoring engine, primary-action recommendation logic for risky branch/product records, AZN business-impact estimation for those recommendations, short manager-friendly explanations built from the top risk drivers plus action rationale, one stable JSON-safe dashboard payload layer for future UI consumption, a presentation-ready dashboard shell, an active URL-backed branch header, a live monthly net-saved chart in the right rail, five live branch-aware KPI cards, a left-column manager handoff queue followed by the risk table, URL-backed row selection plus real search and risk filtering, a real product drawer with preloaded detail payloads, a dedicated action-specific recommendation card, a dedicated before/after savings comparison card with cost treatment and methodology copy, a recommendation-backed task rail with local accept/complete persistence and checklist guidance, and a polished branch-consistent copy/empty-state layer, all without adding route handlers.

## Repo Structure

Page 4 of the implementation plan uses root-level `app/`, `components/`, and `lib/` folders. This repo uses the Next.js `src/` layout instead, so the planned structure maps to `src/app`, `src/components`, and `src/lib` here.

```text
bravo-neuro/
+-- src/
|   +-- app/
|   |   +-- layout.tsx
|   |   +-- page.tsx
|   |   +-- globals.css
|   |   +-- favicon.ico
|   |   \-- api/                          (optional later thin wrappers, not created yet)
|   +-- components/
|   |   +-- DashboardLayout.tsx
|   |   +-- setup-progress-chart.tsx      (legacy Part 0 artifact, no longer used by `/`)
|   |   +-- DashboardHeader.tsx
|   |   +-- KpiCards.tsx
|   |   +-- MonthlySavingsChart.tsx
|   |   +-- RiskTable.tsx
|   |   +-- RiskTableExperience.tsx
|   |   +-- ProductRiskDrawer.tsx
|   |   +-- RecommendationCard.tsx
|   |   +-- DailyActionPlan.tsx
|   |   +-- BranchSelector.tsx           (planned, not created yet)
|   |   +-- SavingsCard.tsx
|   |   \-- ui/
|   |       \-- button.tsx
|   \-- lib/
|       +-- utils.ts
|       +-- types.ts
|       +-- seedData.ts
|       +-- dataLoader.ts
|       +-- dataLoader.test.ts
|       +-- riskScore.ts
|       +-- riskScore.test.ts
|       +-- recommendationEngine.ts
|       +-- recommendationEngine.test.ts
|       +-- savings.ts
|       +-- savings.test.ts
|       +-- explanation.ts
|       +-- explanation.test.ts
|       +-- actionPlan.ts
|       +-- actionPlan.test.ts
|       +-- dashboardData.ts
|       +-- dashboardData.test.ts
|       +-- dashboardKpiPresentation.ts
|       +-- dashboardKpiPresentation.test.ts
|       +-- riskTableInteraction.ts
|       +-- riskTableInteraction.test.ts
|       +-- savingsComparison.ts
|       \-- formatters.ts                (planned, not created yet)
+-- data/
|   +-- .gitkeep
|   +-- branches.json
|   +-- products.json
|   +-- inventory.json
|   +-- sales_history.json
|   +-- discount_history.json
|   +-- waste_history.json
|   \-- monthly_savings_history.json
+-- public/
|   +-- file.svg
|   +-- globe.svg
|   +-- next.svg
|   +-- vercel.svg
|   +-- window.svg
|   \-- bravo-neuro-logo.svg
+-- README.md
+-- AGENTS.md
+-- CLAUDE.md
+-- components.json
+-- eslint.config.mjs
+-- next-env.d.ts
+-- next.config.ts
+-- package.json
+-- pnpm-lock.yaml
+-- pnpm-workspace.yaml
+-- postcss.config.mjs
\-- tsconfig.json
```

## Progress

Part 0 is complete: Next.js, Tailwind, shadcn/ui, Lucide, and Recharts are installed and running.
Part 1 is complete: typed domain models and realistic demo seed data are in place under `src/lib/types.ts`, `src/lib/seedData.ts`, and `data/*.json`.
Part 2 is complete: `src/lib/dataLoader.ts` returns enriched branch/product records with aggregated inventory, derived expiry/stock metrics, optional discount history, waste history, and cross-branch sales snapshots.
Part 3 is complete: `src/lib/riskScore.ts` calculates weighted waste-risk component scores, rounded risk levels, and the top machine-readable drivers for each enriched product record.
Part 4 is complete: `src/lib/recommendationEngine.ts` turns scored records into one clear primary action per medium/high/critical product, covering discount, transfer, reorder adjustment, shelf action, and investigation flows.
Part 5 is complete: `src/lib/savings.ts` converts recommendations into deterministic AZN impact estimates for possible loss, recovered value, and net saved value, and it aggregates those totals at branch level for later dashboard/API use.
Part 6 is complete: `src/lib/explanation.ts` converts ordered risk drivers plus the chosen recommendation into deterministic manager-friendly explanation text for future API and drawer/detail surfaces.
Part 7 is complete: `src/lib/dashboardData.ts` composes branch loading, scoring, recommendations, savings, and explanations into stable branch dashboard and product-detail payloads for future Server Components or optional API wrappers.
Part 8 is complete: `src/app/page.tsx` and `src/components/DashboardLayout.tsx` now provide a responsive static dashboard shell with a top bar, KPI strip, risk-table region, action-plan side rail, and reserved product-detail surface, while intentionally keeping data connection and deeper interaction logic for later parts.
Part 9 is complete: `src/components/DashboardHeader.tsx` provides the active header, selected branch card, demo date, daily status text, and URL-backed branch selector. The `branch` query parameter now controls header state and safely falls back to the default branch for invalid values.
Part 10 is complete: `src/components/KpiCards.tsx` now provides a reusable KPI strip with polished mock values, icons, helper text, and status badges while intentionally keeping the content static until Part 11 connects branch-aware dashboard data.
Part 11 is complete: `src/app/page.tsx` now resolves the selected branch on the server, loads the canonical branch dashboard payload from `src/lib/dashboardData.ts`, and maps the visible KPI cards to live branch-aware values and copy through `src/lib/dashboardKpiPresentation.ts`, while keeping `tasks-today` visible and leaving risk-table, drawer, and task interaction work for later parts.
Part 12 is complete: `src/components/RiskTable.tsx` now provides the polished presentation surface for the risk table, including static filter shells, urgency styling, risk badges, and action labels.
Part 13 is complete: `src/app/page.tsx` now feeds `src/components/RiskTable.tsx` from the canonical branch-aware `riskTable` payload in `src/lib/dashboardData.ts`, so branch changes now update both KPI cards and risk rows from one server snapshot while keeping the table presentation-only.
Part 14 is complete: `src/components/RiskTable.tsx` and `src/lib/riskTableInteraction.ts` provide clickable URL-backed row selection, real search and risk-level filtering, and invalid-selection cleanup across branch/filter changes.
Part 15 is complete: `src/components/RiskTableExperience.tsx`, `src/components/ProductRiskDrawer.tsx`, `src/app/page.tsx`, and `src/lib/dashboardData.ts` now preload recommendation-backed product detail payloads into the server snapshot and attach a real Base UI drawer to the existing `product` query param, showing risk score, top drivers, explanation, recommendation summary, and savings summary without route handlers.
Part 16 is complete: `src/components/RecommendationCard.tsx` and `src/components/ProductRiskDrawer.tsx` now turn the drawer recommendation summary into a dedicated action card with action-type framing, manager-ready emphasis, and type-specific metrics for discount, transfer, reorder adjustment, shelf action, and investigation flows while leaving savings and task execution for later parts.
Part 17 is complete: `src/components/SavingsCard.tsx`, `src/components/ProductRiskDrawer.tsx`, `src/lib/savingsComparison.ts`, and `src/lib/savings.ts` now turn the old savings summary block into a dedicated before/after comparison card with explicit recovered value, action cost, residual exposure, waste avoided, and methodology copy, while also fixing transfer cost semantics so the UI still reflects one shared savings calculator.
Part 18 is complete: `src/components/DailyActionPlan.tsx`, `src/app/page.tsx`, `src/lib/actionPlan.ts`, `src/lib/dashboardData.ts`, and `src/lib/types.ts` now replace the static side rail with a real recommendation-backed manager queue that stays branch-scoped, priority-ranked, locally persistent across refreshes, and wired to the existing product drawer flow through the `product` query parameter while keeping all task state route-free.
Part 19 is complete: `data/monthly_savings_history.json`, `src/lib/seedData.ts`, `src/lib/dashboardData.ts`, `src/lib/types.ts`, `src/components/MonthlySavingsChart.tsx`, `src/app/page.tsx`, and the active presentation surfaces now add a real branch-scoped six-month net-saved chart above the KPI rail, validate seeded monthly history, and polish stale copy, badges, spacing, and empty states so the demo feels branch-aware instead of staged.

## UI Improvement Track

The parts below are a separate post-Part-19 demo UI improvement sequence from the updated Codex plan document. They do not replace the original Part 0-19 implementation history above.

Part 00 is complete as a baseline checkpoint for the UI improvement track: work continues on the `codex-demo-ui-polish` branch, `node_modules` was already present so no install was needed, `corepack.cmd pnpm build` passes, `corepack.cmd pnpm lint` currently fails on two pre-existing React hook lint errors in `src/components/DailyActionPlan.tsx` and `src/components/MonthlySavingsChart.tsx`, the local dashboard responds at `/`, and the UI refactor intentionally stops here without mixing baseline fixes into later polish parts. A baseline screenshot was attempted for `.codex-tmp/`, but the current local capture environment did not produce a file, so that artifact still needs to be captured before the visual before/after comparison is complete.

Part 01 is complete as the global demo polish helper pass: `src/app/globals.css` now defines reusable `animate-demo-fade-up`, `animate-demo-slide-in-right`, `animate-demo-soft-pulse-critical`, and `animate-demo-delay-1` through `animate-demo-delay-4` helpers, plus optional `demo-card`, `demo-section-title`, and `demo-muted-label` utility classes for later UI improvement parts. This pass includes one shared `prefers-reduced-motion` override block, adds no dependencies, and intentionally avoids layout, component-structure, query-param, or business-logic changes.

Part 02 is complete as the demo-first page layout restructure: `src/components/DashboardLayout.tsx` now exposes full-width header and KPI strip regions plus a main story grid, `src/app/page.tsx` now promotes only the three demo KPIs to the top, and `src/components/DashboardDemoExperience.tsx` now centralizes the shared URL-backed product selection, risk filtering, and deeper proof wiring across the action queue, selected-product panel, watchlist, monthly savings chart, and optional detail drawer. This pass preserves the existing server-driven dashboard snapshot, branch query behavior, task persistence, and `src/lib` business logic while moving secondary proof lower so it no longer competes with the first-screen story.

Part 03 is complete as the selected-product and modal refactor pass: `src/components/DashboardDemoExperience.tsx` now keeps the selected-product panel alone in the right desktop column with `xl` sticky positioning, moves `src/components/MonthlySavingsChart.tsx` below `src/components/RiskTable.tsx` as a full-width section, and preserves the existing URL-backed product-selection plus open-detail flow. `src/components/ProductRiskDrawer.tsx` now presents product proof in a centered wide modal instead of a right-edge sheet, while `src/components/DailyActionPlan.tsx`, `src/components/RiskTable.tsx`, and the component tests update stale drawer copy and cover the new layout/modal presentation. This pass also clears the previously documented React hook lint failures in `src/components/DailyActionPlan.tsx` and `src/components/MonthlySavingsChart.tsx`, so `corepack.cmd pnpm lint`, `corepack.cmd pnpm test`, and `corepack.cmd pnpm build` now all pass.



Execution sequence:

1. Refactor `src/components/DashboardDemoExperience.tsx` so the main demo grid stays two-column on desktop, keeps the selected-product panel alone in the right column, applies `xl` sticky positioning to that panel, and moves `MonthlySavingsChart` below `RiskTable` as a separate full-width proof section.
2. Preserve the current selection contract by keeping `getVisibleSelectedProductId`, `updateRiskTableSearchParams`, and the existing URL-backed selection cleanup logic unchanged, while ensuring the open-detail action still targets the currently selected product.
3. Convert `src/components/ProductRiskDrawer.tsx` from a right-edge sheet mental model to a centered wide modal using the existing Base UI dialog primitives, keeping the current detail payload, close behavior, scroll containment, and recommendation/savings proof sections.
4. Tighten surrounding component copy so `DailyActionPlan` and `RiskTable` reference product detail as a modal/detail surface rather than a drawer, and remove any stale language that conflicts with the new centered presentation.
5. Clear the React hook lint issues in `src/components/DailyActionPlan.tsx` and `src/components/MonthlySavingsChart.tsx` without changing behavior, then extend or update component tests so the layout order, sticky selected-product panel, and modal wording are covered.

Acceptance criteria:

- The selected-product panel is the only right-column story block on desktop and remains visible while the user scans the queue/watchlist.
- `MonthlySavingsChart` no longer competes with the first-screen story and appears below the watchlist as secondary proof.
- Opening product detail shows a centered modal, not a right-edge drawer/sheet.
- Query-backed selection, filtering, branch switching, and task persistence still behave the same.
- `corepack.cmd pnpm lint`, `corepack.cmd pnpm test`, and `corepack.cmd pnpm build` pass after the refactor.

## Part 1 Seed Data

The seed dataset is designed for the hackathon story in the technical plan:

- 3 branches: Bravo Ganjlik, Bravo Yasamal, Bravo 28 May
- 8 products across dairy, bakery, fruits/vegetables, and drinks
- per-lot inventory records with expiry dates for expiry-driven risk logic
- sales, discount, and waste history aligned to the same branch/product pairs
- monthly branch savings history aligned to the same branch personas
- at least one critical expiry case, transfer-favorable case, reorder-reduction case, and low-risk case

`src/lib/seedData.ts` is the canonical raw seed import surface. It loads all JSON seed files, exports typed arrays, and runs lightweight import-time invariants for referential integrity and scenario coverage.

`src/lib/dataLoader.ts` is the canonical Part 2 access layer. It exposes branch-first helpers that join the seed datasets into enriched records, sort lots by expiry, and precompute stock/expiry fields needed by the next implementation parts.

`src/lib/riskScore.ts` is the canonical Part 3 scoring layer. It turns enriched branch/product records into deterministic risk assessments using the implementation-plan weights for expiry urgency, stock pressure, sales weakness, historical waste, and branch demand mismatch.

`src/lib/recommendationEngine.ts` is the canonical Part 4 decision layer. It takes scored branch/product records and returns one typed primary recommendation per eligible product with deterministic discount, transfer, reorder-adjustment, shelf-action, or investigation output.

`src/lib/savings.ts` is the canonical Part 5 value layer. It attaches deterministic AZN savings estimates to each recommendation using the chosen pragmatic P&L policy and exposes branch-level aggregation helpers for future KPI cards and API routes.

`src/lib/explanation.ts` is the canonical Part 6 explanation layer. It turns the top non-zero risk drivers and the selected recommendation into short summary text, readable driver highlights, and explicit action rationale for future product-detail and API payload use.

`src/lib/dashboardData.ts` is the canonical Part 7 server data layer. It exposes JSON-safe branch dashboard and product-detail builders so later UI work can consume one stable contract without reassembling business logic in components.

`src/components/DashboardLayout.tsx` and `src/app/page.tsx` are the canonical Part 8 layout foundation. They define the responsive dashboard shell and placeholder regions that later parts will replace with KPI cards, risk table rows, drawer content, and task actions.

`src/components/DashboardHeader.tsx` is the canonical Part 9 header and branch-control surface. It keeps branch switching URL-backed and now clears stale product selection when the branch changes, while leaving KPI computation in the server page and deeper drawer/task logic for later parts.

`src/components/KpiCards.tsx` is the canonical KPI presentation surface. It remains presentation-only: Part 10 established the reusable card UI, Part 11 feeds it live branch-aware values, helper text, icons, and status badges, and the current layout now supports both the original grid treatment and the right-side vertical KPI rail without moving dashboard data logic into the component itself.

`src/components/RiskTable.tsx`, `src/components/RiskTableExperience.tsx`, `src/components/ProductRiskDrawer.tsx`, and `src/lib/riskTableInteraction.ts` are the canonical Parts 14-15 risk interaction surface. Part 12 established the polished rows, Part 13 fed them from the live branch `riskTable` payload, Part 14 added client-side URL-backed selection plus real query/risk filtering, and Part 15 now turns that same selection into a real overlay drawer backed by preloaded `productDetailsById` data from `src/lib/dashboardData.ts`.

`src/lib/actionPlan.ts`, `src/components/DailyActionPlan.tsx`, and the enriched `actionPlan` payload in `src/lib/dashboardData.ts` are the canonical Part 18 manager workflow surface. They turn each recommendation into one ranked parent task with action-specific checklist guidance, expose the queue to the page as serializable server data, and let the client layer persist `pending -> accepted -> completed` status locally per branch without introducing route handlers or a database. The current client storage namespace is `bravo-neuro:task-status:v2`, which resets stale older persisted queue states instead of replaying them forever.

`data/monthly_savings_history.json`, `src/lib/seedData.ts`, `src/lib/dashboardData.ts`, and `src/components/MonthlySavingsChart.tsx` are the canonical Part 19 branch-history surface. They add one validated six-month net-saved series per branch, preload that series into the server snapshot, and render it as the right-rail chart above the KPI cards so branch switching updates the full story together.
