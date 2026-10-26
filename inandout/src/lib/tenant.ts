import type { Tenant } from "./types";

/**
 * The business currently being shown.
 *
 * Stage 1: a single built-in business so the app has something to display.
 * Stage 2: this is loaded from the database for whoever is signed in, and
 * every business sets its own name, logo and colours during onboarding.
 */
export const currentTenant: Tenant = {
  id: "demo-in-and-out",
  slug: "in-and-out",
  category: "cleaning",
  branding: {
    businessName: "In and Out",
    tagline: "Cleaning Services",
    logoUrl: undefined,
    primaryColour: "#1d64d8",
    primaryInk: "#0b3b8c",
    primarySoft: "#e8f0fd",
    accentColour: "#0fa89a",
    accentSoft: "#e2f6f3",
  },
  contact: {
    phone: "020 0000 0000",
    email: "hello@example.com",
    area: "London",
  },
  vocabulary: { job: "clean", jobs: "cleans", worker: "cleaner", workers: "cleaners" },
};

/** Turns a business's brand colours into CSS variables for its workspace. */
export function brandStyle(tenant: Tenant): React.CSSProperties {
  const b = tenant.branding;
  return {
    "--brand": b.primaryColour,
    "--brand-ink": b.primaryInk,
    "--brand-soft": b.primarySoft,
    "--accent": b.accentColour,
    "--accent-soft": b.accentSoft,
  } as React.CSSProperties;
}
