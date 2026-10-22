import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_SHORT, CONTACTS } from "@/lib/contacts";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Спасибо · ${BRAND_SHORT}`,
  description:
    "Заявка на консультацию по инвестициям принята. Мы свяжемся с вами.",
  path: "/spasibo",
  noIndex: true,
});

export default function SpasiboPage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-16 sm:px-6"
    >
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        {BRAND_SHORT}
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
        Спасибо — ваша заявка принята
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Мы перезвоним или напишем в период с 9:00 до 19:00 ежедневно и разберём
        вход в пул или сдачу авто в управление.
      </p>
      <p className="mt-3 text-base leading-relaxed text-foreground">
        Дождитесь нашего звонка или сообщения.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Если срочно —{" "}
        <a
          href={CONTACTS.phoneHref}
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          {CONTACTS.phoneDisplay}
        </a>
        {" · "}
        <a
          href={CONTACTS.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          Telegram
        </a>
      </p>
      <Link
        href="/"
        className="btn-shimmer mt-10 inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
      >
        На главную
      </Link>
    </main>
  );
}
