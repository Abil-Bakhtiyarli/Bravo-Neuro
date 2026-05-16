import type { ReactNode } from "react";

import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export default function AppShell({ children, sidebar }: AppShellProps) {
  return (
    <main className="demo-surface-shell min-h-screen text-foreground lg:h-screen lg:overflow-hidden">
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
