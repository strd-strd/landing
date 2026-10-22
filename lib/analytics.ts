/** Счётчик Яндекс.Метрики (invest.demidovpark.ru). Публичный ID. */
export const YANDEX_METRIKA_ID = 113736873;

/**
 * Идентификаторы целей (JavaScript-событие в Метрике + event в dataLayer).
 * В кабинете Метрики создай цели типа «JavaScript-событие» с этими именами.
 * Основная для Директа: lead_thanks.
 */
export const ANALYTICS_GOALS = {
  /** Посещение /spasibo после заявки — главная конверсия. */
  leadThanks: "lead_thanks",
  /** Клик по tel: */
  phoneClick: "phone_click",
  /** Клик в Telegram (канал / менеджер / бот). */
  messengerTelegram: "messenger_telegram",
  /** Клик в MAX. */
  messengerMax: "messenger_max",
} as const;

export type AnalyticsGoal =
  (typeof ANALYTICS_GOALS)[keyof typeof ANALYTICS_GOALS];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    ym?: (
      id: number,
      method: string,
      ...args: unknown[]
    ) => void;
  }
}

type GoalParams = Record<string, string | number | undefined>;

const pendingMetrikaGoals: Array<{ goal: string; params?: GoalParams }> = [];
let metrikaFlushTimer: ReturnType<typeof setInterval> | null = null;

function flushMetrikaGoals(): void {
  if (typeof window.ym !== "function") return;
  while (pendingMetrikaGoals.length > 0) {
    const next = pendingMetrikaGoals.shift();
    if (!next) break;
    window.ym(YANDEX_METRIKA_ID, "reachGoal", next.goal, next.params);
  }
  if (metrikaFlushTimer) {
    clearInterval(metrikaFlushTimer);
    metrikaFlushTimer = null;
  }
}

function queueMetrikaGoal(goal: string, params?: GoalParams): void {
  if (typeof window.ym === "function") {
    window.ym(YANDEX_METRIKA_ID, "reachGoal", goal, params);
    return;
  }
  pendingMetrikaGoals.push({ goal, params });
  if (metrikaFlushTimer) return;
  let attempts = 0;
  metrikaFlushTimer = setInterval(() => {
    attempts += 1;
    flushMetrikaGoals();
    if (typeof window.ym === "function" || attempts >= 40) {
      if (metrikaFlushTimer) {
        clearInterval(metrikaFlushTimer);
        metrikaFlushTimer = null;
      }
      pendingMetrikaGoals.length = 0;
    }
  }, 500);
}

/** dataLayer сразу; Метрика — после cookie-согласия и/или загрузки счётчика (до ~20 с). */
export function trackGoal(
  goal: AnalyticsGoal | string,
  params?: GoalParams,
): void {
  if (typeof window === "undefined") return;

  const payload: Record<string, unknown> = { event: goal };
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        payload[key] = value;
      }
    }
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  queueMetrikaGoal(goal, params);
}

export function classifyOutboundHref(href: string): AnalyticsGoal | null {
  const raw = href.trim();
  if (!raw) return null;

  if (raw.toLowerCase().startsWith("tel:")) {
    return ANALYTICS_GOALS.phoneClick;
  }

  let url: URL;
  try {
    url = new URL(raw, "https://invest.demidovpark.ru");
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "t.me" || host === "telegram.me" || host === "telegram.org") {
    return ANALYTICS_GOALS.messengerTelegram;
  }

  if (host === "max.ru" || host.endsWith(".max.ru")) {
    return ANALYTICS_GOALS.messengerMax;
  }

  return null;
}
