"use client";

import { useState, type FormEvent } from "react";
import { CONTACTS } from "@/lib/contacts";
import { MaxIcon, TelegramIcon } from "@/app/icons";

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
          Пока заявки принимаем в Telegram и MAX — так быстрее ответим. ИИ-ассистента
          подключим отдельно.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href={CONTACTS.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            <TelegramIcon className="size-5" />
            Telegram
          </a>
          <a
            href={CONTACTS.maxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 font-semibold text-foreground transition-colors duration-200 hover:border-accent"
          >
            <MaxIcon className="size-5" />
            MAX
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
            Нажимая кнопку, я соглашаюсь на обработку персональных данных.
          </span>
        </label>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="min-h-12 cursor-pointer rounded-lg bg-accent px-5 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90"
        >
          Перезвоните мне
        </button>
        <p className="text-xs text-muted-foreground">
          Обычно отвечаем в течение рабочего дня. {CONTACTS.hours}.
        </p>
      </div>
    </form>
  );
}
