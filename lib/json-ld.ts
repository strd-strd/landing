import type { BlogArticle } from "./blog";
import { BRAND_SHORT, CONTACTS } from "./contacts";
import { FAQ_ITEMS } from "./content";
import { OG_IMAGE_PATH } from "./seo";
import { absoluteUrl, getSiteUrl } from "./site-url";

export function buildOrganizationJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site}/#organization`,
    name: BRAND_SHORT,
    alternateName: ["Demidov Park", "Демидов Парк — инвестиции"],
    description:
      "Инвестиции в доходные автомобили в Нижнем Новгороде: пул инвесторов и сдача своего авто в управление прокату Демидов Парк.",
    url: site,
    image: absoluteUrl(OG_IMAGE_PATH),
    logo: absoluteUrl("/logo.svg"),
    telephone: CONTACTS.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACTS.address,
      addressLocality: CONTACTS.city,
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACTS.mapLat,
      longitude: CONTACTS.mapLon,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    areaServed: {
      "@type": "City",
      name: CONTACTS.city,
    },
    sameAs: [CONTACTS.siteUrl, CONTACTS.telegramUrl],
    foundingDate: "2016",
    founder: {
      "@type": "Person",
      name: "Евгений Демидов",
    },
  };
}

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildWebSiteJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: site,
    name: `${BRAND_SHORT} — инвестиции`,
    description: "Инвестиции в доходные автомобили в Нижнем Новгороде",
    publisher: { "@id": `${site}/#organization` },
    inLanguage: "ru-RU",
  };
}

type ArticleJsonLdInput = Pick<
  BlogArticle,
  "slug" | "title" | "excerpt" | "date" | "image" | "imageAlt"
>;

/** Article JSON-LD для страницы блога. */
export function buildArticleJsonLd(article: ArticleJsonLdInput) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(article.image),
      caption: article.imageAlt,
    },
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: BRAND_SHORT,
      "@id": `${site}/#organization`,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_SHORT,
      "@id": `${site}/#organization`,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${article.slug}`),
    },
  };
}
