import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_ARTICLES, getBlogArticle } from "@/lib/blog";
import { CONTACTS } from "@/lib/contacts";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) {
    return { title: "Статья | Demidov Park" };
  }
  return {
    title: `${article.title} | Demidov Park`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) {
    notFound();
  }

  return (
    <main id="main" className="border-t border-border">
      <article className="px-4 pb-20 pt-[calc(var(--header-height)+2.5rem)] sm:px-6 sm:pb-24 sm:pt-[calc(var(--header-height)+3.5rem)]">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-accent transition-opacity duration-200 hover:opacity-90"
          >
            ← Все статьи
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-accent">
            {article.dateLabel} · Блог
          </p>
          <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>

          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-10 space-y-8">
            {article.sections.map((section) => (
              <section key={section.heading ?? section.paragraphs[0]}>
                {section.heading ? (
                  <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                    {section.heading}
                  </h2>
                ) : null}
                <div className={section.heading ? "mt-4 space-y-4" : "space-y-4"}>
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card px-5 py-5">
            <p className="text-sm text-muted-foreground">
              Полная версия статьи — на сайте проката Demidov Park.
            </p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
            >
              Читать на {article.sourceLabel}
            </a>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Интересен вход в пул инвесторов от 100 000 ₽?
            </p>
            <Link
              href="/#zayavka"
              className="btn-shimmer inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-accent/60 px-5 text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent/10"
            >
              Получить консультацию
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Источник:{" "}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              {CONTACTS.siteUrl.replace("https://", "")}
            </a>
          </p>
        </div>
      </article>
    </main>
  );
}
