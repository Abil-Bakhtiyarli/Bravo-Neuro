# Bravo Neuro

Bravo Neuro is a Next.js dashboard prototype for retail waste-risk decisions. The repo now contains the Part 0 foundation, the Part 1 seed data layer, the Part 2 enriched data loader, the Part 3 waste-risk scorer, the Part 4 recommendation engine, the Part 5 savings calculator, the Part 6 explanation generator, the Part 7 server data layer, the Part 8 dashboard layout foundation, the Part 9 header and branch control, the Part 10 KPI card UI, the Part 11 KPI data wiring slice, the Part 12 risk table UI slice, and the Part 13 risk table data wiring slice: app scaffold, UI stack, typed domain models, realistic seed data, import-time validation, branch-first loader helpers, a deterministic explainable scoring engine, primary-action recommendation logic for risky branch/product records, AZN business-impact estimation for those recommendations, short manager-friendly explanations built from the top risk drivers plus action rationale, one stable JSON-safe dashboard payload layer for future UI consumption, a presentation-ready dashboard shell, an active URL-backed branch header, polished reusable KPI cards, live branch-aware KPI values wired from the canonical dashboard data contract while keeping tasks-today visible, a dedicated presentational risk table component with urgency badges and action framing, and the homepage risk table now fed directly from the canonical branch dashboard payload.

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
|   |   +-- RiskTable.tsx
|   |   +-- ProductRiskDrawer.tsx        (planned, not created yet)
|   |   +-- RecommendationCard.tsx       (planned, not created yet)
|   |   +-- DailyActionPlan.tsx          (planned, not created yet)
|   |   +-- BranchSelector.tsx           (planned, not created yet)
|   |   +-- SavingsCard.tsx              (planned, not created yet)
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
|       +-- dashboardData.ts
|       +-- dashboardData.test.ts
|       +-- dashboardKpiPresentation.ts
|       +-- dashboardKpiPresentation.test.ts
|       \-- formatters.ts                (planned, not created yet)
+-- data/
|   +-- .gitkeep
|   +-- branches.json
|   +-- products.json
|   +-- inventory.json
|   +-- sales_history.json
|   +-- discount_history.json
|   \-- waste_history.json
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
Part 11 is complete: `src/app/page.tsx` now resolves the selected branch on the server, loads the canonical branch dashboard payload from `src/lib/dashboardData.ts`, and maps the four visible KPI cards to live branch-aware values and copy through `src/lib/dashboardKpiPresentation.ts`, while intentionally keeping `tasks-today` visible and leaving risk-table, drawer, and task interaction work for later parts.
Part 12 is complete: `src/components/RiskTable.tsx` now provides the polished presentation surface for the risk table, including static filter shells, urgency styling, risk badges, and action labels.
Part 13 is complete: `src/app/page.tsx` now feeds `src/components/RiskTable.tsx` from the canonical branch-aware `riskTable` payload in `src/lib/dashboardData.ts`, so branch changes now update both KPI cards and risk rows from one server snapshot while keeping the table presentation-only.
Part 14 and later will add row interaction, drawer detail, task interaction, and only add route handlers if a public HTTP surface is still needed.

## Part 1 Seed Data

The seed dataset is designed for the hackathon story in the technical plan:

- 3 branches: Bravo Ganjlik, Bravo Yasamal, Bravo 28 May
- 8 products across dairy, bakery, fruits/vegetables, and drinks
- per-lot inventory records with expiry dates for expiry-driven risk logic
- sales, discount, and waste history aligned to the same branch/product pairs
- at least one critical expiry case, transfer-favorable case, reorder-reduction case, and low-risk case

`src/lib/seedData.ts` is the canonical raw seed import surface. It loads all JSON seed files, exports typed arrays, and runs lightweight import-time invariants for referential integrity and scenario coverage.

`src/lib/dataLoader.ts` is the canonical Part 2 access layer. It exposes branch-first helpers that join the seed datasets into enriched records, sort lots by expiry, and precompute stock/expiry fields needed by the next implementation parts.

`src/lib/riskScore.ts` is the canonical Part 3 scoring layer. It turns enriched branch/product records into deterministic risk assessments using the implementation-plan weights for expiry urgency, stock pressure, sales weakness, historical waste, and branch demand mismatch.

`src/lib/recommendationEngine.ts` is the canonical Part 4 decision layer. It takes scored branch/product records and returns one typed primary recommendation per eligible product with deterministic discount, transfer, reorder-adjustment, shelf-action, or investigation output.

`src/lib/savings.ts` is the canonical Part 5 value layer. It attaches deterministic AZN savings estimates to each recommendation using the chosen pragmatic P&L policy and exposes branch-level aggregation helpers for future KPI cards and API routes.

`src/lib/explanation.ts` is the canonical Part 6 explanation layer. It turns the top non-zero risk drivers and the selected recommendation into short summary text, readable driver highlights, and explicit action rationale for future product-detail and API payload use.

`src/lib/dashboardData.ts` is the canonical Part 7 server data layer. It exposes JSON-safe branch dashboard and product-detail builders so later UI work can consume one stable contract without reassembling business logic in components.

`src/components/DashboardLayout.tsx` and `src/app/page.tsx` are the canonical Part 8 layout foundation. They define the responsive dashboard shell and placeholder regions that later parts will replace with KPI cards, risk table rows, drawer content, and task actions.

`src/components/DashboardHeader.tsx` is the canonical Part 9 header and branch-control surface. It is intentionally the only client component in this slice: it updates visible branch state and the `?branch=` URL parameter while leaving KPI cards, table rows, action-plan content, and product-detail data wiring reserved for later parts.

`src/components/KpiCards.tsx` is the canonical KPI presentation surface. It remains presentation-only: Part 10 established the reusable card UI, and Part 11 now feeds it live branch-aware values, helper text, icons, and status badges without moving dashboard data logic into the component itself.

`src/components/RiskTable.tsx` is the canonical risk-table presentation surface. It remains presentation-only: Part 12 established the polished rows, risk/action visual mapping, and static control shells, and Part 13 now feeds it live branch `riskTable` data from `src/lib/dashboardData.ts`.
