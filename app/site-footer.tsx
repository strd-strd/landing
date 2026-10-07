import Image from "next/image";
import Link from "next/link";
import { BrandLink } from "@/app/brand-link";
import { OfficeMap } from "@/app/office-map";
import { CONTACTS } from "@/lib/contacts";
import { NAV_LINKS } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer id="kontakty" className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/logo.svg" alt="Демидов Парк" width={134} height={32} unoptimized />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Инвестиции в доходные автомобили. Управляющая компания <BrandLink />{" "}
            сдаёт авто в аренду в Нижнем Новгороде с 2016 года.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {CONTACTS.legalName}
            <br />
            ИНН {CONTACTS.inn}
            <br />
            ОГРН {CONTACTS.ogrn}
          </p>
          <Link
            href="/privacy"
            className="mt-4 inline-flex min-h-11 cursor-pointer items-center text-sm text-accent underline-offset-4 hover:underline"
          >
            Политика конфиденциальности
          </Link>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Навигация
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 cursor-pointer items-center text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Связаться с нами
          </p>
          <a
            href={CONTACTS.phoneHref}
            className="mt-4 inline-flex min-h-11 cursor-pointer items-center text-lg font-semibold text-foreground transition-colors duration-200 hover:text-accent"
          >
            {CONTACTS.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-muted-foreground">
            {CONTACTS.city}, {CONTACTS.address}
            <br />
            {CONTACTS.hours}
          </p>
          <a
            href={CONTACTS.siteUrl}
            className="mt-3 inline-flex min-h-11 cursor-pointer items-center text-sm text-accent transition-opacity duration-200 hover:opacity-90"
          >
            demidovpark.ru
          </a>
          <OfficeMap className="mt-5" compact />
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        Информация на сайте носит справочный характер и не является публичной
        офертой. © {new Date().getFullYear()} {CONTACTS.legalName}
      </div>
    </footer>
  );
}
