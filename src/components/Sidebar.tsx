"use client";

import {
  AlertTriangle,
  ArrowRightLeft,
  BadgePercent,
  Bot,
  LayoutDashboard,
  Store,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
};

const navItems: readonly NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Risk Products", href: "/risk", icon: AlertTriangle, disabled: true },
  { label: "Discount Actions", href: "/actions", icon: BadgePercent, disabled: true },
  { label: "Transfers", href: "/transfers", icon: ArrowRightLeft, disabled: true },
  { label: "Revenue Forecast", href: "/forecast", icon: TrendingUp, disabled: true },
  { label: "Branches", href: "/branches", icon: Store, disabled: true },
  { label: "AI Assistant", href: "/assistant", icon: Bot, disabled: true },
];

function NavLink({ item, mobile = false }: { item: NavItem; mobile?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  const sharedClassName = cn(
    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
    mobile ? "whitespace-nowrap" : "w-full",
    item.disabled
      ? "cursor-not-allowed border border-transparent text-muted-foreground/70"
      : isActive
        ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/80"
        : "text-foreground/78 hover:bg-background/75 hover:text-foreground",
  );

  if (item.disabled) {
    return (
      <div className={sharedClassName} aria-disabled="true">
        <Icon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1">{item.label}</span>
        <span className="rounded-full border border-border/80 bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Soon
        </span>
      </div>
    );
  }

  return (
    <Link href={item.href} className={sharedClassName} aria-current={isActive ? "page" : undefined}>
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1">{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <>
      <div className="border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.18em] text-foreground">BRAVO NEURO</p>
            <p className="text-xs text-muted-foreground">AI Retail Waste Control</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
            Demo Mode
          </span>
        </div>
        <nav className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} mobile />
          ))}
        </nav>
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-sidebar/96 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-full flex-col px-5 py-6">
          <div className="border-b border-border/70 pb-5">
            <p className="text-sm font-semibold tracking-[0.22em] text-foreground">BRAVO NEURO</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">AI Retail Waste Control</p>
          </div>

          <nav className="mt-5 flex flex-1 flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          <div className="border-t border-border/70 pt-5">
            <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/85 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Demo Mode
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-950/85">
                Homepage shell pivot is active. Detail pages land in later parts.
              </p>
            </div>
            <div className="mt-4 rounded-3xl border border-border/75 bg-background/92 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Session
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">Hackathon Demo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
