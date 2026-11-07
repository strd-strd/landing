"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AudienceUsersList } from "@/app/admin/audience-users-list";
import type { AudienceListOption } from "@/lib/bot-segments";

type Props = {
  initialLists: AudienceListOption[];
};

export function AdminBroadcastForm({ initialLists }: Props) {
  const [lists] = useState(initialLists);
  const [includeLists, setIncludeLists] = useState<string[]>(["all"]);
  const [excludeLists, setExcludeLists] = useState<string[]>(["opted_out"]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/audience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ includeLists, excludeLists }),
    })
      .then((res) => res.json())
      .then((data: { ok?: boolean; count?: number }) => {
        if (!cancelled && data.ok && typeof data.count === "number") {
          setAudienceCount(data.count);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [includeLists, excludeLists]);

  function toggle(list: string[], id: string, on: boolean): string[] {
    if (on) return list.includes(id) ? list : [...list, id];
    return list.filter((item) => item !== id);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() || includeLists.length === 0) return;
    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          includeLists,
          excludeLists,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        sent?: number;
        failed?: number;
        total?: number;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus(data.error || "Ошибка рассылки");
        return;
      }
      if (data.total === 0) {
        setStatus(data.message || "В выборке никого нет");
        return;
      }
      setStatus(
        `Аудитория: ${data.total ?? 0}. Доставлено: ${data.sent ?? 0}, ошибок: ${data.failed ?? 0}`,
      );
      setText("");
    } catch {
      setStatus("Нет связи с сервером");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <ListPicker
          title="Включить"
          hint="Объединение (OR). Один человек может быть в нескольких списках."
          lists={lists}
          selected={includeLists}
          blocked={excludeLists}
          onChange={(id, on) =>
            setIncludeLists(toggle(includeLists, id, on))
          }
        />
        <ListPicker
          title="Исключить"
          hint="Вычитаются из включённых. По умолчанию — отписавшиеся."
          lists={lists}
          selected={excludeLists}
          blocked={includeLists}
          onChange={(id, on) =>
            setExcludeLists(toggle(excludeLists, id, on))
          }
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Получателей в выборке:{" "}
        <span className="font-semibold tabular-nums text-foreground">
          {audienceCount == null ? "…" : audienceCount}
        </span>
      </p>

      <div className="space-y-2">
        <label htmlFor="broadcast-text" className="block text-sm font-medium">
          Текст сообщения
        </label>
        <textarea
          id="broadcast-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Текст рассылки подписчикам"
          className="min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>

      <button
        type="submit"
        disabled={sending || !text.trim() || includeLists.length === 0}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Отправляем…" : "Отправить по выборке"}
      </button>
      {status ? (
        <p className="text-sm text-muted-foreground" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}

function ListPicker({
  title,
  hint,
  lists,
  selected,
  blocked,
  onChange,
}: {
  title: string;
  hint: string;
  lists: AudienceListOption[];
  selected: string[];
  blocked: string[];
  onChange: (id: string, on: boolean) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <fieldset className="rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <p className="mb-3 text-xs text-muted-foreground">{hint}</p>
      <ul className="space-y-3">
        {lists.map((list) => {
          const checked = selected.includes(list.id);
          const isBlocked = blocked.includes(list.id);
          const isOpen = openId === list.id;
          return (
            <li key={`${title}-${list.id}`} className="space-y-1.5">
              <div className="flex items-start gap-2.5">
                <label
                  className={
                    isBlocked
                      ? "flex min-w-0 flex-1 cursor-not-allowed items-start gap-2.5 text-sm opacity-40"
                      : "flex min-w-0 flex-1 cursor-pointer items-start gap-2.5 text-sm"
                  }
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-[var(--accent)]"
                    checked={checked}
                    disabled={isBlocked}
                    onChange={(e) => onChange(list.id, e.target.checked)}
                  />
                  <span>
                    <span className="font-medium">{list.label}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {list.count}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {list.hint}
                    </span>
                  </span>
                </label>
                <button
                  type="button"
                  className="shrink-0 cursor-pointer pt-0.5 text-xs font-medium text-accent"
                  onClick={() => setOpenId(isOpen ? null : list.id)}
                >
                  {isOpen ? "Скрыть" : "Кто"}
                </button>
              </div>
              {isOpen ? (
                <div className="ml-6 rounded-md border border-border bg-muted/40 px-3 py-2">
                  <AudienceUsersList
                    users={list.users}
                    emptyHint="В списке никого нет"
                    compact
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
