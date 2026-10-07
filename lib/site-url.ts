import { CONTACTS } from "@/lib/contacts";

/** Canonical base URL. Prefer SITE_URL from env; fallback to invest host. */
export function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  return CONTACTS.canonicalHost;
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") {
    return `${base}/`;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
