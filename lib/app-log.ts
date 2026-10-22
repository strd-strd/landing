/**
 * Централизованные логи: консоль + Supabase + алерт ID_OPS при error/critical.
 * Не логируем секреты и полные ПДн (телефон/имя целиком — только в leads).
 */

import type { AppLogRow, LogLevel } from "@/lib/app-log-types";
import { getOpsUserIds, getToken } from "@/lib/telegram-env";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type { AppLogRow, LogLevel } from "@/lib/app-log-types";

const SECRET_KEY =
  /token|password|secret|api[_-]?key|authorization|service_role|prompt|cookie/i;

const alertThrottle = new Map<string, number>();
const ALERT_COOLDOWN_MS = 60_000;

function sanitizeContext(
  context?: Record<string, unknown>,
): Record<string, unknown> {
  if (!context) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (SECRET_KEY.test(key)) {
      out[key] = "[redacted]";
      continue;
    }
    if (typeof value === "string" && value.length > 500) {
      out[key] = `${value.slice(0, 500)}…`;
      continue;
    }
    out[key] = value;
  }
  return out;
}

function writeConsole(
  level: LogLevel,
  channel: string,
  message: string,
  context: Record<string, unknown>,
): void {
  const prefix = `[${channel}] ${message}`;
  const payload = Object.keys(context).length > 0 ? context : undefined;
  if (level === "info") {
    if (payload) console.info(prefix, payload);
    else console.info(prefix);
    return;
  }
  if (level === "warn") {
    if (payload) console.warn(prefix, payload);
    else console.warn(prefix);
    return;
  }
  if (payload) console.error(prefix, payload);
  else console.error(prefix);
}

async function persistLog(input: {
  level: LogLevel;
  channel: string;
  message: string;
  context: Record<string, unknown>;
  notifiedOps: boolean;
}): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("InvestDemidov_logs").insert({
    level: input.level,
    channel: input.channel,
    message: input.message.slice(0, 2000),
    context: input.context,
    notified_ops: input.notifiedOps,
  });
  if (error) {
    console.error("[store] InvestDemidov_logs insert failed", {
      message: error.message,
    });
  }
}

async function notifyOpsTelegram(
  level: LogLevel,
  channel: string,
  message: string,
  context: Record<string, unknown>,
): Promise<boolean> {
  const token = getToken();
  const ops = getOpsUserIds();
  if (!token || ops.length === 0) return false;

  const throttleKey = `${level}:${channel}:${message}`;
  const now = Date.now();
  const last = alertThrottle.get(throttleKey) ?? 0;
  if (now - last < ALERT_COOLDOWN_MS) return false;
  alertThrottle.set(throttleKey, now);

  const ctxLines = Object.entries(context)
    .slice(0, 8)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");
  const text = [
    `⚠ invest · ${level.toUpperCase()} · ${channel}`,
    message.slice(0, 800),
    ctxLines ? `\n${ctxLines.slice(0, 1500)}` : "",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 3900);

  let ok = false;
  for (const chatId of ops) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (data.ok) ok = true;
    } catch (error) {
      console.error("[ops] alert send failed", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return ok;
}

/**
 * Записать лог. error/critical → алерт ID_OPS (с троттлингом).
 * Не await'ить в hot path без нужды — можно void appLog(...).
 */
export async function appLog(
  level: LogLevel,
  channel: string,
  message: string,
  context?: Record<string, unknown>,
): Promise<void> {
  const safe = sanitizeContext(context);
  writeConsole(level, channel, message, safe);

  const shouldAlert = level === "error" || level === "critical";
  let notified = false;
  if (shouldAlert) {
    try {
      notified = await notifyOpsTelegram(level, channel, message, safe);
    } catch (error) {
      console.error("[ops] notify exception", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  try {
    await persistLog({
      level,
      channel,
      message,
      context: safe,
      notifiedOps: notified,
    });
  } catch (error) {
    console.error("[store] persistLog exception", {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export function logInfo(
  channel: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  void appLog("info", channel, message, context);
}

export function logWarn(
  channel: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  void appLog("warn", channel, message, context);
}

export function logError(
  channel: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  void appLog("error", channel, message, context);
}

export function logCritical(
  channel: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  void appLog("critical", channel, message, context);
}

export async function listAppLogs(
  limit = 100,
  options?: {
    channel?: string;
    /** Только error + critical. */
    errorsOnly?: boolean;
  },
): Promise<AppLogRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  let query = db
    .from("InvestDemidov_logs")
    .select("id, created_at, level, channel, message, context, notified_ops")
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 300));
  if (options?.channel) {
    query = query.eq("channel", options.channel);
  }
  if (options?.errorsOnly) {
    query = query.in("level", ["error", "critical"]);
  }
  const { data, error } = await query;

  if (error) {
    console.error("[store] listAppLogs failed", { message: error.message });
    return [];
  }
  return (data ?? []) as AppLogRow[];
}
