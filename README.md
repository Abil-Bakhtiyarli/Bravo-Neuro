# Bravo Neuro

Bravo Neuro is a Next.js dashboard prototype for retail waste-risk decisions. The repo now contains the Part 0 foundation, the Part 1 seed data layer, the Part 2 enriched data loader, the Part 3 waste-risk scorer, the Part 4 recommendation engine, and the Part 5 savings calculator: app scaffold, UI stack, typed domain models, realistic seed data, import-time validation, branch-first loader helpers, a deterministic explainable scoring engine, primary-action recommendation logic for risky branch/product records, and AZN business-impact estimation for those recommendations.

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
|   |   \-- api/
|   |       +-- dashboard/route.ts        (planned, not created yet)
|   |       +-- recommendations/route.ts  (planned, not created yet)
|   |       \-- tasks/route.ts            (planned, not created yet)
|   +-- components/
|   |   +-- setup-progress-chart.tsx
|   |   +-- DashboardHeader.tsx          (planned, not created yet)
|   |   +-- KpiCards.tsx                 (planned, not created yet)
|   |   +-- RiskTable.tsx                (planned, not created yet)
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
|       +-- explanation.ts               (planned, not created yet)
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
|   \-- bravo-neuro-logo.svg            (planned, not created yet)
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
Parts 6 and later will add explanations and API/server data delivery.

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
