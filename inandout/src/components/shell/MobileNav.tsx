"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { LayoutGrid, X } from "lucide-react";
import { NAV, NAV_GROUPS, MOBILE_TABS, hrefFor, findNav } from "@/lib/navigation";
import type { Tenant } from "@/lib/types";
import { BrandWordmark } from "@/components/brand/BrandMark";
import { isActive } from "./Sidebar";

export function MobileTopBar({ tenant }: { tenant: Tenant }) {
  return (
    <div className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur lg:hidden">
      <BrandWordmark tenant={tenant} />
    </div>
  );
}

export function MobileTabBar({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tabs = MOBILE_TABS.map((s) => findNav(s)!).filter(Boolean);
  const moreActive = !tabs.some((t) => isActive(t, pathname));

  // Escape closes the sheet; choosing a section closes it too (see onClick below).
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {tabs.map((item) => {
            const active = isActive(item, pathname);
            const Icon = item.icon;
            return (
              <li key={item.slug}>
                <Link
                  href={hrefFor(item)}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                    active ? "text-brand" : "text-muted",
                  )}
                >
                  <span className={clsx("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-brand-soft")}>
                    <Icon size={20} strokeWidth={active ? 2.3 : 2} aria-hidden />
                  </span>
                  {item.short}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className={clsx(
                "flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                moreActive ? "text-brand" : "text-muted",
              )}
            >
              <span className={clsx("grid h-7 w-12 place-items-center rounded-full", moreActive && "bg-brand-soft")}>
                <LayoutGrid size={20} aria-hidden />
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="All sections">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="anim-fade absolute inset-0 bg-ink/40"
          />
          <div className="anim-sheet absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3 shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" aria-hidden />
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="font-display text-lg font-semibold">All sections</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-full bg-line-soft text-ink-soft"
                aria-label="Close"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            {NAV_GROUPS.map((group) => (
              <div key={group} className="mt-3">
                <div className="px-1 pb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted">{group}</div>
                <ul className="grid grid-cols-3 gap-2">
                  {NAV.filter((n) => n.group === group).map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item, pathname);
                    return (
                      <li key={item.slug}>
                        <Link
                          href={hrefFor(item)}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={clsx(
                            "flex h-[84px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 text-center text-[12px] font-semibold leading-tight",
                            active ? "border-brand/30 bg-brand-soft text-brand-ink" : "border-line text-ink-soft",
                          )}
                        >
                          <Icon size={20} aria-hidden className={active ? "text-brand" : "text-ink-soft"} />
                          {item.short}
                          {item.stage > 1 && <span className="text-[9.5px] font-semibold uppercase tracking-wide text-muted">Soon</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
