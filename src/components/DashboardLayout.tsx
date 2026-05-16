import type { ReactNode } from "react";

export type DashboardLayoutProps = {
  topBar: ReactNode;
  kpiStrip: ReactNode;
  mainStory: ReactNode;
  secondarySection: ReactNode;
};

export default function DashboardLayout({
  topBar,
  kpiStrip,
  mainStory,
  secondarySection,
}: DashboardLayoutProps) {
  const hasSecondarySection = secondarySection !== null && secondarySection !== undefined;

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:p-5">
        {topBar}
      </section>

      <section className="min-w-0">{kpiStrip}</section>

      {hasSecondarySection ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(24rem,0.9fr)] xl:items-start">
          <section className="min-w-0">{mainStory}</section>
          <aside className="min-w-0">{secondarySection}</aside>
        </div>
      ) : (
        <section className="min-w-0">{mainStory}</section>
      )}
    </div>
  );
}
