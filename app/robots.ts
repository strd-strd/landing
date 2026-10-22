import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: ["/api/", "/spasibo"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    /** Yandex Host: предпочитаемый хост без схемы. */
    host: base.replace(/^https?:\/\//, ""),
  };
}
