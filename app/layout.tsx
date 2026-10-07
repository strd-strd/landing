import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { ContactWidget } from "@/app/contact-widget";
import { LeadPopup } from "@/app/lead-popup";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { StickyInvestCta } from "@/app/sticky-invest-cta";
import {
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/json-ld";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Инвестиции в доходные автомобили | Демидов Парк",
    template: "%s | Демидов Парк",
  },
  description:
    "Инвестируйте в автомобиль в Нижнем Новгороде: Демидов Парк берёт машину в управление и сдаёт в аренду. Пассивный доход от парка с 2016 года.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = [buildOrganizationJsonLd(), buildWebSiteJsonLd(), buildFaqJsonLd()];

  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
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
      </body>
    </html>
  );
}
