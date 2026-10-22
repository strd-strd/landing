import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_SHORT } from "@/lib/contacts";

export const metadata: Metadata = {
  title: { absolute: `Страница не найдена | ${BRAND_SHORT}` },
  description: `Запрошенная страница не существует — ${BRAND_SHORT}, инвестиции в автомобили.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-16 sm:px-6"
    >
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        404
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
        Страница не найдена
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Такой страницы нет или ссылка устарела. Вернитесь на главную или откройте
        блог об инвестициях в автопарк.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="btn-shimmer inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
        >
          На главную
        </Link>
        <Link
          href="/blog"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-foreground/80 px-6 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          Блог
        </Link>
      </div>
    </main>
  );
}
