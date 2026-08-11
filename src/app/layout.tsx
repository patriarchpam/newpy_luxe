import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { BRAND } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    "beauty salon Abuja",
    "hair installation",
    "luxury beauty Nigeria",
    "nail salon",
    "makeup artist",
    "bridal makeup",
    "henna design",
    BRAND.name,
  ],
  authors: [{ name: BRAND.name, url: BRAND.url }],
  creator: BRAND.name,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: BRAND.url,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0E11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-ink min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-plum-500 focus:text-white focus:rounded-xl font-semibold"
        >
          Skip to content
        </a>

        <Navbar />

        <div className="flex-1 flex flex-col" id="main-content" tabIndex={-1}>
          {children}
        </div>

        <Footer />

        <WhatsAppFAB phoneNumber={BRAND.whatsapp} />
        <MobileTabBar />
      </body>
    </html>
  );
}
