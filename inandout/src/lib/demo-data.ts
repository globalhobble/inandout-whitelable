/**
 * DEMONSTRATION DATA
 * ------------------
 * Everything in this file is made up so the dashboard has something to show
 * before the database is connected. People, addresses and amounts are fictional.
 *
 * In Stage 2–3 each `get…` call below is replaced by a database query scoped to
 * the signed-in business. The shapes (see ./types.ts) stay the same, so the
 * dashboard components don't need rewriting.
 */
import type {
  ActivityEvent,
  Booking,
  Customer,
  Enquiry,
  Invoice,
  JobStatus,
  MonthlyRevenue,
  Quote,
  TeamMember,
} from "./types";

export const IS_DEMO = true;

const T = "demo-in-and-out";

export const team: TeamMember[] = [
  { id: "tm1", tenantId: T, name: "Amara Okafor", initials: "AO", role: "manager", colour: "#1d64d8" },
  { id: "tm2", tenantId: T, name: "Dan Hughes", initials: "DH", role: "staff", colour: "#0fa89a" },
  { id: "tm3", tenantId: T, name: "Priya Shah", initials: "PS", role: "staff", colour: "#5b4cc4" },
  { id: "tm4", tenantId: T, name: "Tom Byrne", initials: "TB", role: "staff", colour: "#b45f06" },
];

export const customers: Customer[] = [
  { id: "c1", tenantId: T, name: "Sarah Mitchell", area: "Clapham", isRepeat: true, createdAt: "2026-02-11" },
  { id: "c2", tenantId: T, name: "Hollis & Grant Lettings", area: "Brixton", isRepeat: true, createdAt: "2025-11-03" },
  { id: "c3", tenantId: T, name: "James Adeyemi", area: "Peckham", isRepeat: false, createdAt: "2026-10-02" },
  { id: "c4", tenantId: T, name: "Northcote Dental", area: "Battersea", isRepeat: true, createdAt: "2026-01-20" },
  { id: "c5", tenantId: T, name: "Ellie Turner", area: "Balham", isRepeat: true, createdAt: "2026-04-14" },
  { id: "c6", tenantId: T, name: "Marcus Webb", area: "Streatham", isRepeat: false, createdAt: "2026-10-19" },
  { id: "c7", tenantId: T, name: "Ruth & Ian Cole", area: "Tooting", isRepeat: true, createdAt: "2025-09-08" },
  { id: "c8", tenantId: T, name: "Kestrel Studio", area: "Stockwell", isRepeat: false, createdAt: "2026-10-22" },
];

export const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? "Unknown";
export const memberById = (id?: string) => team.find((m) => m.id === id);

function at(base: Date, dayOffset: number, h: number, m = 0) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset, h, m);
  return d.toISOString();
}

function liveStatus(startIso: string, mins: number, now: Date): Booking["status"] {
  const s = new Date(startIso).getTime();
  const e = s + mins * 60_000;
  if (now.getTime() >= e) return "completed";
  if (now.getTime() >= s) return "in_progress";
  return "scheduled";
}

export function getBookings(now: Date): Booking[] {
  const raw: Omit<Booking, "status" | "tenantId">[] = [
    { id: "b1", customerId: "c1", serviceName: "Regular clean", start: at(now, 0, 8, 30), durationMins: 120, assigneeId: "tm2", postcodeArea: "SW4", valuePence: 6400, note: "Key in safe — code on file" },
    { id: "b2", customerId: "c4", serviceName: "Surgery clean", start: at(now, 0, 9, 0), durationMins: 180, assigneeId: "tm3", postcodeArea: "SW11", valuePence: 14500 },
    { id: "b3", customerId: "c2", serviceName: "End of tenancy", start: at(now, 0, 11, 0), durationMins: 300, assigneeId: "tm1", postcodeArea: "SW2", valuePence: 32000, note: "Inventory check at 4pm" },
    { id: "b4", customerId: "c5", serviceName: "Oven clean", start: at(now, 0, 13, 30), durationMins: 90, assigneeId: "tm4", postcodeArea: "SW12", valuePence: 7500 },
    { id: "b5", customerId: "c7", serviceName: "Deep clean", start: at(now, 0, 15, 0), durationMins: 240, assigneeId: "tm2", postcodeArea: "SW17", valuePence: 22000 },
    { id: "b6", customerId: "c1", serviceName: "Regular clean", start: at(now, 1, 8, 30), durationMins: 120, assigneeId: "tm2", postcodeArea: "SW4", valuePence: 6400 },
    { id: "b7", customerId: "c3", serviceName: "Deep clean", start: at(now, 1, 10, 0), durationMins: 240, assigneeId: "tm3", postcodeArea: "SE15", valuePence: 21000 },
    { id: "b8", customerId: "c8", serviceName: "Office clean", start: at(now, 2, 7, 0), durationMins: 150, assigneeId: "tm1", postcodeArea: "SW9", valuePence: 11000 },
    { id: "b9", customerId: "c6", serviceName: "After-builders clean", start: at(now, 3, 9, 0), durationMins: 360, assigneeId: "tm4", postcodeArea: "SW16", valuePence: 38500 },
    { id: "b10", customerId: "c5", serviceName: "Regular clean", start: at(now, 4, 14, 0), durationMins: 120, assigneeId: "tm2", postcodeArea: "SW12", valuePence: 6400 },
  ];
  return raw.map((b) => ({ ...b, tenantId: T, status: liveStatus(b.start, b.durationMins, now) }));
}

export function getEnquiries(now: Date): Enquiry[] {
  const ago = (mins: number) => new Date(now.getTime() - mins * 60_000).toISOString();
  return [
    { id: "e1", tenantId: T, name: "Hannah Price", serviceName: "End of tenancy", receivedAt: ago(38), channel: "Booking page", message: "2-bed flat, moving out on the 6th. Do you include carpets?" },
    { id: "e2", tenantId: T, name: "Oakfield Nursery", serviceName: "Office clean", receivedAt: ago(190), channel: "Email", message: "Looking for a weekly evening clean, 3 rooms plus kitchen." },
    { id: "e3", tenantId: T, name: "Leon Fraser", serviceName: "Deep clean", receivedAt: ago(1440 + 120), channel: "Referral", message: "Recommended by Ellie Turner. Free most weekdays." },
  ];
}

export function getQuotes(now: Date): Quote[] {
  const d = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString();
  return [
    { id: "q1", tenantId: T, number: "Q-1042", customerId: "c6", title: "After-builders clean, 3-bed house", totalPence: 38500, sentAt: d(-2), expiresAt: d(12) },
    { id: "q2", tenantId: T, number: "Q-1045", customerId: "c8", title: "Weekly office clean (monthly)", totalPence: 44000, sentAt: d(-1), expiresAt: d(2) },
    { id: "q3", tenantId: T, number: "Q-1046", customerId: "c3", title: "Carpet clean, lounge + stairs", totalPence: 9500, sentAt: d(0), expiresAt: d(14) },
  ];
}

export function getInvoices(now: Date): Invoice[] {
  const d = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString();
  return [
    { id: "i1", tenantId: T, number: "INV-2213", customerId: "c2", totalPence: 64000, amountPaidPence: 0, issuedAt: d(-19), dueAt: d(-5) },
    { id: "i2", tenantId: T, number: "INV-2219", customerId: "c4", totalPence: 58000, amountPaidPence: 29000, issuedAt: d(-9), dueAt: d(5) },
    { id: "i3", tenantId: T, number: "INV-2224", customerId: "c7", totalPence: 22000, amountPaidPence: 0, issuedAt: d(-3), dueAt: d(11) },
    { id: "i4", tenantId: T, number: "INV-2226", customerId: "c5", totalPence: 7500, amountPaidPence: 0, issuedAt: d(-1), dueAt: d(13) },
  ];
}

/** Count of jobs at each stage of the pipeline. */
export function getPipeline(): { status: JobStatus; label: string; count: number }[] {
  return [
    { status: "new_enquiry", label: "Enquiry", count: 3 },
    { status: "quote_sent", label: "Quote sent", count: 3 },
    { status: "scheduled", label: "Scheduled", count: 12 },
    { status: "in_progress", label: "In progress", count: 2 },
    { status: "completed", label: "Completed", count: 6 },
    { status: "invoiced", label: "Invoiced", count: 4 },
    { status: "paid", label: "Paid", count: 41 },
  ];
}

export function getRevenue(now: Date): MonthlyRevenue[] {
  const values: [number, number][] = [
    [612000, 588000],
    [655000, 640000],
    [701000, 662000],
    [688000, 690000],
    [742000, 705000],
    [536000, 384000], // current month, still in progress
  ];
  return values.map(([inv, col], i) => {
    const m = new Date(now.getFullYear(), now.getMonth() - (values.length - 1 - i), 1);
    return {
      month: m.toLocaleDateString("en-GB", { month: "short" }),
      invoicedPence: inv,
      collectedPence: col,
    };
  });
}

export function getCustomerStats() {
  return { total: 148, newThisMonth: 9, repeatRate: 0.71, activeLast90: 96 };
}

export function getActivity(now: Date): ActivityEvent[] {
  const ago = (mins: number) => new Date(now.getTime() - mins * 60_000).toISOString();
  return [
    { id: "a1", tenantId: T, at: ago(12), actor: "Dan Hughes", kind: "job", text: "marked Ruth & Ian Cole's deep clean as started" },
    { id: "a2", tenantId: T, at: ago(38), actor: "Booking page", kind: "enquiry", text: "new enquiry from Hannah Price — End of tenancy" },
    { id: "a3", tenantId: T, at: ago(95), actor: "Stripe (demo)", kind: "payment", text: "£290.00 part-payment on INV-2219 from Northcote Dental" },
    { id: "a4", tenantId: T, at: ago(160), actor: "Amara Okafor", kind: "quote", text: "sent quote Q-1046 to James Adeyemi" },
    { id: "a5", tenantId: T, at: ago(300), actor: "You", kind: "customer", text: "added Kestrel Studio as a customer" },
    { id: "a6", tenantId: T, at: ago(1500), actor: "Priya Shah", kind: "booking", text: "rescheduled Marcus Webb to Thursday 9:00" },
  ];
}
