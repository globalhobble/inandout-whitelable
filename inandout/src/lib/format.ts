const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const gbpWhole = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export const money = (pence: number) => gbp.format(pence / 100);
export const moneyWhole = (pence: number) => gbpWhole.format(Math.round(pence / 100));

export const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export const dayLabel = (iso: string, now: Date) => {
  const d = new Date(iso);
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(d) - start(now)) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
};

export const relative = (iso: string, now: Date) => {
  const mins = Math.round((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export const daysUntil = (iso: string, now: Date) =>
  Math.ceil((new Date(iso).getTime() - now.getTime()) / 86_400_000);

export const longDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

export const greeting = (d: Date) => {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};
