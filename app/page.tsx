import { CallbackForm } from "@/app/callback-form";
import { CheckIcon, ChevronIcon } from "@/app/icons";
import { IncomeClasses } from "@/app/income-classes";
import { CONTACTS } from "@/lib/contacts";
import {
  ADVANTAGES,
  FAQ_ITEMS,
  FEATURES,
  HERO_STATS,
  RENTER_TYPES,
  REVIEWS,
  STEPS,
} from "@/lib/content";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Income />
      <HowItWorks />
      <Advantages />
      <Renters />
      <Reviews />
      <Lead />
      <Faq />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-[calc(var(--header-height)+3rem)] sm:px-6 sm:pb-28 sm:pt-[calc(var(--header-height)+4.5rem)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(226,172,107,0.12),transparent_55%)]" />
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
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            Стать инвестором
          </a>
          <a
            href="#kak"
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border-2 border-foreground/80 px-6 font-semibold text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
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
            Ориентир по сегментам парка при занятости около 20 дней в месяц. Точная
            доходность и вход обсуждаются на встрече с основателем — без общих обещаний.
          </p>
        </div>
        <IncomeClasses />
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
              key={step.n}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <p className="font-serif text-3xl text-accent">{step.n}</p>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
        <a
          href="#zayavka"
          className="mt-10 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
        >
          Оставить заявку
        </a>
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
          {ADVANTAGES.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURES.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent">
                <CheckIcon className="size-4" />
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Renters() {
  return (
    <section className="border-t border-border bg-card/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-serif text-4xl text-foreground sm:text-5xl">
          Кто арендует автомобили парка
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Поток клиентов Demidov Park — семьи, командировки и гости города. Вам не
          нужно согласовывать каждую заявку вручную.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {RENTER_TYPES.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
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
      </div>
    </section>
  );
}

function Lead() {
  return (
    <section id="zayavka" className="border-t border-border bg-card/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-serif text-4xl text-foreground sm:text-5xl">
            Остались вопросы?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Поможем прикинуть сегмент автомобиля, расскажем, как устроено управление
            парком, и пригласим на встречу с Евгением Демидовым.
          </p>
          <p className="mt-6 font-serif text-2xl text-foreground">
            «Цифры доходности я предпочитаю обсуждать лично.»
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Евгений Демидов, основатель Demidov Park
          </p>
        </div>
        <CallbackForm />
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
