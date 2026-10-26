import clsx from "clsx";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function Card({
  className,
  children,
  as: As = "section",
  ...rest
}: React.HTMLAttributes<HTMLElement> & { as?: "section" | "div" | "article" }) {
  return (
    <As
      className={clsx(
        "rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(15,27,45,0.04)]",
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

export function CardHeader({
  title,
  icon: Icon,
  action,
  hint,
}: {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  hint?: string;
}) {
  return (
    <header className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
            <Icon size={16} strokeWidth={2.2} aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-[15px] font-semibold text-ink">{title}</h2>
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="shrink-0 text-[13px] font-semibold text-brand hover:text-brand-ink">
      {children}
    </Link>
  );
}

type Tone = "brand" | "accent" | "ok" | "warn" | "bad" | "violet" | "neutral";

const toneClass: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand-ink",
  accent: "bg-accent-soft text-[color-mix(in_oklab,var(--accent)_70%,black)]",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad",
  violet: "bg-violet-soft text-violet",
  neutral: "bg-line-soft text-ink-soft",
};

export function Badge({ tone = "neutral", children, dot = false }: { tone?: Tone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold whitespace-nowrap", toneClass[tone])}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export function DemoTag() {
  return (
    <span
      title="Made-up example data. Replaced by your real records once the database is connected."
      className="inline-flex items-center rounded-md border border-dashed border-warn/50 bg-warn-soft px-1.5 py-px text-[10.5px] font-bold uppercase tracking-wider text-warn"
    >
      Demo
    </span>
  );
}

export function Avatar({ initials, colour, size = 28 }: { initials: string; colour: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: colour, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
