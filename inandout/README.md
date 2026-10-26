# In and Out Cleaning Services

A business management app for cleaning companies — bookings, jobs, customers, quotes, invoices and automated workflows — built so other trades can use it under their own brand later.

**Current status: Stage 1 of 6.** The app shell, navigation, design system and dashboard are built. The dashboard shows **made-up demonstration data**, clearly labelled. Nothing is saved yet, and no sign-in, payments or emails exist yet.

---

## What works now (Stage 1)

| Area | Status |
|---|---|
| Dashboard | ✅ Built, using labelled demo data |
| Sidebar (desktop, collapsible) | ✅ Built — remembers your choice on that device |
| Bottom tabs + "More" sheet (mobile) | ✅ Built |
| Design system (colours, type, cards, badges) | ✅ Built |
| Brand colours per business | ✅ Wired up as settings — change them in `src/lib/tenant.ts` |
| Reduced motion | ✅ If a device asks for less motion, movement becomes gentle fades |
| Other 14 sections | 🚧 Each one says "Not built yet", which stage it arrives in, and what it will do |

## The plan

| Stage | What gets built |
|---|---|
| **1** ✅ | App shell, dashboard, navigation, design system |
| **2** | Sign-up and log-in (Supabase Auth), business onboarding, logo upload and branding, separate workspaces per business (database security rules) |
| **3** | Services and prices, customers, calendar, public booking page, job board |
| **4** | Quotes, invoices, Stripe payments (test mode first), workflow automations that actually run |
| **5** | Email notifications, team roles, reports, subscription billing for businesses using the platform |
| **6** | End-to-end testing and deployment |

---

## Running it on your computer

You need **Node.js 20 or newer** (download the "LTS" version from nodejs.org).

1. Open a terminal in this folder.
2. Run `npm install` (once — downloads the building blocks).
3. Run `npm run dev`.
4. Open **http://localhost:3000** in your browser.

## Putting it online (GitHub + Vercel)

1. Create a new **private** repository on GitHub (github.com → **+** in the top right → **New repository**). Don't add a README there.
2. Upload this project to it. (If you'd like, I can walk you through this step by step — it's a few commands.)
3. Go to **vercel.com** → **Add New…** → **Project** → choose the repository → **Deploy**. No settings needed for Stage 1.

Vercel then redeploys automatically every time code is pushed to GitHub.

---

## How the code is organised

```
src/
  app/
    layout.tsx               Fonts, page title, global styles
    globals.css              Colours, motion and reduced-motion rules
    (app)/layout.tsx         Wraps every page in the app shell
    (app)/page.tsx           Dashboard
    (app)/[section]/page.tsx The 14 not-yet-built sections ("coming in Stage X")
  components/
    shell/                   Sidebar, mobile tabs, "More" sheet
    dashboard/               Dashboard and revenue chart
    brand/BrandMark.tsx      Logo — shows the uploaded logo, or a placeholder
    ui/primitives.tsx        Cards, badges, Demo tag, avatars
  lib/
    tenant.ts                The business's name, colours and trade words
    navigation.ts            Every section: name, icon, stage, what it'll do
    types.ts                 Data shapes (match the future database tables)
    demo-data.ts             ⚠ The made-up data — replaced in Stage 2–3
    format.ts                £ amounts, dates and times (UK format)
```

### Built for many businesses from day one
- **Branding is configuration, not code.** Name, logo and colours live in one place (`tenant.ts`) and become CSS variables, so a different business gets a different look with no code changes. In Stage 2 this comes from the database.
- **Not hard-coded to cleaning.** Words like "clean / cleaner" come from the business's settings, so a plumber's workspace can say "job / engineer".
- **Every record has a `tenantId`.** That's what Stage 2's database security rules use to stop one business seeing another's data.
- **Money is stored in pence** to avoid rounding errors.
- **Invoiced and collected are kept separate** in every figure, so "money billed" is never confused with "money received".

## Environment variables

See `.env.example` for the names. Stage 1 needs none. Copy it to `.env.local` when Stage 2 starts. **Never** commit real keys, and never give the Supabase service-role key or Stripe secret key a `NEXT_PUBLIC_` name — that would expose them in the browser.

## Before launch (not legal advice)

These need checking by you or a professional before real customers use it:
- **Business name / trademark** — check the UK IPO register for "In and Out" in cleaning and software classes.
- **UK GDPR** — privacy notice, data retention periods, ICO registration (most businesses handling customer data must pay the data protection fee).
- **Cookie consent** — needed only if non-essential cookies or analytics are added.
- **Terms of service** for businesses using the platform, and a data processing agreement (you'll be processing their customers' data).
