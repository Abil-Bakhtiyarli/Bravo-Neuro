# Bravo Neuro

Bravo Neuro is a Next.js dashboard prototype for retail waste-risk decisions. This repo currently contains the Part 0 foundation only: app scaffold, UI stack, and a clean starter screen.

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
|       +-- types.ts                     (planned, not created yet)
|       +-- dataLoader.ts                (planned, not created yet)
|       +-- riskScore.ts                 (planned, not created yet)
|       +-- recommendationEngine.ts      (planned, not created yet)
|       +-- savings.ts                   (planned, not created yet)
|       +-- explanation.ts               (planned, not created yet)
|       \-- formatters.ts                (planned, not created yet)
+-- data/
|   +-- .gitkeep
|   +-- branches.json                   (planned, not created yet)
|   +-- products.json                   (planned, not created yet)
|   +-- inventory.json                  (planned, not created yet)
|   +-- sales_history.json              (planned, not created yet)
|   +-- discount_history.json           (planned, not created yet)
|   \-- waste_history.json              (planned, not created yet)
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
Part 1 and later will add domain data, types, risk scoring, recommendations, and API/server logic.
