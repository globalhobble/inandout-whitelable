"use client";

import Link from "next/link";
import clsx from "clsx";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV, NAV_GROUPS, hrefFor, type NavItem } from "@/lib/navigation";
import type { Tenant } from "@/lib/types";
import { BrandWordmark, BrandMark } from "@/components/brand/BrandMark";

export function isActive(item: NavItem, pathname: string) {
  const href = hrefFor(item);
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({
  tenant,
  pathname,
  collapsed,
  onToggle,
}: {
  tenant: Tenant;
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={clsx(
        "sidebar-anim sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface lg:flex",
        collapsed ? "w-[76px]" : "w-[264px]",
      )}
      aria-label="Main navigation"
    >
      <div className={clsx("flex h-[72px] items-center border-b border-line-soft", collapsed ? "justify-center px-2" : "px-5")}>
        {collapsed ? <BrandMark tenant={tenant} /> : <BrandWordmark tenant={tenant} />}
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group} className="mb-4 last:mb-0">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted/80">{group}</div>
            )}
            {collapsed && <div className="mx-auto mb-2 h-px w-6 bg-line" aria-hidden />}
            <ul className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((item) => {
                const active = isActive(item, pathname);
                const Icon = item.icon;
                const soon = item.stage > 1;
                return (
                  <li key={item.slug}>
                    <Link
                      href={hrefFor(item)}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? `${item.label}${soon ? " (coming soon)" : ""}` : undefined}
                      className={clsx(
                        "group relative flex items-center gap-3 rounded-xl text-[14px] font-medium transition-colors",
                        collapsed ? "mx-auto size-11 justify-center" : "px-3 py-2",
                        active
                          ? "bg-brand-soft text-brand-ink"
                          : soon
                            ? "text-ink-soft/75 hover:bg-line-soft hover:text-ink"
                            : "text-ink-soft hover:bg-line-soft hover:text-ink",
                      )}
                    >
                      {active && !collapsed && (
                        <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" aria-hidden />
                      )}
                      <Icon size={18} strokeWidth={active ? 2.3 : 2} className={active ? "text-brand" : ""} aria-hidden />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {soon && (
                            <span className="rounded-md bg-line-soft px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-muted">
                              Soon
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={clsx("border-t border-line-soft p-3", collapsed && "flex justify-center")}>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className={clsx(
            "flex items-center gap-3 rounded-xl text-[13px] font-medium text-muted transition-colors hover:bg-line-soft hover:text-ink",
            collapsed ? "size-11 justify-center" : "w-full px-3 py-2",
          )}
        >
          {collapsed ? <PanelLeftOpen size={18} aria-hidden /> : <PanelLeftClose size={18} aria-hidden />}
          <span className={collapsed ? "sr-only" : ""}>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
        </button>
      </div>
    </aside>
  );
}
