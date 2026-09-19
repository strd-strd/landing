import { CallbackForm } from "@/app/callback-form";
import { ChevronIcon } from "@/app/icons";
import { IncomeClasses } from "@/app/income-classes";
import { MyReviewsWidget } from "@/app/my-reviews-widget";
import { CONTACTS } from "@/lib/contacts";
import {
  ADVANTAGES,
  ENTRY_HIGHLIGHTS,
  FAQ_ITEMS,
  HERO_STATS,
  REVIEWS,
  STEPS,
  TRUST_STRIP,
} from "@/lib/content";
import Image from "next/image";

const RENTAL_SITE_HOST = "demidovpremium.ru";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Income />
      <EntryPool />
      <HowItWorks />
      <MidCta />
      <Advantages />
      <Reviews />
      <Lead />
      <Faq />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden px-4 pb-20 pt-[calc(var(--header-height)+3rem)] sm:px-6 sm:pb-28 sm:pt-[calc(var(--header-height)+4.5rem)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <video
          className="absolute inset-0 size-full object-cover brightness-110 contrast-105 motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/cadillac-poster.jpg"
        >
          <source src="/cadillac.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
          style={{ backgroundImage: "url(/cadillac-poster.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(226,172,107,0.1),transparent_55%)]" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
          Инвестиции в авто · {CONTACTS.city}
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold uppercase leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Инвестируйте в доходный автомобиль и зарабатывайте от 45 000 ₽ в месяц
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Demidov Park берёт машину в управление: арендаторы, реклама, ТО и выдача —
          на компании. Вы получаете пассивный доход, пока занимаетесь своими делами.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#zayavka"
            className="btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            Получить консультацию
          </a>
          <a
            href="#kak"
            className="btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border-2 border-foreground/80 px-6 font-semibold text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Как это работает
          </a>
        </div>
        <dl className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {HERO_STATS.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-accent/35 bg-card/80 px-5 py-5"
            >
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="mt-1 font-serif text-3xl text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-3xl text-sm text-muted-foreground sm:text-base">
          {TRUST_STRIP.map((item, index) => (
            <span key={item.label}>
              {index > 0 ? (
                <span className="mx-2 text-accent/70" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <span className="font-semibold text-foreground">{item.value}</span>
              {" "}
              {item.label}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Income() {
  return (
    <section id="dohod" className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div>
          <h2 className="font-serif text-4xl text-foreground sm:text-5xl">
            Сколько может приносить автомобиль?
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Ориентир по сегментам парка при занятости около 20 дней в месяц. Минимальный
            вход — от 100 000 ₽ через пул. Точная доходность и доля фиксируются на
            встрече с основателем.
          </p>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Арендаторы находят и бронируют автомобили на{" "}
            <a
              href={CONTACTS.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline-offset-4 transition-opacity duration-200 hover:opacity-90 hover:underline"
            >
              {RENTAL_SITE_HOST}
            </a>
            {" "}
            — это основная точка сдачи парка Demidov Park в аренду. Ваша машина
            выходит в тот же поток клиентов, что и весь автопарк компании.
          </p>
        </div>
        <IncomeClasses />
      </div>
    </section>
  );
}

function EntryPool() {
  return (
    <section id="vhod" className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Вход для инвестора</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl text-foreground sm:text-5xl">
          От 100 000 ₽ — через пул инвесторов
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Ориентир обсуждается на встрече — без скрытого «от миллиона».
        </p>
        <ul className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {ENTRY_HIGHLIGHTS.map((item) => (
            <li
              key={item.title}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card px-6 py-8 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_32px_rgba(226,172,107,0.12)] sm:px-7 sm:py-9"
            >
              <h3 className="font-serif text-3xl leading-tight text-foreground sm:text-[2rem]">
                {item.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <a
            href="#zayavka"
            className="btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            Получить консультацию
          </a>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="kak" className="border-t border-border bg-card/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-serif text-4xl text-foreground sm:text-5xl">Как это работает</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Три шага. Без приложения «сдать соседу»: автомобиль работает в действующем
          прокате Demidov Park.
        </p>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.id}
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_32px_rgba(226,172,107,0.12)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <p className="font-serif text-3xl text-accent">{step.n}</p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {"text" in step ? (
                    step.text
                  ) : (
                    <>
                      {step.textBefore}
                      <a
                        href={CONTACTS.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-accent underline-offset-4 transition-opacity duration-200 hover:opacity-90 hover:underline"
                      >
                        {RENTAL_SITE_HOST}
                      </a>
                      {step.textAfter}
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <a
          href="#zayavka"
          className="btn-shimmer mt-10 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
        >
          Оставить заявку
        </a>
      </div>
    </section>
  );
}

function MidCta() {
  return (
    <section className="border-t border-border px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-2xl border border-accent/40 bg-card px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-10 sm:py-10">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
            Обсудить вход в пул инвесторов с Евгением
          </h2>
          <p className="mt-3 text-muted-foreground">
            От 100 000 ₽ через пул. Евгений Демидов лично разберёт модель, долю и
            сроки выхода авто в линию.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-4">
          <div className="relative size-40 overflow-hidden rounded-full border-2 border-accent/50 sm:size-48">
            <Image
              src="/advantages/founder.jpg"
              alt="Евгений Демидов, основатель Demidov Park"
              fill
              sizes="192px"
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <a
              href="#zayavka"
              className="btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
            >
              Получить консультацию
            </a>
            <a
              href={CONTACTS.phoneHref}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center px-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
            >
              Или позвонить: {CONTACTS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  return (
    <section id="preimushestva" className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">С 2016 года</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl text-foreground sm:text-5xl">
          Управляющая компания, а не доска объявлений
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Около 100 автомобилей в парке и более 40 частных инвесторов. Основатель сам
          владеет частью автопарка — и знает, как вести актив, чтобы инвестору не
          нужно было ничего делать.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ADVANTAGES.map((item) => {
            const featured = "featured" in item && item.featured;
            const cardClassName = featured
              ? "group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-[0_12px_32px_rgba(226,172,107,0.14)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(226,172,107,0.22)]"
              : "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_32px_rgba(226,172,107,0.12)]";

            const body = (
              <>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                      item.id === "founder" ? "object-top" : ""
                    }`}
                  />
                  {featured ? (
                    <span className="absolute left-4 top-4 rounded-md bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-on-accent">
                      {RENTAL_SITE_HOST}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  {featured ? (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      Смотреть парк на сайте аренды
                      <span aria-hidden="true">→</span>
                    </span>
                  ) : null}
                </div>
              </>
            );

            if (featured) {
              return (
                <a
                  key={item.id}
                  href={CONTACTS.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClassName} cursor-pointer`}
                  aria-label={`${item.title} — открыть ${RENTAL_SITE_HOST}`}
                >
                  {body}
                </a>
              );
            }

            return (
              <article key={item.id} className={cardClassName}>
                {body}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="otzyvy" className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-serif text-4xl text-foreground sm:text-5xl">
          Отзывы инвесторов
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {REVIEWS.map((item) => (
            <blockquote
              key={item.name}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="text-base leading-relaxed text-foreground">{item.text}</p>
              <footer className="mt-5">
                <cite className="not-italic font-semibold">{item.name}</cite>
                <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="font-serif text-3xl text-foreground sm:text-4xl">
            Отзывы клиентов автопроката Demidov Park
          </h3>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Реальные отзывы арендаторов с{" "}
            <a
              href={CONTACTS.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline-offset-4 transition-opacity duration-200 hover:opacity-90 hover:underline"
            >
              {RENTAL_SITE_HOST}
            </a>
            {" "}
            — того же парка, куда выходит автомобиль инвестора.
          </p>
          <MyReviewsWidget />
        </div>
      </div>
    </section>
  );
}

function Lead() {
  return (
    <section id="zayavka" className="border-t border-border bg-card/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="font-serif text-4xl text-foreground sm:text-5xl">
            Получить личную консультацию Евгения
          </h2>
          <p className="mt-4 text-muted-foreground">
            Разберём вход от 100 000 ₽, долю в пуле и сегмент автомобиля. Евгений
            Демидов пригласит на встречу и ответит на вопросы по договору.
          </p>
          <p className="mt-6 font-serif text-2xl text-foreground">
            «Цифры доходности я предпочитаю обсуждать лично.»
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Евгений Демидов, основатель Demidov Park
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-background px-5 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              Юридическая ясность
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Комиссия управляющей компании покрывает площадку и рекламу на{" "}
              {RENTAL_SITE_HOST}, проверку клиентов, договоры, платежи, ТО, поддержку
              и выдачу авто. Процент, сетка выплат и условия пула фиксируются в
              договоре до выхода машины в линию. Информация на сайте — ориентир, не
              публичная оферта.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {CONTACTS.legalName} · ИНН {CONTACTS.inn} · ОГРН {CONTACTS.ogrn}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5">
          <div className="relative size-48 overflow-hidden rounded-full border-2 border-accent/50 sm:size-56">
            <Image
              src="/advantages/founder.jpg"
              alt="Евгений Демидов, основатель Demidov Park"
              fill
              sizes="224px"
              className="object-cover object-top"
            />
          </div>
          <div className="w-full">
            <CallbackForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="font-serif text-4xl text-foreground sm:text-5xl">Вопросы</h2>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group py-2">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-base font-semibold marker:content-none">
                <span>{item.q}</span>
                <ChevronIcon className="size-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
