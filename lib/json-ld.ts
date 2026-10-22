import type { BlogArticle } from "./blog";
import { BRAND_SHORT, CONTACTS } from "./contacts";
import { FAQ_ITEMS } from "./content";
import { HOME_DESCRIPTION, OG_IMAGE_PATH, SITE_NAME } from "./seo";
import { absoluteUrl, getSiteUrl } from "./site-url";

const PHONE_E164 = CONTACTS.phoneHref.replace("tel:", "");

/** Organization + LocalBusiness (офис в НН). Без AggregateRating / отзывов. */
export function buildOrganizationJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site}/#organization`,
    name: BRAND_SHORT,
    legalName: CONTACTS.legalName,
    alternateName: ["Demidov Park", "Демидов Парк — инвестиции"],
    description:
      "Инвестиции в доходные автомобили в Нижнем Новгороде: пул инвесторов от 100 000 ₽ и сдача своего авто в управление прокату Демидов Парк. Ориентиры доходности на сайте — не оферта.",
    url: site,
    image: absoluteUrl(OG_IMAGE_PATH),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
    },
    telephone: PHONE_E164,
    taxID: CONTACTS.inn,
    identifier: [
      { "@type": "PropertyValue", name: "ИНН", value: CONTACTS.inn },
      { "@type": "PropertyValue", name: "ОГРН", value: CONTACTS.ogrn },
    ],
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
    hasMap: CONTACTS.mapUrl,
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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_E164,
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: ["Russian"],
    },
    sameAs: [CONTACTS.siteUrl, CONTACTS.telegramUrl, CONTACTS.maxUrl],
    foundingDate: "2016",
    founder: {
      "@type": "Person",
      name: "Евгений Демидов",
    },
  };
}

/** FAQ только для главной (секция #faq). */
export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${getSiteUrl()}/#faq`,
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

/** WebSite без SearchAction — на сайте нет поиска. */
export function buildWebSiteJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: site,
    name: SITE_NAME,
    description: HOME_DESCRIPTION,
    publisher: { "@id": `${site}/#organization` },
    inLanguage: "ru-RU",
  };
}

export type BreadcrumbItem = {
  name: string;
  /** Путь от корня, например `/blog` или `/`. */
  path: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type ArticleJsonLdInput = Pick<
  BlogArticle,
  "slug" | "title" | "excerpt" | "date" | "image" | "imageAlt"
>;

/** BlogPosting + BreadcrumbList для страницы статьи. */
export function buildArticleJsonLd(article: ArticleJsonLdInput) {
  const site = getSiteUrl();
  const pageUrl = absoluteUrl(`/blog/${article.slug}`);

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(article.image),
      caption: article.imageAlt,
    },
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "Blog",
      "@id": `${site}/blog#blog`,
      name: "Блог об инвестициях в автопарк",
      url: absoluteUrl("/blog"),
    },
    author: {
      "@type": "Person",
      name: "Евгений Демидов",
      worksFor: { "@id": `${site}/#organization` },
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
      "@id": pageUrl,
    },
    url: pageUrl,
  };

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Блог", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` },
  ]);

  return [blogPosting, breadcrumb];
}
