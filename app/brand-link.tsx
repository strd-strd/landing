import type { ReactNode } from "react";
import { CONTACTS } from "@/lib/contacts";

const BRAND = "Демидов Парк";

type BrandLinkProps = {
  className?: string;
};

export function BrandLink({ className = "" }: BrandLinkProps) {
  return (
    <a
      href={CONTACTS.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`brand-glow font-semibold underline-offset-4 transition-opacity duration-200 hover:opacity-90 hover:underline ${className}`.trim()}
    >
      {BRAND}
    </a>
  );
}

/** Вставляет золотую ссылку на бренд во все вхождения «Демидов Парк». */
export function withBrandLinks(text: string): ReactNode {
  if (!text.includes(BRAND)) {
    return text;
  }

  const parts = text.split(BRAND);
  const nodes: ReactNode[] = [];

  parts.forEach((part, index) => {
    if (part) {
      nodes.push(part);
    }
    if (index < parts.length - 1) {
      nodes.push(<BrandLink key={`brand-${index}`} />);
    }
  });

  return nodes;
}
