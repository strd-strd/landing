"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ConsentCheckbox } from "@/app/consent-checkbox";
import { FormHoneypot } from "@/app/form-honeypot";
import { PhoneInput } from "@/app/phone-input";
import { CONTACTS } from "@/lib/contacts";
import { clientAntispamFromForm } from "@/lib/form-antispam";
import { isValidRuPhone, phoneE164 } from "@/lib/phone-mask";

export function CallbackForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Укажите имя.");
      return;
    }
    if (!isValidRuPhone(phone)) {
      setError("Укажите телефон в формате +7 (XXX) XXX-XX-XX.");
      return;
    }
    if (!consent) {
      setError("Нужно согласие на обработку персональных данных.");
      return;
    }

    const antispam = clientAntispamFromForm(formEl);
    if (!antispam.ok) {
      if (antispam.reason === "too-fast") {
        setError("Подождите секунду и отправьте форму ещё раз.");
        return;
      }
      if (antispam.reason === "too-old") {
        setError("Форма устарела. Обновите страницу и отправьте заявку ещё раз.");
        return;
      }
      setError("Не удалось отправить заявку. Обновите страницу и попробуйте снова.");
      return;
    }

    setError("");
    setSending(true);
    try {
      const body = new FormData(formEl);
      body.set("source", "callback");
      body.set("name", trimmedName);
      body.set("phone", phoneE164(phone));
      body.set("title", "Консультация по входу в пул");

      const response = await fetch("/api/lead", { method: "POST", body });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "Не удалось отправить заявку.");
        setSending(false);
        return;
      }
      setSending(false);
      setError("");
      setName("");
      setPhone("");
      setConsent(false);
      router.push("/spasibo");
      return;
    } catch {
      setError("Не удалось отправить заявку. Проверьте соединение и попробуйте снова.");
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-2xl border border-border bg-card p-6"
      noValidate
    >
      <FormHoneypot />
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
          <PhoneInput
            value={phone}
            onChange={setPhone}
            className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground transition-colors duration-200"
          />
        </label>
        <ConsentCheckbox
          id="callback-pdn-consent"
          checked={consent}
          onChange={setConsent}
        />
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={sending}
          className="btn-shimmer min-h-12 cursor-pointer rounded-lg bg-accent px-5 font-semibold text-on-accent transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? "Отправляем…" : "Обсудить вход с Евгением"}
        </button>
        <p className="text-xs text-muted-foreground">
          Заявка на личную консультацию. Обычно отвечаем в течение рабочего дня.{" "}
          {CONTACTS.hours}.
        </p>
      </div>
    </form>
  );
}
