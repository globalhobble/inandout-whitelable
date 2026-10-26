import type { MonthlyRevenue } from "@/lib/types";
import { moneyWhole } from "@/lib/format";

/**
 * Invoiced vs collected, per month. Two clearly named measures so nobody
 * confuses "money we billed" with "money in the bank".
 */
export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  const max = Math.max(...data.flatMap((d) => [d.invoicedPence, d.collectedPence]));
  const ceil = Math.ceil(max / 250000) * 250000; // round axis up to £2,500 steps
  const ticks = [0, 0.5, 1].map((f) => ceil * f);

  return (
    <figure className="px-5 pb-5 pt-2">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand-soft ring-1 ring-inset ring-brand/30" aria-hidden />
          Invoiced
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand" aria-hidden />
          Collected (payments received)
        </span>
      </div>

      <div className="relative mt-6 h-52" aria-hidden>
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 flex items-center gap-2" style={{ bottom: `${(t / ceil) * 100}%` }}>
            <span className="tabular w-11 shrink-0 -translate-y-1/2 text-right text-[10.5px] text-muted">
              {t === 0 ? "£0" : `£${Math.round(t / 100000)}k`}
            </span>
            <span className="h-px flex-1 -translate-y-1/2 bg-line-soft" />
          </div>
        ))}
        <div className="absolute inset-y-0 left-[52px] right-0 flex items-end justify-around gap-2">
          {data.map((d, i) => {
            const current = i === data.length - 1;
            return (
              <div key={d.month} className="flex h-full flex-1 flex-col justify-end">
                <div className="relative flex h-full items-end justify-center gap-1">
                  <div
                    className="anim-grow w-[38%] max-w-5 rounded-t-md bg-brand-soft ring-1 ring-inset ring-brand/25"
                    style={{ height: `${(d.invoicedPence / ceil) * 100}%`, animationDelay: `${i * 50}ms` }}
                  />
                  <div
                    className="anim-grow w-[38%] max-w-5 rounded-t-md bg-brand"
                    style={{ height: `${(d.collectedPence / ceil) * 100}%`, animationDelay: `${i * 50 + 80}ms`, opacity: current ? 0.65 : 1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="ml-[52px] mt-2 flex justify-around gap-2" aria-hidden>
        {data.map((d, i) => (
          <span key={d.month} className={`flex-1 text-center text-[11px] ${i === data.length - 1 ? "font-semibold text-ink" : "text-muted"}`}>
            {d.month}
            {i === data.length - 1 ? " (so far)" : ""}
          </span>
        ))}
      </div>

      {/* Screen-reader version of the chart */}
      <table className="sr-only">
        <caption>Invoiced and collected revenue by month</caption>
        <thead>
          <tr><th>Month</th><th>Invoiced</th><th>Collected</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <td>{d.month}</td>
              <td>{moneyWhole(d.invoicedPence)}</td>
              <td>{moneyWhole(d.collectedPence)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
