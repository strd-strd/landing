import Image from "next/image";
import { CONTACTS } from "@/lib/contacts";
import { NAV_LINKS } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer id="kontakty" className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/logo.svg" alt="Demidov Park" width={134} height={32} unoptimized />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Инвестиции в доходные автомобили. Управляющая компания Demidov Park
            сдаёт парк в аренду через{" "}
            <a
              href={CONTACTS.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-opacity duration-200 hover:opacity-90"
            >
              demidovpremium.ru
            </a>
            . Нижний Новгород, с 2016 года.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {CONTACTS.legalName}
            <br />
            ИНН {CONTACTS.inn}
            <br />
            ОГРН {CONTACTS.ogrn}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Навигация
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 cursor-pointer items-center text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </a>
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
            demidovpremium.ru
          </a>
          <a
            href={CONTACTS.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block overflow-hidden rounded-xl border border-border transition-opacity duration-200 hover:opacity-90"
            aria-label={`Открыть карту: ${CONTACTS.city}, ${CONTACTS.address}`}
          >
            <iframe
              title={`Офис Demidov Park — ${CONTACTS.address}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(CONTACTS.mapLon) - 0.012}%2C${Number(CONTACTS.mapLat) - 0.007}%2C${Number(CONTACTS.mapLon) + 0.012}%2C${Number(CONTACTS.mapLat) + 0.007}&layer=mapnik&marker=${CONTACTS.mapLat}%2C${CONTACTS.mapLon}`}
              className="pointer-events-none h-40 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="block border-t border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              Офис на Родионова, 169А — открыть в Яндекс Картах
            </span>
          </a>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        Информация на сайте носит справочный характер и не является публичной
        офертой. © {new Date().getFullYear()} {CONTACTS.legalName}
      </div>
    </footer>
  );
}
