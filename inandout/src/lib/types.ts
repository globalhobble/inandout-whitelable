/**
 * Core data shapes.
 *
 * These mirror the database tables planned for Stage 2–3. Every record that
 * belongs to a business carries `tenantId`, which is how one business's data
 * is kept apart from another's (enforced later by Supabase Row Level Security,
 * not just by the interface).
 *
 * Money is always stored in pence (integers) to avoid rounding errors.
 */

export type TenantId = string;

export type BusinessCategory =
  | "cleaning"
  | "building"
  | "electrical"
  | "plumbing"
  | "gardening"
  | "decorating"
  | "handyman"
  | "other";

export interface TenantBranding {
  businessName: string;
  tagline?: string;
  /** Uploaded logo URL. When empty, the built-in placeholder mark is shown. */
  logoUrl?: string;
  primaryColour: string;
  primaryInk: string;
  primarySoft: string;
  accentColour: string;
  accentSoft: string;
}

export interface Tenant {
  id: TenantId;
  slug: string;
  category: BusinessCategory;
  branding: TenantBranding;
  contact: { phone: string; email: string; area: string };
  /** Words this trade uses, so the app isn't hard-coded around cleaning. */
  vocabulary: { job: string; jobs: string; worker: string; workers: string };
}

export type JobStatus =
  | "new_enquiry"
  | "awaiting_quote"
  | "quote_sent"
  | "awaiting_booking"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "invoiced"
  | "paid"
  | "cancelled";

export interface TeamMember {
  id: string;
  tenantId: TenantId;
  name: string;
  initials: string;
  role: "owner" | "manager" | "staff";
  colour: string;
}

export interface Customer {
  id: string;
  tenantId: TenantId;
  name: string;
  area: string;
  isRepeat: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  tenantId: TenantId;
  customerId: string;
  serviceName: string;
  start: string; // ISO date-time
  durationMins: number;
  assigneeId?: string;
  status: Extract<JobStatus, "scheduled" | "in_progress" | "completed" | "cancelled">;
  postcodeArea: string;
  valuePence: number;
  note?: string;
}

export interface Enquiry {
  id: string;
  tenantId: TenantId;
  name: string;
  serviceName: string;
  receivedAt: string;
  channel: "Booking page" | "Phone" | "Email" | "Referral";
  message: string;
}

export interface Quote {
  id: string;
  tenantId: TenantId;
  number: string;
  customerId: string;
  title: string;
  totalPence: number;
  sentAt: string;
  expiresAt: string;
}

export interface Invoice {
  id: string;
  tenantId: TenantId;
  number: string;
  customerId: string;
  totalPence: number;
  amountPaidPence: number;
  issuedAt: string;
  dueAt: string;
}

export interface ActivityEvent {
  id: string;
  tenantId: TenantId;
  at: string;
  actor: string;
  kind: "booking" | "payment" | "quote" | "job" | "customer" | "enquiry";
  text: string;
}

export interface MonthlyRevenue {
  month: string; // e.g. "May"
  invoicedPence: number;
  collectedPence: number;
}
