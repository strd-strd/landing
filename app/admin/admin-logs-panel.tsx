"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppLogRow, LogLevel } from "@/lib/app-log-types";

type LogFilter = "all" | "errors";

const LEVEL_CLASS: Record<LogLevel, string> = {
  info: "border-border bg-muted text-muted-foreground",
  warn: "border-accent/40 bg-accent/10 text-accent",
  error: "border-destructive/40 bg-destructive/10 text-destructive",
  critical: "border-destructive bg-destructive/20 text-destructive",
};

export function AdminLogsPanel() {
  const [logs, setLogs] = useState<AppLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<LogFilter>("errors");

  const load = useCallback(async (nextFilter: LogFilter) => {
    setLoading(true);
    setError("");
    try {
      const q =
        nextFilter === "errors"
          ? "/api/admin/logs?limit=150&errorsOnly=1"
          : "/api/admin/logs?limit=150";
      const res = await fetch(q);
      const data = (await res.json()) as {
        ok?: boolean;
        logs?: AppLogRow[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Не удалось загрузить логи");
        setLogs([]);
        return;
      }
      setLogs(data.logs ?? []);
    } catch {
      setError("Нет связи с сервером");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(filter);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [filter, load]);

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">Логи сайта и бота</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Таблица InvestDemidov_logs. error/critical — алерты в ID_OPS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-border p-0.5">
            <button
              type="button"
              className={
                filter === "errors"
                  ? "rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-on-accent"
                  : "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              }
              onClick={() => setFilter("errors")}
            >
              Ошибки
            </button>
            <button
              type="button"
              className={
                filter === "all"
                  ? "rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-on-accent"
                  : "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              }
              onClick={() => setFilter("all")}
            >
              Все
            </button>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            onClick={() => void load(filter)}
          >
            Обновить
          </button>
        </div>
      </div>
      <div>
        {loading ? (
          <p className="px-6 py-4 text-sm text-muted-foreground">Загрузка…</p>
        ) : null}
        {error ? (
          <p className="px-6 py-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error && logs.length === 0 ? (
          <p className="px-6 py-4 text-sm text-muted-foreground">
            {filter === "errors"
              ? "Ошибок пока нет."
              : "Пока пусто. Проверьте Supabase и supabase/investdemidov.sql."}
          </p>
        ) : null}
        {logs.length > 0 ? (
          <ul className="divide-y divide-border">
            {logs.map((row) => (
              <li key={row.id} className="px-6 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${LEVEL_CLASS[row.level]}`}
                  >
                    {row.level}
                  </span>
                  <span className="font-mono text-xs text-accent">
                    {row.channel}
                  </span>
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={row.created_at}
                  >
                    {new Date(row.created_at).toLocaleString("ru-RU")}
                  </time>
                  {row.notified_ops ? (
                    <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      ops ✓
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-foreground">{row.message}</p>
                {row.context && Object.keys(row.context).length > 0 ? (
                  <pre className="mt-2 max-h-28 overflow-auto rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                    {JSON.stringify(row.context, null, 2)}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
