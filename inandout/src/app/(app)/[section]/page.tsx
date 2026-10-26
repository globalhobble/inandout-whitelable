import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Hammer } from "lucide-react";
import { NAV, findNav } from "@/lib/navigation";
import { Card } from "@/components/ui/primitives";

/**
 * Sections that haven't been built yet.
 *
 * Rather than a fake screen, each one says plainly that it's not ready,
 * which build stage it arrives in, and what it will do.
 */

export function generateStaticParams() {
  return NAV.filter((n) => n.slug).map((n) => ({ section: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: findNav(section)?.label ?? "Not found" };
}

const STAGE_NAMES: Record<number, string> = {
  2: "Stage 2 — Sign-in, onboarding & branding",
  3: "Stage 3 — Services, customers, bookings & jobs",
  4: "Stage 4 — Quotes, invoices, payments & workflows",
  5: "Stage 5 — Notifications, team, reports & billing",
};

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  const item = findNav(section);
  if (!item) notFound();
  const Icon = item.icon;

  return (
    <div className="anim-rise mx-auto max-w-2xl">
      <Link href="/" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft size={16} aria-hidden /> Dashboard
      </Link>

      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Icon size={22} aria-hidden />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{item.label}</h1>
          <p className="text-[15px] text-ink-soft">{item.summary}</p>
        </div>
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-xl bg-warn-soft p-4 text-warn">
          <Hammer size={18} className="mt-0.5 shrink-0" aria-hidden />
          <div className="text-sm">
            <p className="font-semibold">Not built yet</p>
            <p className="text-[color-mix(in_oklab,var(--warn)_75%,black)]">
              This section arrives in {STAGE_NAMES[item.stage]}. Nothing on this page is working yet.
            </p>
          </div>
        </div>

        {item.plans.length > 0 && (
          <>
            <h2 className="mt-6 font-display text-[15px] font-semibold">What it will do</h2>
            <ul className="mt-3 space-y-2.5">
              {item.plans.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}
