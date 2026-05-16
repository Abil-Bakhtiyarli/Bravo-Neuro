import type { ReactNode } from "react";

import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export default function AppShell({ children, sidebar }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(241,245,249,0.92)_40%,_rgba(226,232,240,0.9)_100%)] text-foreground lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-0 lg:flex-row">
        {sidebar ?? <Sidebar />}
        <section className="min-w-0 flex-1 lg:min-h-0 lg:overflow-y-auto">
          <div className="mx-auto w-full max-w-[96rem] px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

export type { AppShellProps };
