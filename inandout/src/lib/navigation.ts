import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  Tags,
  FileText,
  KanbanSquare,
  ReceiptPoundSterling as Receipt,
  Workflow,
  UsersRound,
  BarChart3,
  Palette,
  Plug,
  CreditCard,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  slug: string; // "" for the dashboard
  label: string;
  short: string; // label for tight spaces
  icon: LucideIcon;
  group: "Run the day" | "Money" | "Grow" | "Settings";
  /** Build stage this section arrives in. Stage 1 = available now. */
  stage: 1 | 2 | 3 | 4 | 5;
  summary: string;
  plans: string[];
}

export const NAV: NavItem[] = [
  {
    slug: "",
    label: "Dashboard",
    short: "Home",
    icon: LayoutDashboard,
    group: "Run the day",
    stage: 1,
    summary: "Your day at a glance.",
    plans: [],
  },
  {
    slug: "calendar",
    label: "Calendar",
    short: "Calendar",
    icon: CalendarDays,
    group: "Run the day",
    stage: 3,
    summary: "Day, week and month views of every booking and who's doing it.",
    plans: [
      "Create, edit, reschedule and cancel bookings",
      "Assign each job to a team member",
      "Clash warnings when someone is double-booked",
      "Working hours and time off",
    ],
  },
  {
    slug: "bookings",
    label: "Bookings",
    short: "Bookings",
    icon: CalendarCheck,
    group: "Run the day",
    stage: 3,
    summary: "Every booking in one list, plus your public booking page.",
    plans: [
      "Public booking page in your own branding",
      "Availability checked on the server so slots can't be double-booked",
      "Choose manual approval or instant confirmation",
      "Optional deposits (Stage 4)",
    ],
  },
  {
    slug: "jobs",
    label: "Jobs",
    short: "Jobs",
    icon: KanbanSquare,
    group: "Run the day",
    stage: 3,
    summary: "A board that follows each job from enquiry to paid.",
    plans: [
      "Columns from New enquiry through to Paid",
      "Notes, photos and documents on each job",
      "A history of who changed what, and when",
      "Statuses you can rename for your trade",
    ],
  },
  {
    slug: "customers",
    label: "Customers",
    short: "Customers",
    icon: Users,
    group: "Run the day",
    stage: 3,
    summary: "Contact details and full history for every customer.",
    plans: [
      "Search and filter",
      "Bookings, quotes, invoices and messages on one profile",
      "Data export and deletion requests (UK GDPR)",
    ],
  },
  {
    slug: "services",
    label: "Services & pricing",
    short: "Services",
    icon: Tags,
    group: "Money",
    stage: 3,
    summary: "What you offer, how long it takes and what it costs.",
    plans: [
      "Fixed, hourly or quote-only pricing",
      "Optional extras (e.g. oven clean, inside windows)",
      "Deposit and VAT settings per service",
    ],
  },
  {
    slug: "quotes",
    label: "Quotes",
    short: "Quotes",
    icon: FileText,
    group: "Money",
    stage: 4,
    summary: "Send quotes, see who accepted, and turn them into bookings.",
    plans: [
      "Branded quotes customers can accept online",
      "Accepted quote becomes a booking in one tap",
      "Expiry dates and reminders",
    ],
  },
  {
    slug: "invoices",
    label: "Invoices & payments",
    short: "Invoices",
    icon: Receipt,
    group: "Money",
    stage: 4,
    summary: "Invoices, deposits and card payments through Stripe.",
    plans: [
      "Payments confirmed only by Stripe's signed webhooks",
      "Deposits, part-payments and refunds",
      "Manual 'mark as paid' for cash or bank transfer, with an audit trail",
    ],
  },
  {
    slug: "workflows",
    label: "Workflows",
    short: "Workflows",
    icon: Workflow,
    group: "Grow",
    stage: 4,
    summary: "When this happens → if this is true → do that, automatically.",
    plans: [
      "Ready-made templates for cleaning businesses",
      "Runs in the background, with retries and a log of every run",
      "Test a workflow before switching it on",
    ],
  },
  {
    slug: "reports",
    label: "Reports",
    short: "Reports",
    icon: BarChart3,
    group: "Grow",
    stage: 5,
    summary: "Revenue, repeat customers, popular services and team workload.",
    plans: [
      "Clearly separates invoiced, collected and estimated figures",
      "Live from your database",
    ],
  },
  {
    slug: "team",
    label: "Team",
    short: "Team",
    icon: UsersRound,
    group: "Settings",
    stage: 5,
    summary: "Invite staff and control what each person can see.",
    plans: [
      "Owner, manager and staff roles",
      "Staff only see their own jobs",
    ],
  },
  {
    slug: "branding",
    label: "Branding & website",
    short: "Branding",
    icon: Palette,
    group: "Settings",
    stage: 2,
    summary: "Your logo, colours and booking page — your brand, not ours.",
    plans: [
      "Upload logo and cover image",
      "Pick brand colours (the whole app updates)",
      "Preview your customer booking page",
      "Custom domains (later)",
    ],
  },
  {
    slug: "integrations",
    label: "Integrations",
    short: "Integrations",
    icon: Plug,
    group: "Settings",
    stage: 4,
    summary: "Connect Stripe, email and, later, SMS and WhatsApp.",
    plans: [
      "Stripe (test mode first)",
      "Transactional email provider",
      "SMS / WhatsApp as optional add-ons",
    ],
  },
  {
    slug: "billing",
    label: "Subscription",
    short: "Billing",
    icon: CreditCard,
    group: "Settings",
    stage: 5,
    summary: "Your plan for using the platform — kept separate from customer payments.",
    plans: ["Monthly plans via Stripe Billing", "Invoices and receipts for your subscription"],
  },
  {
    slug: "help",
    label: "Help & support",
    short: "Help",
    icon: LifeBuoy,
    group: "Settings",
    stage: 5,
    summary: "Guides and a way to get in touch.",
    plans: ["Step-by-step guides", "Contact support"],
  },
];

export const NAV_GROUPS = ["Run the day", "Money", "Grow", "Settings"] as const;

export const MOBILE_TABS = ["", "calendar", "jobs", "customers"];

export function hrefFor(item: NavItem) {
  return item.slug ? `/${item.slug}` : "/";
}

export function findNav(slug: string) {
  return NAV.find((n) => n.slug === slug);
}
