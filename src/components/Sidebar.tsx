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
import Image from "next/image";
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
  { label: "Risk Products", href: "/risk", icon: AlertTriangle },
  { label: "Discount Actions", href: "/actions", icon: BadgePercent },
  { label: "Transfers", href: "/transfers", icon: ArrowRightLeft, disabled: true },
  { label: "Revenue Forecast", href: "/forecast", icon: TrendingUp, disabled: true },
  { label: "Branches", href: "/branches", icon: Store },
  { label: "AI Assistant", href: "/assistant", icon: Bot, disabled: true },
];

function NavLink({
  item,
  mobile = false,
  pathnameOverride,
}: {
  item: NavItem;
  mobile?: boolean;
  pathnameOverride?: string;
}) {
  const pathnameFromRouter = usePathname();
  const pathname = pathnameOverride ?? pathnameFromRouter;
  const isActive = pathname === item.href;
  const Icon = item.icon;

  const sharedClassName = cn(
    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200",
    mobile ? "whitespace-nowrap" : "w-full",
    item.disabled
      ? "cursor-not-allowed border border-transparent text-muted-foreground/70"
      : isActive
        ? "border border-emerald-300/65 bg-emerald-100/55 text-emerald-950 shadow-[0_12px_24px_-22px_rgba(5,150,105,0.28)] ring-1 ring-emerald-200/50"
        : "text-foreground/78 hover:-translate-y-0.5 hover:border hover:border-border/85 hover:bg-muted/72 hover:text-foreground",
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

type SidebarProps = {
  pathnameOverride?: string;
};

export default function Sidebar({ pathnameOverride }: SidebarProps) {
  return (
    <>
      <div className="border-b border-border/90 bg-sidebar/94 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Image
              src="/bravo-neuro-logo.svg"
              alt="Bravo Neuro"
              width={1289}
              height={816}
              className="h-8 w-auto"
              priority
            />
          </div>
          <span className="rounded-full border border-emerald-300/65 bg-emerald-100/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-900">
            Live
          </span>
        </div>
        <nav className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} mobile pathnameOverride={pathnameOverride} />
          ))}
        </nav>
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-border/90 bg-sidebar/96 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-full flex-col px-5 py-6">
          <div className="border-b border-border/90 pb-5">
            <Image
              src="/bravo-neuro-logo.svg"
              alt="Bravo Neuro"
              width={1289}
              height={816}
              className="h-11 w-auto"
              priority
            />
          </div>

          <nav className="mt-5 flex flex-1 flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} pathnameOverride={pathnameOverride} />
            ))}
          </nav>

          <div className="border-t border-border/90 pt-5">
            <div className="rounded-3xl border border-emerald-300/70 bg-emerald-50/65 p-4 shadow-[0_14px_28px_-26px_rgba(5,150,105,0.18)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Live snapshot
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-950/85">
                Overview, risk, actions, and branches stay in one branch context.
              </p>
            </div>
            <div className="demo-card mt-4 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Session
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">Hackathon build</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
