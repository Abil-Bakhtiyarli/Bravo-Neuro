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
  { label: "Transfers", href: "/transfers", icon: ArrowRightLeft },
  { label: "Revenue Forecast", href: "/forecast", icon: TrendingUp },
  { label: "Branches", href: "/branches", icon: Store },
  { label: "AI Assistant", href: "/assistant", icon: Bot },
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
          <div className="flex min-w-0 flex-1 justify-center">
            <Image
              src="/bravo-neuro-logo.svg"
              alt="Bravo Neuro"
              width={1289}
              height={816}
              className="h-12 w-full max-w-[11.5rem] object-contain object-center"
              priority
            />
          </div>
          <span className="rounded-full border border-emerald-300/65 bg-emerald-100/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-900">
            Live
          </span>
        </div>
        <nav className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} mobile pathnameOverride={pathnameOverride} />
          ))}
        </nav>
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-border/90 bg-sidebar/96 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-full flex-col px-5 py-6">
          <div className="flex justify-center border-b border-border/90 pb-8">
            <Image
              src="/bravo-neuro-logo.svg"
              alt="Bravo Neuro"
              width={1289}
              height={816}
              className="h-24 w-full max-w-[13.5rem] object-contain object-center"
              priority
            />
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} pathnameOverride={pathnameOverride} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
