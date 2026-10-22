"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ConsentCheckbox } from "@/app/consent-checkbox";
import { FormHoneypot } from "@/app/form-honeypot";
import { CloseIcon } from "@/app/icons";
import { PhoneInput } from "@/app/phone-input";
import { clientAntispamFromForm } from "@/lib/form-antispam";
import { LEAD_POPUP_EVENT, type LeadPopupDetail } from "@/lib/lead-popup";
import { isValidRuPhone, phoneE164 } from "@/lib/phone-mask";

export function LeadPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<LeadPopupDetail>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [year, setYear] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Сброс honeypot-таймера при каждом открытии попапа. */
  const [formKey, setFormKey] = useState(0);

  function closeAndReset() {
    setOpen(false);
    setName("");
    setPhone("");
    setCar("");
    setYear("");
    setConsent(false);
    setError("");
    setSending(false);
    setDetail({});
  }

  // Layout-mounted popup survives soft navigate — sync closed on thanks page.
  if (pathname === "/spasibo" && open) {
    closeAndReset();
  }

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
      setSending(false);
      setFormKey((key) => key + 1);
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
        setError("Форма устарела. Закройте окно, откройте заявку снова и отправьте ещё раз.");
        return;
      }
      setError("Не удалось отправить заявку. Обновите страницу и попробуйте снова.");
      return;
    }

    setError("");
    setSending(true);
    try {
      const body = new FormData(formEl);
      body.set("source", "popup");
      body.set("name", trimmedName);
      body.set("phone", phoneE164(phone));
      body.set("title", detail.title ?? "Заявка на консультацию");
      if (detail.context) body.set("context", detail.context);
      body.set("car", car.trim());
      body.set("year", year.trim());

      const response = await fetch("/api/lead", { method: "POST", body });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "Не удалось отправить заявку.");
        setSending(false);
        return;
      }
      closeAndReset();
      router.push("/spasibo");
      return;
    } catch {
      setError("Не удалось отправить заявку. Проверьте соединение и попробуйте снова.");
      setSending(false);
    }
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

        <form
          key={formKey}
          onSubmit={onSubmit}
          className="relative flex flex-col gap-4"
          noValidate
        >
          <FormHoneypot />
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
            <PhoneInput
              value={phone}
              onChange={setPhone}
              className="mt-2 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground"
            />
          </label>
          <ConsentCheckbox
            id="lead-popup-pdn-consent"
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
            {sending ? "Отправляем…" : "Отправить заявку"}
          </button>
        </form>
      </div>
    </div>
  );
}
