import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_SHORT, CONTACTS } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Демидов Парк",
  description: `Политика обработки персональных данных — ${BRAND_SHORT}, инвестиции в автомобили, Нижний Новгород.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Правовая информация
      </p>
      <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
        Политика конфиденциальности
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {CONTACTS.legalName} · ИНН {CONTACTS.inn} · ОГРН {CONTACTS.ogrn}
      </p>

      <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Общие положения</h2>
          <p className="mt-3 text-muted-foreground">
            Настоящая политика определяет порядок обработки персональных данных пользователей
            сайта invest.demidovpark.ru (далее — Сайт) и связанных каналов связи {BRAND_SHORT} в
            городе {CONTACTS.city}. Используя Сайт или оставляя заявку, вы подтверждаете согласие
            с условиями политики в объёме, необходимом для обработки обращения.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Какие данные мы получаем</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>имя и номер телефона — при отправке заявки на консультацию или сдачу авто;</li>
            <li>марка, модель и год автомобиля — если вы указали их в форме;</li>
            <li>сумма вложений или оценочная стоимость авто — если передали из калькулятора;</li>
            <li>
              технические данные: IP, cookie, тип браузера — для работы Сайта и защиты от спама.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Цели обработки</h2>
          <p className="mt-3 text-muted-foreground">
            Данные используются для связи по заявке, обсуждения входа в пул инвесторов или сдачи
            автомобиля в управление, ответа на вопросы и улучшения работы Сайта.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
          <p className="mt-3 text-muted-foreground">
            Сайт может использовать необходимые и служебные cookies для работы форм и защиты от
            автоматизированных заявок. Мы не продаём персональные данные третьим лицам.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Передача и хранение</h2>
          <p className="mt-3 text-muted-foreground">
            Заявки могут направляться основателю и менеджерам в рабочие мессенджеры компании для
            оперативной обработки. Контакты хранятся столько, сколько нужно для консультации и
            законных обязанностей, либо до вашего обращения об удалении — если иное не требует
            закон.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Контакты оператора</h2>
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

      <p className="mt-12">
        <Link
          href="/"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          На главную
        </Link>
      </p>
    </main>
  );
}
