"use client";

import { usePref, setPref } from "@/lib/client-stores";
import { usePathname } from "next/navigation";
import { currentTenant, brandStyle } from "@/lib/tenant";
import { Sidebar } from "./Sidebar";
import { MobileTopBar, MobileTabBar } from "./MobileNav";

const STORAGE_KEY = "ino.sidebarCollapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const tenant = currentTenant;
  const pathname = usePathname();
  // Remember the sidebar choice on this device (a convenience only).
  const collapsed = usePref(STORAGE_KEY, "0") === "1";
  const toggle = () => setPref(STORAGE_KEY, collapsed ? "0" : "1");

  return (
    <div style={brandStyle(tenant)} className="min-h-dvh bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <div className="flex">
        <Sidebar tenant={tenant} pathname={pathname} collapsed={collapsed} onToggle={toggle} />
        <div className="min-w-0 flex-1">
          <MobileTopBar tenant={tenant} />
          <main id="main" className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-4 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
      <MobileTabBar pathname={pathname} />
    </div>
  );
}
