/**
 * Логи: консоль + алерт главному админу (ID_OPS, иначе ID_ADMIN) при error/critical.
 * Не логируем секреты и сырые ПДн (телефон/имя целиком).
 */

export type LogLevel = "info" | "warn" | "error" | "critical";

const SECRET_KEY =
  /token|password|secret|api[_-]?key|authorization|service_role|prompt|cookie/i;

const alertThrottle = new Map<string, number>();
const ALERT_COOLDOWN_MS = 60_000;

function parseTelegramIds(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^-?\d+$/.test(id));
}

function getToken(): string | null {
  return process.env.TOKEN_TELEGRAM?.trim() || null;
}

/** Ops: ID_OPS, иначе первый из ID_ADMIN. */
function getOpsUserIds(): string[] {
  const ops = parseTelegramIds(process.env.ID_OPS);
  if (ops.length > 0) return ops;
  return parseTelegramIds(process.env.ID_ADMIN).slice(0, 1);
}

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
 * Записать лог. error/critical → алерт в Telegram (с троттлингом 60с).
 */
export async function appLog(
  level: LogLevel,
  channel: string,
  message: string,
  context?: Record<string, unknown>,
): Promise<void> {
  const safe = sanitizeContext(context);
  writeConsole(level, channel, message, safe);

  if (level !== "error" && level !== "critical") return;

  try {
    await notifyOpsTelegram(level, channel, message, safe);
  } catch (error) {
    console.error("[ops] notify exception", {
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
