"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CONTACTS } from "@/lib/contacts";
import { TelegramIcon } from "@/app/icons";

export function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

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

  if (sent) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-card p-6">
        <p className="font-serif text-2xl text-foreground">Заявка принята</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Пока заявки принимаем в Telegram — так быстрее ответим. Напишите Евгению.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href={CONTACTS.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            <TelegramIcon className="size-5" />
            Написать Евгению в Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6" noValidate>
      <div className="flex flex-col gap-4">
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
          <span>
            Соглашаюсь на{" "}
            <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
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
          Обсудить вход с Евгением
        </button>
        <p className="text-xs text-muted-foreground">
          Заявка на личную консультацию. Обычно отвечаем в течение рабочего дня.{" "}
          {CONTACTS.hours}.
        </p>
      </div>
    </form>
  );
}
