"use client";

import Link from "next/link";
import clsx from "clsx";
import { useNow } from "@/lib/client-stores";
import {
  CalendarPlus,
  UserPlus,
  FilePlus2,
  ReceiptText,
  CalendarClock,
  Inbox,
  FileText,
  ReceiptPoundSterling as Receipt,
  Activity,
  TrendingUp,
  Users,
  KanbanSquare,
  MapPin,
  Clock,
  Info,
  CircleCheck,
  CircleDot,
  Circle,
  PoundSterling,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { currentTenant } from "@/lib/tenant";
import * as demo from "@/lib/demo-data";
import { money, moneyWhole, time, dayLabel, relative, daysUntil, longDate, greeting } from "@/lib/format";
import { Card, CardHeader, Badge, DemoTag, Avatar, TextLink } from "@/components/ui/primitives";
import { RevenueChart } from "./RevenueChart";
import type { Booking } from "@/lib/types";

export function Dashboard() {
  // The demo data is built around "now", so it's created in the browser after
  // the page loads. Until then a light skeleton shows.
  const now = useNow();

  if (!now) return <DashboardSkeleton />;
  return <DashboardContent now={now} />;
}

function DashboardContent({ now }: { now: Date }) {
  const tenant = currentTenant;
  const v = tenant.vocabulary;

  const bookings = demo.getBookings(now);
  const isSameDay = (iso: string, offset = 0) => {
    const d = new Date(iso);
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  };
  const today = bookings.filter((b) => isSameDay(b.start)).sort((a, b) => a.start.localeCompare(b.start));
  const upcoming = bookings.filter((b) => new Date(b.start) > now && !isSameDay(b.start)).slice(0, 5);
  const enquiries = demo.getEnquiries(now);
  const quotes = demo.getQuotes(now);
  const invoices = demo.getInvoices(now);
  const revenue = demo.getRevenue(now);
  const pipeline = demo.getPipeline();
  const stats = demo.getCustomerStats();
  const activity = demo.getActivity(now);

  const done = today.filter((b) => b.status === "completed").length;
  const inProgress = today.filter((b) => b.status === "in_progress").length;
  const outstanding = invoices.reduce((s, i) => s + (i.totalPence - i.amountPaidPence), 0);
  const overdue = invoices.filter((i) => daysUntil(i.dueAt, now) < 0);
  const thisMonth = revenue[revenue.length - 1];
  const todayValue = today.reduce((s, b) => s + b.valuePence, 0);

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* ---------- Welcome ---------- */}
      <section className="anim-rise wash relative overflow-hidden rounded-3xl border border-line p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand">{longDate(now)}</p>
            <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">
              {greeting(now)}.
            </h1>
            <p className="mt-1.5 max-w-xl text-[15px] text-ink-soft">
              {today.length} {today.length === 1 ? v.job : v.jobs} on today
              {done > 0 && <> · {done} done</>}
              {inProgress > 0 && <> · {inProgress} underway</>}
              {" "}· {enquiries.length} new enquiries waiting.
            </p>
          </div>
          <QuickActions />
        </div>
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-dashed border-warn/40 bg-warn-soft/70 px-3.5 py-2.5 text-[13px] text-[color-mix(in_oklab,var(--warn)_70%,black)]">
          <Info size={16} className="mt-px shrink-0" aria-hidden />
          <p>
            <span className="font-semibold">You&rsquo;re looking at demonstration data.</span> Every name and figure here is
            made up. It&rsquo;s replaced by your real records once sign-in and the database are connected.
          </p>
        </div>
      </section>

      {/* ---------- Key numbers ---------- */}
      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi
          icon={CalendarClock}
          label={`Today's ${v.jobs}`}
          value={String(today.length)}
          sub={`${moneyWhole(todayValue)} booked value`}
          tone="brand"
          delay={40}
        />
        <Kpi
          icon={KanbanSquare}
          label="Jobs in progress"
          value={String(pipeline.find((p) => p.status === "in_progress")?.count ?? 0)}
          sub={`${pipeline.find((p) => p.status === "scheduled")?.count ?? 0} more scheduled`}
          tone="accent"
          delay={80}
        />
        <Kpi
          icon={Receipt}
          label="Outstanding"
          value={moneyWhole(outstanding)}
          sub={overdue.length ? `${overdue.length} overdue` : "Nothing overdue"}
          subTone={overdue.length ? "bad" : "ok"}
          tone="warn"
          delay={120}
        />
        <Kpi
          icon={PoundSterling}
          label="Collected this month"
          value={moneyWhole(thisMonth.collectedPence)}
          sub={`of ${moneyWhole(thisMonth.invoicedPence)} invoiced`}
          tone="ok"
          delay={160}
        />
      </section>

      {/* ---------- Today + pipeline ---------- */}
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <Card className="anim-rise lg:col-span-7">
          <CardHeader
            title="Today"
            icon={CalendarDays}
            hint={`${today.length} ${v.jobs} across ${new Set(today.map((b) => b.assigneeId)).size} ${v.workers}`}
            action={<TextLink href="/calendar">Calendar</TextLink>}
          />
          <TodayTimeline items={today} now={now} />
        </Card>

        <div className="space-y-5 lg:col-span-5 lg:space-y-6">
          <Card className="anim-rise">
            <CardHeader title="Job pipeline" icon={KanbanSquare} hint="Where every job is right now" action={<DemoTag />} />
            <Pipeline items={pipeline} />
          </Card>
          <Card className="anim-rise">
            <CardHeader title="Customers" icon={Users} action={<TextLink href="/customers">View all</TextLink>} />
            <div className="grid grid-cols-3 divide-x divide-line-soft px-2 pb-5 pt-4">
              <Stat label="Total" value={String(stats.total)} />
              <Stat label="New this month" value={`+${stats.newThisMonth}`} />
              <Stat label="Book again" value={`${Math.round(stats.repeatRate * 100)}%`} />
            </div>
          </Card>
        </div>
      </div>

      {/* ---------- Money ---------- */}
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <Card className="anim-rise lg:col-span-7">
          <CardHeader
            title="Revenue"
            icon={TrendingUp}
            hint="Last 6 months · invoiced vs actually collected"
            action={<DemoTag />}
          />
          <RevenueChart data={revenue} />
        </Card>
        <Card className="anim-rise lg:col-span-5">
          <CardHeader
            title="Outstanding invoices"
            icon={Receipt}
            hint={`${moneyWhole(outstanding)} still to collect`}
            action={<TextLink href="/invoices">All invoices</TextLink>}
          />
          <ul className="mt-2 divide-y divide-line-soft">
            {invoices.map((inv) => {
              const days = daysUntil(inv.dueAt, now);
              const left = inv.totalPence - inv.amountPaidPence;
              return (
                <li key={inv.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{demo.customerName(inv.customerId)}</p>
                    <p className="text-xs text-muted">
                      {inv.number}
                      {inv.amountPaidPence > 0 && <> · {money(inv.amountPaidPence)} paid</>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular text-[14px] font-semibold">{money(left)}</p>
                    {days < 0 ? (
                      <Badge tone="bad" dot>{Math.abs(days)}d overdue</Badge>
                    ) : (
                      <span className="text-xs text-muted">Due in {days}d</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="px-5 pb-5 pt-2 text-xs text-muted">
            Invoices are only marked paid when Stripe confirms the payment, or when you record cash or a bank transfer yourself.
          </p>
        </Card>
      </div>

      {/* ---------- Inbox-style lists ---------- */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <Card className="anim-rise">
          <CardHeader title="New enquiries" icon={Inbox} action={<Badge tone="brand">{enquiries.length} new</Badge>} />
          <ul className="mt-2 divide-y divide-line-soft">
            {enquiries.map((e) => (
              <li key={e.id} className="px-5 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[14px] font-semibold">{e.name}</p>
                  <span className="shrink-0 text-xs text-muted">{relative(e.receivedAt, now)}</span>
                </div>
                <p className="text-xs font-medium text-brand">
                  {e.serviceName} · {e.channel}
                </p>
                <p className="mt-1 line-clamp-2 text-[13px] text-ink-soft">{e.message}</p>
              </li>
            ))}
          </ul>
          <div className="px-5 pb-5 pt-1"><TextLink href="/bookings">Open enquiries</TextLink></div>
        </Card>

        <Card className="anim-rise">
          <CardHeader title="Quotes awaiting reply" icon={FileText} action={<Badge tone="violet">{quotes.length}</Badge>} />
          <ul className="mt-2 divide-y divide-line-soft">
            {quotes.map((q) => {
              const exp = daysUntil(q.expiresAt, now);
              return (
                <li key={q.id} className="px-5 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold">{demo.customerName(q.customerId)}</p>
                    <span className="tabular shrink-0 text-[14px] font-semibold">{money(q.totalPence)}</span>
                  </div>
                  <p className="truncate text-[13px] text-ink-soft">{q.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    {q.number} · sent {dayLabel(q.sentAt, now).toLowerCase()}
                    {exp <= 3 && <Badge tone="warn">Expires in {exp}d</Badge>}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="px-5 pb-5 pt-1"><TextLink href="/quotes">All quotes</TextLink></div>
        </Card>

        <Card className="anim-rise md:col-span-2 lg:col-span-1">
          <CardHeader title="Coming up" icon={CalendarClock} hint="Next few days" />
          <ul className="mt-2 divide-y divide-line-soft">
            {upcoming.map((b) => {
              const m = demo.memberById(b.assigneeId);
              return (
                <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-[58px] shrink-0">
                    <p className="text-[12px] font-semibold text-brand">{dayLabel(b.start, now)}</p>
                    <p className="tabular text-xs text-muted">{time(b.start)}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{demo.customerName(b.customerId)}</p>
                    <p className="truncate text-xs text-ink-soft">{b.serviceName} · {b.postcodeArea}</p>
                  </div>
                  {m && <Avatar initials={m.initials} colour={m.colour} size={26} />}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* ---------- Activity ---------- */}
      <Card className="anim-rise">
        <CardHeader title="Recent activity" icon={Activity} hint="Who did what, and when" action={<DemoTag />} />
        <ol className="grid gap-x-8 px-5 pb-4 pt-3 md:grid-cols-2">
          {activity.map((a) => (
            <li key={a.id} className="flex gap-3 border-b border-line-soft py-3 last:border-0 md:[&:nth-last-child(2)]:border-0">
              <ActivityDot kind={a.kind} />
              <p className="min-w-0 flex-1 text-[13.5px] text-ink-soft">
                <span className="font-semibold text-ink">{a.actor}</span> {a.text}
                <span className="block text-xs text-muted">{relative(a.at, now)}</span>
              </p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function QuickActions() {
  const actions = [
    { href: "/bookings", label: "Add booking", icon: CalendarPlus, primary: true },
    { href: "/customers", label: "Add customer", icon: UserPlus },
    { href: "/quotes", label: "Create quote", icon: FilePlus2 },
    { href: "/invoices", label: "Create invoice", icon: ReceiptText },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {actions.map((a) => (
        <Link
          key={a.label}
          href={a.href}
          className={clsx(
            "lift inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold shadow-sm",
            a.primary ? "bg-brand text-white hover:bg-brand-ink" : "border border-line bg-surface text-ink hover:border-brand/30",
          )}
        >
          <a.icon size={17} aria-hidden />
          {a.label}
        </Link>
      ))}
    </div>
  );
}

const kpiTone = {
  brand: "bg-brand-soft text-brand",
  accent: "bg-accent-soft text-accent",
  warn: "bg-warn-soft text-warn",
  ok: "bg-ok-soft text-ok",
} as const;

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone,
  subTone,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  sub: string;
  tone: keyof typeof kpiTone;
  subTone?: "bad" | "ok";
  delay: number;
}) {
  return (
    <Card as="div" className="anim-rise p-4 sm:p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <span className={clsx("grid size-9 place-items-center rounded-xl", kpiTone[tone])}>
          <Icon size={18} aria-hidden />
        </span>
        <DemoTag />
      </div>
      <p className="mt-3 text-[12.5px] font-medium text-muted">{label}</p>
      <p className="tabular font-display text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">{value}</p>
      <p
        className={clsx(
          "mt-0.5 text-xs font-medium",
          subTone === "bad" ? "text-bad" : subTone === "ok" ? "text-ok" : "text-ink-soft",
        )}
      >
        {sub}
      </p>
    </Card>
  );
}

function TodayTimeline({ items, now }: { items: Booking[]; now: Date }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center px-5 py-12 text-center">
        <Sparkles className="text-accent" aria-hidden />
        <p className="mt-2 font-semibold">Nothing booked today</p>
        <p className="text-sm text-muted">Enjoy the quiet, or open the calendar to add a booking.</p>
      </div>
    );
  }
  return (
    <ol className="px-5 pb-5 pt-4">
      {items.map((b, i) => {
        const m = demo.memberById(b.assigneeId);
        const end = new Date(new Date(b.start).getTime() + b.durationMins * 60_000);
        const last = i === items.length - 1;
        const state = b.status;
        return (
          <li key={b.id} className="relative flex gap-4">
            <div className="flex w-12 shrink-0 flex-col items-end pt-3">
              <span className="tabular text-[13px] font-semibold">{time(b.start)}</span>
              <span className="tabular text-[11px] text-muted">{time(end.toISOString())}</span>
            </div>
            <div className="relative flex flex-col items-center pt-3.5">
              <StatusIcon state={state} />
              {!last && <span className="mt-1 w-px flex-1 bg-line" aria-hidden />}
            </div>
            <div
              className={clsx(
                "mb-3 min-w-0 flex-1 rounded-xl border p-3 sm:p-3.5",
                state === "in_progress" ? "border-accent/40 bg-accent-soft/50" : "border-line-soft bg-canvas/60",
                state === "completed" && "opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-semibold">{demo.customerName(b.customerId)}</p>
                  <p className="truncate text-[13px] text-ink-soft">{b.serviceName}</p>
                </div>
                <StatusBadge state={state} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1"><MapPin size={12} aria-hidden />{b.postcodeArea}</span>
                <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden />{b.durationMins / 60} hrs</span>
                {m && (
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar initials={m.initials} colour={m.colour} size={18} />
                    {m.name.split(" ")[0]}
                  </span>
                )}
                <span className="tabular ml-auto font-semibold text-ink-soft">{money(b.valuePence)}</span>
              </div>
              {b.note && <p className="mt-2 rounded-lg bg-surface px-2.5 py-1.5 text-xs text-ink-soft ring-1 ring-line-soft">{b.note}</p>}
            </div>
          </li>
        );
      })}
      <li className="sr-only">Updated {time(now.toISOString())}</li>
    </ol>
  );
}

function StatusIcon({ state }: { state: Booking["status"] }) {
  if (state === "completed") return <CircleCheck size={16} className="text-ok" aria-hidden />;
  if (state === "in_progress") return <CircleDot size={16} className="text-accent" aria-hidden />;
  return <Circle size={16} className="text-line" strokeWidth={2.5} aria-hidden />;
}

function StatusBadge({ state }: { state: Booking["status"] }) {
  if (state === "completed") return <Badge tone="ok">Done</Badge>;
  if (state === "in_progress") return <Badge tone="accent" dot>Underway</Badge>;
  if (state === "cancelled") return <Badge tone="bad">Cancelled</Badge>;
  return <Badge tone="neutral">Scheduled</Badge>;
}

const pipeColours: Record<string, string> = {
  new_enquiry: "var(--brand)",
  quote_sent: "var(--violet)",
  scheduled: "color-mix(in oklab, var(--brand) 55%, white)",
  in_progress: "var(--accent)",
  completed: "color-mix(in oklab, var(--ok) 70%, white)",
  invoiced: "var(--warn)",
  paid: "var(--ok)",
};

function Pipeline({ items }: { items: ReturnType<typeof demo.getPipeline> }) {
  const active = items.filter((i) => i.status !== "paid");
  const total = active.reduce((s, i) => s + i.count, 0);
  const paid = items.find((i) => i.status === "paid");
  return (
    <div className="px-5 pb-5 pt-4">
      <div className="flex h-3 overflow-hidden rounded-full bg-line-soft" role="img" aria-label="Share of open jobs at each stage">
        {active.map((i) => (
          <span key={i.status} style={{ width: `${(i.count / total) * 100}%`, background: pipeColours[i.status] }} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
        {active.map((i) => (
          <li key={i.status} className="flex items-center gap-2 text-[13px]">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: pipeColours[i.status] }} aria-hidden />
            <span className="flex-1 truncate text-ink-soft">{i.label}</span>
            <span className="tabular font-semibold">{i.count}</span>
          </li>
        ))}
      </ul>
      {paid && (
        <p className="mt-4 border-t border-line-soft pt-3 text-xs text-muted">
          <span className="font-semibold text-ok">{paid.count} jobs paid</span> in the last 30 days
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 text-center">
      <p className="tabular font-display text-[22px] font-semibold">{value}</p>
      <p className="text-[11.5px] font-medium text-muted">{label}</p>
    </div>
  );
}

function ActivityDot({ kind }: { kind: string }) {
  const map: Record<string, string> = {
    booking: "bg-brand",
    payment: "bg-ok",
    quote: "bg-violet",
    job: "bg-accent",
    customer: "bg-ink-soft",
    enquiry: "bg-warn",
  };
  return <span className={clsx("mt-1.5 size-2 shrink-0 rounded-full", map[kind] ?? "bg-muted")} aria-hidden />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-[220px] animate-pulse rounded-3xl bg-line-soft motion-reduce:animate-none" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[136px] animate-pulse rounded-2xl bg-line-soft motion-reduce:animate-none" />
        ))}
      </div>
      <div className="h-[420px] animate-pulse rounded-2xl bg-line-soft motion-reduce:animate-none" />
    </div>
  );
}
