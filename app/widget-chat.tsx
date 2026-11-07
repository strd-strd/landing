"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/app/icons";
import type { ChatMessage } from "@/lib/models";

type Props = {
  onBack: () => void;
  onClose: () => void;
};

export function WidgetChat({ onBack, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/chat");
        if (!response.ok) return;
        const data = (await response.json()) as { messages?: ChatMessage[] };
        if (!cancelled && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch {
        // история опциональна
      } finally {
        if (!cancelled) {
          setLoaded(true);
          inputRef.current?.focus();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, pending, error]);

  async function send() {
    const next = text.trim();
    if (!next || pending) return;

    setText("");
    setError(null);
    setPending(true);
    setMessages((current) => [...current, { role: "user", content: next }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: next }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || data.error) {
        setError(data.error || "Не удалось получить ответ");
        return;
      }

      if (data.reply) {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: data.reply! },
        ]);
      }
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  const empty = loaded && messages.length === 0 && !pending && !error;

  return (
    <div className="flex h-[min(28rem,70dvh)] flex-col">
      <div className="mb-2 flex shrink-0 items-start gap-1 border-b border-border pb-3">
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Назад к каналам"
          onClick={onBack}
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ←
          </span>
        </button>
        <div className="min-w-0 flex-1 pt-1.5">
          <p className="text-sm font-semibold leading-snug text-foreground">
            ИИ-ассистент
          </p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            Инвестиции · Демидов Парк
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Закрыть"
          onClick={onClose}
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div
        className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {!loaded ? (
          <p className="px-1 py-6 text-center text-sm text-muted-foreground">
            Загрузка…
          </p>
        ) : null}

        {empty ? (
          <p className="px-1 py-6 text-center text-sm leading-6 text-muted-foreground">
            Спросите про пул инвесторов, сдачу авто или условия входа. Ответ ИИ
            не заменяет договор и менеджера.
          </p>
        ) : null}

        {loaded
          ? messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    isUser
                      ? "ml-auto w-fit max-w-[90%] rounded-xl bg-accent px-3 py-2 text-sm text-on-accent"
                      : "mr-auto w-fit max-w-[90%] rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
                  }
                >
                  <p className="whitespace-pre-wrap leading-6">{message.content}</p>
                </div>
              );
            })
          : null}

        {pending ? (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Печатает…
          </p>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/40 bg-card px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form
        className="mt-2 shrink-0 border-t border-border pt-3"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <label htmlFor="widget-chat-message" className="sr-only">
          Сообщение
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="widget-chat-message"
            ref={inputRef}
            value={text}
            rows={2}
            placeholder="Напишите вопрос…"
            disabled={pending}
            aria-busy={pending}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            className="min-h-11 w-full flex-1 resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm leading-5 text-foreground placeholder:text-muted-foreground disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={pending || !text.trim()}
            className="inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent px-3 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}
