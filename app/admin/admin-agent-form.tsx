"use client";

import { useId, useState, type FormEvent } from "react";
import {
  MAX_MEMORY_LIMIT,
  MIN_MEMORY_LIMIT,
} from "@/lib/agent-limits";
import {
  MODEL_LABELS,
  OPENAI_MODELS,
  YANDEX_MODELS,
  isKnownModel,
} from "@/lib/models";

type Props = {
  initialPrompt: string;
  initialModel: string;
  initialMemoryLimit: number;
};

export function AdminAgentForm({
  initialPrompt,
  initialModel,
  initialMemoryLimit,
}: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [model, setModel] = useState<string>(
    isKnownModel(initialModel) ? initialModel : YANDEX_MODELS[0],
  );
  const [memoryLimit, setMemoryLimit] = useState(String(initialMemoryLimit));
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const promptHintId = useId();
  const memoryHintId = useId();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);
    setError(null);

    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Промпт не может быть пустым");
      return;
    }
    const parsedLimit = Number(memoryLimit);
    if (
      !Number.isFinite(parsedLimit) ||
      parsedLimit < MIN_MEMORY_LIMIT ||
      parsedLimit > MAX_MEMORY_LIMIT
    ) {
      setError(
        `Память: целое число от ${MIN_MEMORY_LIMIT} до ${MAX_MEMORY_LIMIT}`,
      );
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/admin/agent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: trimmed,
          model,
          memoryLimit: parsedLimit,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Не удалось сохранить");
        return;
      }
      setStatus("Сохранено. Новый промпт действует со следующего сообщения.");
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex w-full flex-col gap-5" noValidate onSubmit={onSubmit}>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" className="text-sm text-accent">
          {status}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="agent-model" className="text-sm font-medium">
          Модель
        </label>
        <p className="text-sm text-muted-foreground">
          На RU основная — Yandex. Если модель недоступна, автоматически
          включается запасная: Yandex ↔ GPT mini (gpt-4.1-mini через NL-прокси).
          Нужны ключи YANDEX_API_KEY + YANDEX_ID и API_GPT на сервере.
        </p>
        <select
          id="agent-model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        >
          <optgroup label="Yandex AI Studio">
            {YANDEX_MODELS.map((id) => (
              <option key={id} value={id}>
                {MODEL_LABELS[id]}
              </option>
            ))}
          </optgroup>
          <optgroup label="ChatGPT (OpenAI)">
            {OPENAI_MODELS.map((id) => (
              <option key={id} value={id}>
                {MODEL_LABELS[id]}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="agent-memory" className="text-sm font-medium">
          Память диалога (сообщений)
        </label>
        <p id={memoryHintId} className="text-sm text-muted-foreground">
          Сколько последних реплик держать в контексте ({MIN_MEMORY_LIMIT}–
          {MAX_MEMORY_LIMIT}).
        </p>
        <input
          id="agent-memory"
          type="number"
          min={MIN_MEMORY_LIMIT}
          max={MAX_MEMORY_LIMIT}
          value={memoryLimit}
          aria-describedby={memoryHintId}
          onChange={(e) => setMemoryLimit(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="system-prompt" className="text-sm font-medium">
          Системный промпт
        </label>
        <p id={promptHintId} className="text-sm text-muted-foreground">
          Редактируется здесь. Контакты и базовый контекст Invest подмешиваются
          на сервере.
        </p>
        <textarea
          id="system-prompt"
          value={prompt}
          aria-describedby={promptHintId}
          rows={14}
          className="min-h-64 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm text-foreground"
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent disabled:opacity-50"
      >
        {pending ? "Сохраняю…" : "Сохранить"}
      </button>
    </form>
  );
}
