/**
 * Антиспам для публичных форм: honeypot, JS-токен, минимальное время заполнения,
 * простой rate-limit по IP (in-memory, для одного процесса PM2).
 * Паритет с demidovpark/lib/form-antispam.ts.
 */

export const HONEYPOT_FIELD = "website";
export const STARTED_FIELD = "formStartedAt";
export const TOKEN_FIELD = "formToken";
/** Выставляется только клиентским JS после монтирования формы. */
export const FORM_TOKEN_VALUE = "dp-ok";

/** Минимальное время от открытия формы до отправки (мс). */
export const MIN_SUBMIT_MS = 2_500;
/** Максимальный «возраст» формы — защита от переигрывания старого токена. */
export const MAX_SUBMIT_MS = 6 * 60 * 60 * 1000;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_HITS = 8;

const rateHits = new Map<string, number[]>();

export type AntispamFailReason =
  | "honeypot"
  | "no-js"
  | "no-timer"
  | "too-fast"
  | "too-old"
  | "rate-limit";

export type AntispamResult =
  | { ok: true }
  | { ok: false; reason: AntispamFailReason };

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function checkFormAntispam(form: FormData): AntispamResult {
  if (asString(form.get(HONEYPOT_FIELD))) {
    return { ok: false, reason: "honeypot" };
  }

  if (asString(form.get(TOKEN_FIELD)) !== FORM_TOKEN_VALUE) {
    return { ok: false, reason: "no-js" };
  }

  const started = Number(asString(form.get(STARTED_FIELD)));
  if (!Number.isFinite(started) || started <= 0) {
    return { ok: false, reason: "no-timer" };
  }

  const elapsed = Date.now() - started;
  if (elapsed < MIN_SUBMIT_MS) {
    return { ok: false, reason: "too-fast" };
  }
  if (elapsed > MAX_SUBMIT_MS) {
    return { ok: false, reason: "too-old" };
  }

  return { ok: true };
}

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/** true = можно принимать заявку; false = слишком часто. */
export function allowLeadByIp(ip: string): boolean {
  const now = Date.now();
  const prev = rateHits.get(ip) ?? [];
  const recent = prev.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_HITS) {
    rateHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  return true;
}

/** Клиентская проверка перед отправкой. */
export function clientAntispamFromForm(form: HTMLFormElement): AntispamResult {
  const data = new FormData(form);
  return checkFormAntispam(data);
}
