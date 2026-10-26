import { useId } from "react";
import type { Tenant } from "@/lib/types";

/**
 * Shows the business's uploaded logo, or a placeholder mark until one is
 * uploaded in Branding settings (Stage 2).
 */
export function BrandMark({ tenant, size = 36 }: { tenant: Tenant; size?: number }) {
  const { logoUrl, businessName } = tenant.branding;
  // Each copy of the logo needs its own gradient ID, or a hidden copy
  // (e.g. the desktop sidebar on a phone) can blank out the visible one.
  const gid = `bm-g-${useId().replace(/:/g, "")}`;
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={`${businessName} logo`} width={size} height={size} className="rounded-xl object-contain" />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label={`${businessName} logo placeholder`} className="shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--brand)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
      {/* "in" arrow sweeping down, "out" arrow sweeping up: a clean loop */}
      <path d="M12 15.5a8.5 8.5 0 0 1 14.2-3.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M26.6 8.4v3.9h-3.9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 24.5a8.5 8.5 0 0 1-14.2 3.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M13.4 31.6v-3.9h3.9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* sparkle */}
      <path d="M20 16.2l1.1 2.7 2.7 1.1-2.7 1.1-1.1 2.7-1.1-2.7-2.7-1.1 2.7-1.1z" fill="#fff" />
    </svg>
  );
}

export function BrandWordmark({ tenant, compact = false }: { tenant: Tenant; compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <BrandMark tenant={tenant} />
      {!compact && (
        <div className="min-w-0 leading-tight">
          <div className="font-display text-[17px] font-semibold tracking-tight text-ink truncate">
            {tenant.branding.businessName}
          </div>
          {tenant.branding.tagline && (
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted truncate">
              {tenant.branding.tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
