# Bravo Neuro

Bravo Neuro is a Next.js dashboard prototype for retail waste-risk decisions. The repo now contains the Part 0 foundation and the Part 1 data layer: app scaffold, UI stack, typed domain models, realistic seed data, and a typed import module that verifies the seed files are internally consistent.

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
|       +-- dataLoader.ts                (planned, not created yet)
|       +-- riskScore.ts                 (planned, not created yet)
|       +-- recommendationEngine.ts      (planned, not created yet)
|       +-- savings.ts                   (planned, not created yet)
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
Parts 2 and later will add joined branch/product records, risk scoring, recommendations, savings logic, explanations, and API/server data delivery.

## Part 1 Seed Data

The seed dataset is designed for the hackathon story in the technical plan:

- 3 branches: Bravo Ganjlik, Bravo Yasamal, Bravo 28 May
- 8 products across dairy, bakery, fruits/vegetables, and drinks
- per-lot inventory records with expiry dates for expiry-driven risk logic
- sales, discount, and waste history aligned to the same branch/product pairs
- at least one critical expiry case, transfer-favorable case, reorder-reduction case, and low-risk case

`src/lib/seedData.ts` is the canonical import surface for Part 2 onward. It loads all JSON seed files, exports typed arrays, and runs lightweight import-time invariants for referential integrity and scenario coverage.
