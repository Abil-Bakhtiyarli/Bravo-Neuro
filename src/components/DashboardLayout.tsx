import type { ReactNode } from "react";

export type DashboardLayoutProps = {
  topBar: ReactNode;
  kpiStrip: ReactNode;
  mainPane: ReactNode;
  sidePane: ReactNode;
  detailHint?: ReactNode;
};

export default function DashboardLayout({
  topBar,
  kpiStrip,
  mainPane,
  sidePane,
  detailHint,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(241,245,249,0.92)_40%,_rgba(226,232,240,0.9)_100%)] text-foreground">
      <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <section className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur sm:p-5">
          {topBar}
        </section>

        <section>{kpiStrip}</section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(20rem,0.95fr)] xl:items-start">
          <section className="min-w-0">{mainPane}</section>
          <aside className="min-w-0">{sidePane}</aside>
        </div>

        {detailHint ? (
          <section className="rounded-3xl border border-border/80 bg-card/88 p-4 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.5)] sm:p-5">
            {detailHint}
          </section>
        ) : null}
      </div>
    </main>
  );
}
