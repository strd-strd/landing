"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Скрывает шапку/подвал/виджеты на админке. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return children;
}
