import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CHEAPEST, money } from "./lib/areas";
import { AREAS } from "./lib/areas";
import { HQ, SERVICE_RADIUS_MI } from "./lib/geo";
import { SITE } from "./lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const title = `Land + Home Prices Near ${HQ.city}, FL — County by County`;
const description = `See what it takes to get into a home on your own land in ${AREAS.length} North Florida counties within ${SERVICE_RADIUS_MI} miles of ${HQ.city}. Land and home financed as one loan, starting at ${money(
  CHEAPEST.startingPayment
)}/mo in ${CHEAPEST.county} County.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${title} | ${SITE.brand}`,
    template: `%s | ${SITE.brand}`,
  },
  description,
  applicationName: SITE.brand,
  keywords: [
    "land and home package Florida",
    "mobile home with land Gainesville FL",
    "doublewide on land financing",
    "North Florida land prices",
    "manufactured home one loan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.brand,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070b0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink font-sans text-bone">
        {children}
      </body>
    </html>
  );
}
