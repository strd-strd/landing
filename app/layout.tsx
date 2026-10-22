import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { AnalyticsGoals } from "@/app/analytics-goals";
import { ContactWidget } from "@/app/contact-widget";
import { CookieBanner } from "@/app/cookie-banner";
import { GoogleTagManager } from "@/app/google-tag-manager";
import { LeadPopup } from "@/app/lead-popup";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { StickyInvestCta } from "@/app/sticky-invest-cta";
import { YandexMetrika } from "@/app/yandex-metrika";
import { BRAND_SHORT } from "@/lib/contacts";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/json-ld";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
  ogImage,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const defaultOg = ogImage();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#11100f",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${HOME_TITLE} | ${BRAND_SHORT}`,
    template: `%s | ${BRAND_SHORT}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Евгений Демидов" }],
  creator: BRAND_SHORT,
  publisher: BRAND_SHORT,
  keywords: [
    "инвестиции в автомобили",
    "доходный автопарк",
    "пул инвесторов",
    "сдать авто в управление",
    "Нижний Новгород",
    "Демидов Парк",
    "пассивный доход авто",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${HOME_TITLE} | ${BRAND_SHORT}`,
    description: HOME_DESCRIPTION,
    images: [defaultOg],
  },
  twitter: {
    card: "summary_large_image",
    title: `${HOME_TITLE} | ${BRAND_SHORT}`,
    description: HOME_DESCRIPTION,
    images: [defaultOg.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Kj44huxK3Ay2LBSfA3IYJbxq6RojAdEIUuAH2_anLrM",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  category: "finance",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = [buildOrganizationJsonLd(), buildWebSiteJsonLd()];

  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <GoogleTagManager />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="absolute left-4 top-4 z-50 -translate-y-24 rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent transition-transform duration-200 focus:translate-y-0"
        >
          К основному контенту
        </a>
        <SiteHeader />
        <div id="top" className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteFooter />
        <ContactWidget />
        <StickyInvestCta />
        <LeadPopup />
        <CookieBanner />
        <YandexMetrika />
        <AnalyticsGoals />
      </body>
    </html>
  );
}
