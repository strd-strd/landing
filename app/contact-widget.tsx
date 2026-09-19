"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CONTACTS } from "@/lib/contacts";
import { AssistantIcon, CloseIcon, MaxIcon, TelegramIcon } from "@/app/icons";

export function ContactWidget() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    focusables?.[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusables || focusables.length === 0) {
        return;
      }
      const items = Array.from(focusables);
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  return (
    <div className="contact-widget pointer-events-none fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${panelId}-title`}
          className="pointer-events-auto w-[min(100vw-2rem,20.5rem)] rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-xl)]"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p id={`${panelId}-title`} className="font-semibold text-foreground">
                Написать нам
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Выберите канал. ИИ-ассистент подключим позже.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-foreground"
              aria-label="Закрыть"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={CONTACTS.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 text-left transition-colors duration-200 hover:border-accent"
            >
              <TelegramIcon className="size-5 text-accent" />
              <span>
                <span className="block text-sm font-semibold">Telegram</span>
                <span className="block text-xs text-muted-foreground">
                  Написать менеджеру
                </span>
              </span>
            </a>
            <a
              href={CONTACTS.maxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 text-left transition-colors duration-200 hover:border-accent"
            >
              <MaxIcon className="size-5 text-accent" />
              <span>
                <span className="block text-sm font-semibold">MAX</span>
                <span className="block text-xs text-muted-foreground">
                  Написать менеджеру
                </span>
              </span>
            </a>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex min-h-12 cursor-not-allowed items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-3 text-left opacity-60"
            >
              <AssistantIcon className="size-5" />
              <span>
                <span className="block text-sm font-semibold">ИИ-ассистент</span>
                <span className="block text-xs text-muted-foreground">Скоро</span>
              </span>
            </button>
          </div>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        className="btn-shimmer pointer-events-auto inline-flex min-h-14 min-w-14 cursor-pointer items-center justify-center rounded-full border border-accent bg-accent text-on-accent shadow-[var(--shadow-lg)] transition-opacity duration-200 hover:opacity-90"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Закрыть выбор канала" : "Написать в Telegram, MAX или ассистенту"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon className="size-6" /> : <AssistantIcon className="size-6" />}
      </button>
    </div>
  );
}
