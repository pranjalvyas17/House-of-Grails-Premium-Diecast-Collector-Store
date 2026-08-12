import type { Metadata, Viewport } from "next";
import { Sora, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Admin-only typeface (Nova preset default) — deliberately NOT named
// `--font-sans`, which the museum site's own design system already owns
// (Inter, see below). Scoped to `/admin` via the `--font-admin` token in
// globals.css so it can never leak into the public site's typography.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "THE HOUSE OF GRAILS — Rare. Exclusive. Legendary.",
    template: "%s · The House of Grails",
  },
  description:
    "A digital automotive museum for the world's rarest diecast. Chase cars, event exclusives and grails — curated like a Porsche.",
  keywords: [
    "diecast",
    "grails",
    "collector",
    "chase cars",
    "limited edition",
    "Kaido House",
    "RWB",
    "Mini GT",
  ],
  authors: [{ name: "The House of Grails" }],
  openGraph: {
    title: "THE HOUSE OF GRAILS",
    description: "Rare. Exclusive. Legendary. A digital automotive museum.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * True root layout — shared by both the public museum site (site) and the
 * /admin dashboard. Deliberately holds nothing but fonts, metadata and the
 * bare <html>/<body> shell; each route group supplies its own chrome
 * (navbar/footer for the site, sidebar/topbar for admin) in its own nested
 * layout, since the two are meant to look and feel completely different.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full antialiased",
        sora.variable,
        inter.variable,
        geist.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full bg-void text-platinum">{children}</body>
    </html>
  );
}
