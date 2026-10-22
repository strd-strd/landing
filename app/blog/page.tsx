import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_ARTICLES } from "@/lib/blog";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Блог об инвестициях в автопарк",
  description:
    "Пул инвесторов от 100 000 ₽, своё авто в управление, доходность ~25% и риски — материалы для инвесторов Демидов Парк в Нижнем Новгороде.",
  path: "/blog",
});

export default function BlogPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Блог", path: "/blog" },
  ]);

  return (
    <main id="main" className="border-t border-border">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="px-4 pb-20 pt-[calc(var(--header-height)+2.5rem)] sm:px-6 sm:pb-24 sm:pt-[calc(var(--header-height)+3.5rem)]">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Блог</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl text-foreground sm:text-5xl">
            Инвестиции в автопарк: статьи и разборы
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Пул инвесторов, своё авто в управление, расчёт доходности и риски — материалы
            для тех, кто рассматривает вход в Демидов Парк.
          </p>

          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {BLOG_ARTICLES.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_32px_rgba(226,172,107,0.12)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-accent">
                      {article.dateLabel}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl text-foreground">
                      {article.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {article.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-accent">
                      Читать →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
