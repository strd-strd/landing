"use client";

import { useState } from "react";
import { AdminAgentForm } from "@/app/admin/admin-agent-form";
import { AdminBroadcastForm } from "@/app/admin/admin-broadcast-form";
import { AdminLogsPanel } from "@/app/admin/admin-logs-panel";
import { AudienceUsersList } from "@/app/admin/audience-users-list";
import type { BotUserRow } from "@/lib/bot-audience";
import {
  formatBotUserLabel,
  type AudienceListId,
  type AudienceListOption,
} from "@/lib/bot-segments";

type NavId = "overview" | "broadcast" | "subscribers" | "logs" | "agent";

const ADMIN_NAV: { id: NavId; label: string }[] = [
  { id: "overview", label: "Аудитория" },
  { id: "broadcast", label: "Рассылка" },
  { id: "subscribers", label: "Подписчики" },
  { id: "agent", label: "AI-ассистент" },
  { id: "logs", label: "Логи" },
];

type Props = {
  lists: AudienceListOption[];
  users: BotUserRow[];
  agentSettings: {
    systemPrompt: string;
    model: string;
    memoryLimit: number;
  };
};

export function AdminDashboard({ lists, users, agentSettings }: Props) {
  const [section, setSection] = useState<NavId>("overview");
  const allCount = lists.find((l) => l.id === "all")?.count ?? users.length;

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Invest Demidov
          </p>
          <p className="mt-1 text-sm font-semibold">Админ-панель</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 border-t border-border p-3" aria-label="Разделы">
          {ADMIN_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={
                section === item.id
                  ? "rounded-md bg-accent px-3 py-2 text-left text-sm font-medium text-on-accent"
                  : "rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          admin · полный доступ
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {ADMIN_NAV.find((n) => n.id === section)?.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              Telegram-бот, сегменты и ИИ на сайте
            </p>
          </div>
          <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium tabular-nums">
            {allCount} польз.
          </span>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {ADMIN_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={
                section === item.id
                  ? "shrink-0 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent"
                  : "shrink-0 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <main id="main" className="flex-1 px-4 py-6 sm:px-6">
          {section === "overview" ? <OverviewSection lists={lists} /> : null}
          {section === "broadcast" ? (
            <section className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Новая рассылка</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Выберите списки (include / exclude). Нужен poller и пользователи
                после /start.
              </p>
              <div className="mt-6">
                <AdminBroadcastForm initialLists={lists} />
              </div>
            </section>
          ) : null}
          {section === "subscribers" ? (
            <SubscribersSection users={users} />
          ) : null}
          {section === "agent" ? (
            <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">AI-ассистент</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Системный промпт и модель для виджета на сайте.
              </p>
              <div className="mt-6">
                <AdminAgentForm
                  initialPrompt={agentSettings.systemPrompt}
                  initialModel={agentSettings.model}
                  initialMemoryLimit={agentSettings.memoryLimit}
                />
              </div>
            </section>
          ) : null}
          {section === "logs" ? <AdminLogsPanel /> : null}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({ lists }: { lists: AudienceListOption[] }) {
  const [selectedId, setSelectedId] = useState<AudienceListId>(
    lists[0]?.id ?? "all",
  );
  const selected = lists.find((list) => list.id === selectedId) ?? lists[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => {
          const active = list.id === selected?.id;
          return (
            <button
              key={list.id}
              type="button"
              onClick={() => setSelectedId(list.id)}
              className="text-left"
            >
              <div
                className={
                  active
                    ? "h-full rounded-2xl border border-accent bg-card p-5 ring-1 ring-accent"
                    : "h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/50"
                }
              >
                <p className="text-sm text-muted-foreground">{list.label}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">
                  {list.count}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{list.hint}</p>
                <p className="mt-2 text-xs font-medium text-accent">
                  {active ? "Показаны аккаунты ↓" : "Нажмите — кто внутри"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">{selected.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected.count === 0
                ? "В этом списке пока никого нет. Пользователи появятся после /start в боте."
                : `Аккаунты с Telegram ID · ${selected.count} чел.`}
            </p>
          </div>
          <AudienceUsersList users={selected.users} emptyHint={selected.hint} />
        </div>
      ) : null}
    </div>
  );
}

function SubscribersSection({ users }: { users: BotUserRow[] }) {
  if (users.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Подписчики</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Пока пусто — запустите PM2 `investdemidov-tg-poll` и попросите
          пользователей нажать /start у бота.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Подписчики</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Последние {users.length} по активности
        </p>
      </div>
      <ul className="divide-y divide-border">
        {users.map((u) => (
          <li
            key={u.telegram_id}
            className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm"
          >
            <div>
              <span className="font-mono text-accent">{u.telegram_id}</span>
              <span className="text-muted-foreground">
                {" "}
                ·{" "}
                {formatBotUserLabel({
                  telegram_id: u.telegram_id,
                  username: u.username,
                  first_name: u.first_name,
                  last_name: u.last_name,
                })}
              </span>
            </div>
            {u.broadcast_opt_out_at ? (
              <span className="rounded-md border border-border px-2 py-0.5 text-xs">
                отписан
              </span>
            ) : (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                active
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
