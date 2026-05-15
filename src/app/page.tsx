"use client";

import dynamic from "next/dynamic";
import { ArrowRight, ChartColumnIncreasing, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const SetupProgressChart = dynamic(
  () => import("@/components/setup-progress-chart"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/80 text-sm text-muted-foreground">
        Chart preview loads on the client.
      </div>
    ),
  }
);

const setupProgress = [
  { label: "Scaffold", value: 100 },
  { label: "UI stack", value: 100 },
  { label: "Data model", value: 0 },
  { label: "Risk engine", value: 0 },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(244,244,245,0.96)_45%,_rgba(228,228,231,1)_100%)] text-foreground">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="size-4" />
            Part 0 bootstrap complete
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Bravo Neuro
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Next.js foundation for the retail waste-risk dashboard.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                This starter validates the app shell, Tailwind, shadcn/ui,
                Lucide, and Recharts before Part 1 introduces data models and
                decision logic.
              </p>
            </div>
            <Button className="h-10 gap-2 px-4 text-sm">
              Start Part 1
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm shadow-black/5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Implementation readiness
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Setup progress
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <ChartColumnIncreasing className="size-3.5" />
                Recharts wired
              </div>
            </div>
            <div className="h-72 rounded-2xl bg-background/70 p-4">
              <SetupProgressChart data={setupProgress} />
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm shadow-black/5">
            <p className="text-sm font-medium text-muted-foreground">
              Current scope
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              What Part 0 includes
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
              <li className="rounded-2xl border border-border/70 bg-background/80 p-4">
                App Router, TypeScript, Tailwind, and pnpm are configured in
                the repo root.
              </li>
              <li className="rounded-2xl border border-border/70 bg-background/80 p-4">
                shadcn/ui, Lucide, and Recharts are installed and rendering in
                the starter screen.
              </li>
              <li className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-4">
                Branch data, risk scoring, recommendations, and API routes are
                intentionally deferred to Part 1 and later.
              </li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
