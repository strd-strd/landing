/**
 * Отправка инвест-лида в Telegram.
 * Куда: LEAD_TELEGRAM_CHAT_ID + ID_ADMIN (+ ID_OPS, если лидов нет).
 * Секреты только из env, не логируем токен и сырые ПДн.
 */

import { logError, logWarn } from "@/lib/app-log";

export type InvestLeadPayload = {
  name: string;
  phone: string;
  source: "callback" | "popup";
  context?: string;
  car?: string;
  year?: string;
  title?: string;
};

export type LeadSendResult = { ok: true } | { ok: false; error: string };

function getToken(): string | null {
  const token = process.env.TOKEN_TELEGRAM?.trim();
  return token || null;
}

function parseTelegramIds(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^-?\d+$/.test(id));
}

/**
 * Все чаты для заявки. Бот должен быть в группе/канале
 * или пользователь должен нажать /start у бота (личка).
 */
function getLeadDestinations(): string[] {
  const ids = new Set<string>();
  const channel = process.env.LEAD_TELEGRAM_CHAT_ID?.trim();
  if (channel && /^-?\d+$/.test(channel)) ids.add(channel);
  for (const id of parseTelegramIds(process.env.ID_ADMIN)) ids.add(id);
  if (ids.size === 0) {
    for (const id of parseTelegramIds(process.env.ID_OPS)) ids.add(id);
  }
  return [...ids];
}

function formatLeadMessage(payload: InvestLeadPayload): string {
  const sourceLabel =
    payload.source === "popup" ? "попап калькулятора" : "форма на лендинге";
  const lines = [
    `🆕 Заявка инвестора (${sourceLabel})`,
    "",
    payload.title ? `Тема: ${payload.title}` : null,
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.car ? `Авто: ${payload.car}` : null,
    payload.year ? `Год: ${payload.year}` : null,
    payload.context ? `Контекст: ${payload.context}` : null,
    "",
    "Источник: invest.demidovpark.ru",
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

async function sendToChat(
  token: string,
  chatId: string,
  text: string,
): Promise<{ ok: true } | { ok: false; description: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      body: new URLSearchParams({
        chat_id: chatId,
        text,
        disable_web_page_preview: "true",
      }),
    });
    const data = (await res.json()) as { ok?: boolean; description?: string };
    if (!res.ok || !data.ok) {
      return {
        ok: false,
        description: data.description || `HTTP ${res.status}`,
      };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      description: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function sendInvestLeadToManager(
  payload: InvestLeadPayload,
): Promise<LeadSendResult> {
  const token = getToken();
  const destinations = getLeadDestinations();

  if (!token || destinations.length === 0) {
    logError("web", "lead: не настроен TOKEN_TELEGRAM или chat id (LEAD/ID_ADMIN/ID_OPS)", {
      hasToken: Boolean(token),
      destCount: destinations.length,
      source: payload.source,
    });
    return {
      ok: false,
      error: "Заявка временно не принимается. Напишите в Telegram или позвоните.",
    };
  }

  const text = formatLeadMessage(payload);
  let delivered = 0;
  const failures: string[] = [];

  for (const chatId of destinations) {
    const result = await sendToChat(token, chatId, text);
    if (result.ok) {
      delivered += 1;
    } else {
      failures.push(result.description);
      logWarn("web", "lead: sendMessage failed for one chat", {
        description: result.description,
        source: payload.source,
        chatIdSuffix: chatId.slice(-4),
      });
    }
  }

  if (delivered > 0) {
    if (failures.length > 0) {
      logWarn("web", "lead: delivered partially", {
        delivered,
        failed: failures.length,
        source: payload.source,
      });
    }
    return { ok: true };
  }

  logError("web", "lead: sendMessage failed", {
    description: failures[0] ?? "unknown",
    source: payload.source,
    phoneLen: payload.phone.length,
    destCount: destinations.length,
    hint:
      failures[0]?.includes("chat not found") || failures[0]?.includes("Chat not found")
        ? "Проверьте LEAD_TELEGRAM_CHAT_ID / ID_ADMIN: бот должен быть в чате, в личке — /start"
        : undefined,
  });

  return {
    ok: false,
    error: "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.",
  };
}
