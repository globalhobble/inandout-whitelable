import type { Metadata, Viewport } from "next";
import "@fontsource-variable/figtree";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "In and Out Cleaning Services",
    template: "%s · In and Out Cleaning Services",
  },
  description: "Bookings, jobs, customers and payments for In and Out Cleaning Services.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
