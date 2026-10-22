import type { Metadata } from "next";
import Link from "next/link";
import { GTM_ID } from "@/app/google-tag-manager";
import { BRAND_SHORT, CONTACTS } from "@/lib/contacts";
import { YANDEX_METRIKA_ID } from "@/lib/analytics";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Политика конфиденциальности",
  description: `Политика обработки персональных данных и cookies — ${BRAND_SHORT}, инвестиции в автомобили, ${CONTACTS.city}. Оператор: ${CONTACTS.legalName}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Политика конфиденциальности", path: "/privacy" },
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
        Политика конфиденциальности
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {CONTACTS.legalName} · ИНН {CONTACTS.inn} · ОГРН {CONTACTS.ogrn}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Отдельное{" "}
        <Link href="/consent" className="text-accent underline underline-offset-2">
          согласие на обработку персональных данных
        </Link>
        .
      </p>

      <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Общие положения</h2>
          <p className="mt-3 text-muted-foreground">
            Настоящая политика определяет порядок обработки персональных данных пользователей
            сайта {CONTACTS.canonicalHost} (далее — Сайт) и связанных каналов связи бренда{" "}
            {BRAND_SHORT} по инвестициям в автомобили в городе {CONTACTS.city}. Оператор:{" "}
            {CONTACTS.legalName}. Используя Сайт или оставляя заявку, вы подтверждаете
            ознакомление с политикой. Согласие на обработку ПДн оформляется отдельно — см.{" "}
            <Link href="/consent" className="text-accent underline underline-offset-2">
              страницу согласия
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Оператор</h2>
          <p className="mt-3 text-muted-foreground">
            {CONTACTS.legalName}
            <br />
            ИНН {CONTACTS.inn}, ОГРН {CONTACTS.ogrn}
            <br />
            Адрес: {CONTACTS.city}, {CONTACTS.address}
            <br />
            Телефон:{" "}
            <a href={CONTACTS.phoneHref} className="text-accent underline underline-offset-2">
              {CONTACTS.phoneDisplay}
            </a>
            <br />
            Режим работы: {CONTACTS.hours}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Какие данные мы получаем</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>имя и номер телефона — при отправке заявки на консультацию или сдачу авто;</li>
            <li>марка, модель и год автомобиля — если вы указали их в форме;</li>
            <li>сумма вложений или оценочная стоимость авто — если передали из калькулятора;</li>
            <li>
              технические данные: IP, cookie, тип браузера, данные антиспама — для работы Сайта
              и защиты от автоматизированных заявок;
            </li>
            <li>
              идентификатор и профиль Telegram — если вы запускаете бота или связанные каналы{" "}
              {BRAND_SHORT} (когда такие сервисы подключены).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Цели обработки</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              связь по заявке, обсуждение входа в пул инвесторов или сдачи автомобиля в
              управление;
            </li>
            <li>ответы на вопросы в мессенджерах и по телефону;</li>
            <li>антиспам и обеспечение безопасности Сайта;</li>
            <li>улучшение сервиса и анализ посещаемости (после согласия на cookies);</li>
            <li>
              сервисные и информационные сообщения пользователям, которые сами начали диалог
              в мессенджерах или боте (с возможностью отписки, где это применимо).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Cookies и аналитика</h2>
          <p className="mt-3 text-muted-foreground">
            Сайт использует необходимые cookies и localStorage: согласие на баннере, работа
            форм, защита от спама. После нажатия «Хорошо» на баннере подключается
            Яндекс.Метрика (счётчик {YANDEX_METRIKA_ID}) — статистика посещений, карта кликов,
            вебвизор. Google Tag Manager (контейнер {GTM_ID}) используется для управления
            тегами. Обработка данных аналитики регулируется политиками Яндекса и Google. Мы не
            продаём персональные данные.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Передача и хранение</h2>
          <p className="mt-3 text-muted-foreground">
            Заявки направляются менеджерам Оператора в рабочие мессенджеры для оперативной
            обработки. Данные хранятся на инфраструктуре хостинга и в базе данных Оператора
            столько, сколько нужно для консультации, законных обязанностей и защиты прав, либо
            до вашего обращения об удалении — если иное не требует закон.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Права пользователя</h2>
          <p className="mt-3 text-muted-foreground">
            Вы вправе запросить уточнение, блокирование или удаление данных, отозвать согласие
            на обработку (см.{" "}
            <Link href="/consent" className="text-accent underline underline-offset-2">
              согласие
            </Link>
            ) и получить информацию об обработке. Обращения принимаются по телефону{" "}
            <a href={CONTACTS.phoneHref} className="text-accent underline underline-offset-2">
              {CONTACTS.phoneDisplay}
            </a>{" "}
            или через каналы связи в{" "}
            <Link href="/#kontakty" className="text-accent underline underline-offset-2">
              футере сайта
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Контакты оператора</h2>
          <p className="mt-3 text-muted-foreground">
            {CONTACTS.legalName}
            <br />
            {CONTACTS.city}, {CONTACTS.address}
            <br />
            Телефон:{" "}
            <a href={CONTACTS.phoneHref} className="text-accent underline underline-offset-2">
              {CONTACTS.phoneDisplay}
            </a>
          </p>
        </section>
      </div>

      <p className="mt-12 flex flex-wrap gap-4 text-sm">
        <Link href="/consent" className="font-medium text-accent underline-offset-4 hover:underline">
          Согласие на обработку ПДн
        </Link>
        <Link href="/" className="font-medium text-accent underline-offset-4 hover:underline">
          На главную
        </Link>
      </p>
    </main>
  );
}
