"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CloseIcon } from "@/app/icons";
import { CONTACTS } from "@/lib/contacts";

const ANNUAL_RATE = 0.25;
const VALUE_MIN = 400_000;
const VALUE_MAX = 6_000_000;
const VALUE_STEP = 50_000;
const VALUE_DEFAULT = 1_500_000;
const YEAR_MIN = 2014;
const YEAR_MAX = new Date().getFullYear();

function formatRub(value: number) {
  return `${Math.round(value).toLocaleString("ru-RU").replace(/\u00A0/g, "\u00A0")}\u00A0₽`;
}

export function OwnCarCalculator() {
  const [value, setValue] = useState(VALUE_DEFAULT);
  const [year, setYear] = useState(YEAR_MAX - 3);
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const yearly = value * ANNUAL_RATE;
  const monthly = yearly / 12;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      openButtonRef.current?.focus();
    };
  }, [open]);

  function openLead() {
    setSent(false);
    setError("");
    setOpen(true);
  }

  function closeLead() {
    setOpen(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCar = car.trim();
    const trimmedName = name.trim();
    const trimmedPhone = phone.replace(/\s/g, "");

    if (trimmedCar.length < 2) {
      setError("Укажите марку и модель авто.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Укажите имя.");
      return;
    }
    if (trimmedPhone.length < 10) {
      setError("Укажите телефон.");
      return;
    }
    if (!consent) {
      setError("Нужно согласие на обработку персональных данных.");
      return;
    }

    setError("");
    setSent(true);
  }

  return (
    <section id="svoe-auto" className="border-t border-border px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Своё авто</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl text-foreground sm:text-5xl">
            Так же можете отдать своё авто нам в управление
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Машина выходит в прокат Демидов Парк: реклама, арендаторы, ТО и выдача — на
            компании. Вы получаете выплаты. Ориентир ниже — при ставке{" "}
            <span className="whitespace-nowrap font-semibold text-accent">25% годовых</span>{" "}
            от оценочной стоимости.
          </p>
        </div>

        <div className="rounded-2xl border border-accent/50 bg-card p-6 shadow-[0_12px_32px_rgba(226,172,107,0.14)] sm:p-8">
          <label className="block">
            <span className="flex items-end justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Стоимость вашего авто
              </span>
              <span className="font-serif text-2xl text-foreground sm:text-3xl">
                {formatRub(value)}
              </span>
            </span>
            <input
              type="range"
              min={VALUE_MIN}
              max={VALUE_MAX}
              step={VALUE_STEP}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-accent"
              aria-valuetext={formatRub(value)}
            />
            <span className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatRub(VALUE_MIN)}</span>
              <span>{formatRub(VALUE_MAX)}</span>
            </span>
          </label>

          <label className="mt-8 block">
            <span className="flex items-end justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">Год выпуска</span>
              <span className="font-serif text-2xl text-foreground">{year}</span>
            </span>
            <input
              type="range"
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-accent"
            />
          </label>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-accent/35 bg-background/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-accent">В месяц</p>
              <p className="mt-2 font-serif text-3xl leading-tight text-foreground">
                {formatRub(monthly)}
              </p>
            </div>
            <div className="rounded-xl border border-accent/35 bg-background/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-accent">За год</p>
              <p className="mt-2 font-serif text-3xl leading-tight text-foreground">
                {formatRub(yearly)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Ориентир при 25% годовых от указанной стоимости. Точная оценка и условия — после
            осмотра и разбора модели на консультации.
          </p>

          <button
            ref={openButtonRef}
            type="button"
            onClick={openLead}
            className="btn-shimmer mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-accent px-6 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90 sm:w-auto"
          >
            Получить точное предложение и консультацию
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-background/80"
            aria-label="Закрыть окно заявки"
            onClick={closeLead}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-md rounded-2xl border border-accent/45 bg-card p-6 shadow-[var(--shadow-xl)]"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p id={titleId} className="font-serif text-2xl text-foreground">
                  Заявка на своё авто
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ориентир в калькуляторе: {formatRub(value)} · {year} г.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-foreground"
                aria-label="Закрыть"
                onClick={closeLead}
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {sent ? (
              <div>
                <p className="font-semibold text-foreground">Заявка принята</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Напишите в Telegram или MAX — так быстрее согласуем осмотр и точное
                  предложение. {CONTACTS.hours}.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={CONTACTS.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
                  >
                    Telegram
                  </a>
                  <a
                    href={CONTACTS.maxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-border px-4 font-semibold text-foreground transition-colors duration-200 hover:border-accent"
                  >
                    MAX
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
                <label className="block text-sm font-medium">
                  Какое авто
                  <input
                    type="text"
                    name="car"
                    autoComplete="off"
                    placeholder="Например, BMW 5, 2020"
                    value={car}
                    onChange={(event) => setCar(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground transition-colors duration-200"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Год выпуска
                  <input
                    type="number"
                    name="year"
                    min={YEAR_MIN}
                    max={YEAR_MAX}
                    value={year}
                    onChange={(event) => setYear(Number(event.target.value) || year)}
                    className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground transition-colors duration-200"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Имя
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground transition-colors duration-200"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Телефон
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground transition-colors duration-200"
                  />
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1 size-4 cursor-pointer accent-accent"
                  />
                  <span>Соглашаюсь на обработку персональных данных.</span>
                </label>
                {error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="btn-shimmer min-h-12 cursor-pointer rounded-lg bg-accent px-5 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
                >
                  Отправить заявку
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
