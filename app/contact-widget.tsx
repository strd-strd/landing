"use client";

import { useEffect, useId, useRef, useState } from "react";
import { WidgetChat } from "@/app/widget-chat";
import { CONTACTS } from "@/lib/contacts";
import { AssistantIcon, CloseIcon, TelegramIcon } from "@/app/icons";

type Panel = "channels" | "chat";

export function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("channels");
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panelEl = panelRef.current;
    const previouslyFocused = document.activeElement;
    const focusables = panelEl?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), textarea",
    );
    focusables?.[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAll();
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
  }, [open, panel]);

  function closeAll() {
    setOpen(false);
    setPanel("channels");
    buttonRef.current?.focus();
  }

  return (
    <div className="contact-widget pointer-events-none fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${panelId}-title`}
          className="pointer-events-auto w-[min(100vw-2rem,22rem)] rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-xl)]"
        >
          {panel === "chat" ? (
            <WidgetChat
              onBack={() => setPanel("channels")}
              onClose={closeAll}
            />
          ) : (
            <>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p
                    id={`${panelId}-title`}
                    className="font-semibold text-foreground"
                  >
                    Написать нам
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Менеджер в Telegram или ИИ-ассистент на сайте.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  aria-label="Закрыть"
                  onClick={closeAll}
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
                      Написать Евгению в Telegram
                    </span>
                  </span>
                </a>
                <button
                  type="button"
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 text-left transition-colors duration-200 hover:border-accent"
                  onClick={() => setPanel("chat")}
                >
                  <AssistantIcon className="size-5 text-accent" />
                  <span>
                    <span className="block text-sm font-semibold">
                      ИИ-ассистент
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Вопросы про инвестиции
                    </span>
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        className="btn-shimmer pointer-events-auto inline-flex min-h-14 min-w-14 cursor-pointer items-center justify-center rounded-full border border-accent bg-accent text-on-accent shadow-[var(--shadow-lg)] transition-opacity duration-200 hover:opacity-90"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          open
            ? "Закрыть выбор канала"
            : "Написать в Telegram или ассистенту"
        }
        onClick={() => {
          setOpen((value) => {
            if (value) setPanel("channels");
            return !value;
          });
        }}
      >
        {open ? (
          <CloseIcon className="size-6" />
        ) : (
          <AssistantIcon className="size-6" />
        )}
      </button>
    </div>
  );
}
