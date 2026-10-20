import type { Metadata } from "next";
import { BRAND_SHORT, CONTACTS } from "@/lib/contacts";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

export const SITE_NAME = `${BRAND_SHORT} — инвестиции`;

export const HOME_TITLE =
  "Инвестиции в доходные автомобили в Нижнем Новгороде";

export const HOME_DESCRIPTION =
  "Пул инвесторов от 100 000 ₽ или своё авто в управление прокату Демидов Парк. Ориентир доходности ~25% годовых. Консультация с основателем.";

/** OG / Twitter share image 1200×630 */
export const OG_IMAGE_PATH = "/og.jpg";
export const OG_IMAGE_ALT =
  "Автопарк Демидов Парк — инвестиции в доходные автомобили в Нижнем Новгороде";

export function ogImage(path = OG_IMAGE_PATH, alt = OG_IMAGE_ALT) {
  return {
    url: absoluteUrl(path),
    width: 1200,
    height: 630,
    alt,
  };
}

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  imagePath?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

/** Metadata + Open Graph + Twitter для страницы. */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  imagePath = OG_IMAGE_PATH,
  imageAlt = OG_IMAGE_ALT,
  type = "website",
  noIndex = false,
}: PageSeoInput): Metadata {
  const site = getSiteUrl();
  const url = absoluteUrl(path);
  const image = ogImage(imagePath, imageAlt);
  const fullTitle = title.includes(BRAND_SHORT) ? title : `${title} | ${BRAND_SHORT}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "ru_RU",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" as const },
    other: {
      "geo.region": "RU-NIZ",
      "geo.placename": CONTACTS.city,
    },
  };
}
