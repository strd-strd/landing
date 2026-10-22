import { BLOG_ARTICLES } from "@/lib/blog";
import { CONTACTS } from "@/lib/contacts";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

/** `/llms.txt` — обзор сайта для LLM (формат v2, llmstxt.org). */
export function GET() {
  const base = getSiteUrl();
  const blogLinks = BLOG_ARTICLES.map(
    (article) =>
      `- [${article.title}](${base}/blog/${article.slug}): ${article.excerpt}`,
  ).join("\n");

  const body = `# ${CONTACTS.brand} — инвестиции

> Инвест-лендинг автопарка «Демидов Парк» в Нижнем Новгороде: вход в пул инвесторов от 100 000 ₽ или сдача своего автомобиля в управление действующему прокату. Ориентиры доходности на сайте — не публичная оферта; условия фиксируются в договоре на встрече с основателем.

Сайт описывает два формата участия: доля в пуле (компания покупает авто в парк и распределяет доход пропорционально вкладу) и своё авто под управлением проката demidovpark.ru (реклама, проверка арендаторов, ТО, выдача — на компании). Цифры вроде «от 45 000 ₽/мес» и «~25% годовых» — ориентиры для разговора, не гарантия и не оферта.

Оператор: ${CONTACTS.legalName}, ИНН ${CONTACTS.inn}, ОГРН ${CONTACTS.ogrn}. Офис: ${CONTACTS.city}, ${CONTACTS.address}. Часы: ${CONTACTS.hours}. Телефон заявок: ${CONTACTS.phoneDisplay}. Telegram: ${CONTACTS.telegramUrl}.

## Страницы

- [Главная](${base}/): оффер, калькуляторы пула и своего авто, FAQ, заявка на консультацию
- [Блог](${base}/blog): статьи об инвестициях в автопарк (пул, управление, риски, ориентиры доходности)
- [Политика конфиденциальности](${base}/privacy): обработка ПДн и cookies
- [Согласие на обработку ПДн](${base}/consent): согласие субъекта персональных данных

## Блог

${blogLinks}

## Связанные ресурсы

- [Автопрокат Демидов Парк](${CONTACTS.siteUrl}): действующий парк аренды, через который идёт загрузка машин
- [Карта офиса](${CONTACTS.mapUrl}): ${CONTACTS.city}, ${CONTACTS.address}

## Optional

- [sitemap.xml](${base}/sitemap.xml): карта URL для поисковых систем
- [robots.txt](${base}/robots.txt): правила индексации
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
