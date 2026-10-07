"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CloseIcon, TelegramIcon } from "@/app/icons";
import { CONTACTS } from "@/lib/contacts";
import { LEAD_POPUP_EVENT, type LeadPopupDetail } from "@/lib/lead-popup";

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<LeadPopupDetail>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [year, setYear] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onOpen(event: Event) {
      const custom = event as CustomEvent<LeadPopupDetail>;
      const next = custom.detail ?? {};
      setDetail(next);
      setCar(next.car ?? "");
      setYear(next.year ? String(next.year) : "");
      setName("");
      setPhone("");
      setConsent(false);
      setError("");
      setSent(false);
      setOpen(true);
    }
    window.addEventListener(LEAD_POPUP_EVENT, onOpen);
    return () => window.removeEventListener(LEAD_POPUP_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.replace(/\s/g, "");
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

  if (!open) return null;

  const title = detail.title ?? "Заявка на консультацию";
  const subtitle =
    detail.subtitle ?? "Евгений Демидов разберёт вход, долю и условия лично.";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-background/80"
        aria-label="Закрыть окно заявки"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-accent/45 bg-card p-6 shadow-[var(--shadow-xl)]"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p id={titleId} className="font-serif text-2xl text-foreground">
              {title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            {detail.context ? (
              <p className="mt-3 rounded-lg border border-accent/30 bg-background/70 px-3 py-2 text-sm text-foreground">
                {detail.context}
              </p>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-foreground"
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {sent ? (
          <div>
            <p className="font-semibold text-foreground">Заявка принята</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Напишите Евгению в Telegram — так быстрее ответим. {CONTACTS.hours}.
            </p>
            <a
              href={CONTACTS.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
            >
              <TelegramIcon className="size-5" />
              Написать Евгению в Telegram
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            {detail.car !== undefined || detail.year !== undefined ? (
              <>
                <label className="block text-sm font-medium">
                  Какое авто
                  <input
                    type="text"
                    name="car"
                    value={car}
                    onChange={(event) => setCar(event.target.value)}
                    placeholder="Например, BMW 5"
                    className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Год выпуска
                  <input
                    type="text"
                    name="year"
                    inputMode="numeric"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground"
                  />
                </label>
              </>
            ) : null}
            <label className="block text-sm font-medium">
              Имя
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground"
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
                className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground"
              />
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 size-4 cursor-pointer accent-accent"
              />
              <span>
                Соглашаюсь на{" "}
                <Link
                  href="/privacy"
                  className="text-accent underline-offset-2 hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  обработку персональных данных
                </Link>
                .
              </span>
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
  );
}
