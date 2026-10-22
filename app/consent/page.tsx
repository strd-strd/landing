import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_SHORT, CONTACTS } from "@/lib/contacts";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Согласие на обработку персональных данных",
  description: `Согласие субъекта персональных данных на обработку ПДн — ${BRAND_SHORT}, инвестиции в автомобили, ${CONTACTS.city}.`,
  path: "/consent",
});

export default function ConsentPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Согласие на обработку ПДн", path: "/consent" },
  ]);

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Правовая информация
      </p>
      <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
        Согласие на обработку персональных данных
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {CONTACTS.legalName} · ИНН {CONTACTS.inn} · ОГРН {CONTACTS.ogrn}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Действует вместе с{" "}
        <Link href="/privacy" className="text-accent underline underline-offset-2">
          политикой конфиденциальности
        </Link>
        .
      </p>

      <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Оператор</h2>
          <p className="mt-3 text-muted-foreground">
            Оператор персональных данных: {CONTACTS.legalName}, ИНН {CONTACTS.inn}, ОГРН{" "}
            {CONTACTS.ogrn}, адрес: {CONTACTS.city}, {CONTACTS.address}. Телефон:{" "}
            <a href={CONTACTS.phoneHref} className="text-accent underline underline-offset-2">
              {CONTACTS.phoneDisplay}
            </a>
            . Сайт: {CONTACTS.canonicalHost}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Суть согласия</h2>
          <p className="mt-3 text-muted-foreground">
            Отмечая чекбокс на сайте либо иным явно выраженным действием (отправка заявки после
            ознакомления с текстом), вы свободно, своей волей и в своём интересе даёте{" "}
            {CONTACTS.legalName} согласие на обработку ваших персональных данных на условиях
            настоящей страницы и{" "}
            <Link href="/privacy" className="text-accent underline underline-offset-2">
              политики конфиденциальности
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Какие данные</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>фамилия, имя (при указании);</li>
            <li>номер телефона;</li>
            <li>
              марка, модель, год автомобиля, сумма вложений или оценочная стоимость — если
              указаны в форме или переданы из калькулятора;
            </li>
            <li>
              технические данные (IP, cookie, тип устройства) — для работы Сайта, антиспама и
              аналитики после согласия на cookies.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Цели</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              связь по заявке о входе в пул инвесторов или сдаче автомобиля в управление;
            </li>
            <li>ответы в мессенджерах и по телефону;</li>
            <li>защита от спама и злоупотреблений формами;</li>
            <li>
              улучшение Сайта и сервиса (в т.ч. обезличенная статистика посещений).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Действия с данными</h2>
          <p className="mt-3 text-muted-foreground">
            Сбор, запись, систематизация, хранение, уточнение, использование, передача
            (предоставление доступа менеджерам Оператора), обезличивание, блокирование,
            удаление и уничтожение — в объёме, необходимом для указанных целей, с
            использованием средств автоматизации и без них.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Передача</h2>
          <p className="mt-3 text-muted-foreground">
            Данные заявки могут направляться сотрудникам Оператора в рабочие каналы Telegram
            для оперативной обработки. Хостинг Сайта и инфраструктура (в т.ч. база данных)
            размещаются у провайдеров, с которыми заключены соответствующие договоры.
            Аналитика: Яндекс.Метрика и Google Tag Manager — после согласия на cookies (Метрика)
            и на условиях политик Яндекса и Google. Иные третьи лица получают данные только в
            случаях, предусмотренных законом, или с вашего отдельного согласия.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Срок</h2>
          <p className="mt-3 text-muted-foreground">
            Согласие действует до достижения целей обработки, отзыва согласия либо истечения
            сроков хранения, установленных законом и внутренними правилами Оператора (как
            правило — в пределах срока, необходимого для консультации и исполнения обязанностей
            Оператора, если иное не требует закон).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Отзыв согласия</h2>
          <p className="mt-3 text-muted-foreground">
            Вы можете отозвать согласие, направив обращение Оператору по телефону{" "}
            <a href={CONTACTS.phoneHref} className="text-accent underline underline-offset-2">
              {CONTACTS.phoneDisplay}
            </a>{" "}
            или через заявку на сайте с пометкой «отзыв согласия на обработку ПДн». Отзыв не
            влияет на законность обработки до момента отзыва. Обработка, необходимая для
            исполнения договора или закона, может продолжаться в пределах допустимого.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Подтверждение</h2>
          <p className="mt-3 text-muted-foreground">
            Отправляя заявку с отмеченным чекбоксом согласия, вы подтверждаете, что вам
            исполнилось 18 лет, данные указаны вами добровольно и верны, а с текстом согласия и
            политикой конфиденциальности вы ознакомлены. Информация на Сайте носит справочный
            характер и не является публичной офертой.
          </p>
        </section>
      </div>

      <p className="mt-12 flex flex-wrap gap-4 text-sm">
        <Link href="/privacy" className="font-medium text-accent underline-offset-4 hover:underline">
          Политика конфиденциальности
        </Link>
        <Link href="/" className="font-medium text-accent underline-offset-4 hover:underline">
          На главную
        </Link>
      </p>
    </main>
  );
}
