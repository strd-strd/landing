/**
 * Отправка инвест-лида в Telegram + persist в Supabase.
 * Куда: LEAD_TELEGRAM_CHAT_ID + ID_ADMIN (менеджеры). Не ID_OPS.
 * Ошибки → ID_OPS через app-log.
 */

import { logCritical, logError, logInfo, logWarn } from "@/lib/app-log";
import { recordBotEvent } from "@/lib/bot-events-db";
import {
  listUndeliveredLeads,
  saveLead,
  updateLeadDelivery,
} from "@/lib/leads-db";
import {
  getLeadDestinations,
  getOpsUserIds,
  getToken,
} from "@/lib/telegram-env";

export {
  getAdminUserIds,
  getLeadChannelId,
  getLeadDestinations,
  getOpsUserIds,
  getToken,
  isManagerTelegramId,
  isOpsTelegramId,
} from "@/lib/telegram-env";

export type InvestLeadSource = "callback" | "popup" | "bot" | "mini";

export type InvestLeadPayload = {
  name: string;
  phone: string;
  source: InvestLeadSource;
  context?: string;
  car?: string;
  year?: string;
  title?: string;
  telegramUserId?: string | null;
};

export type LeadSendResult = { ok: true } | { ok: false; error: string };

function sourceLabel(source: InvestLeadSource): string {
  switch (source) {
    case "popup":
      return "попап калькулятора";
    case "bot":
      return "Telegram-бот";
    case "mini":
      return "Mini App";
    default:
      return "форма на лендинге";
  }
}

function formatLeadMessage(payload: InvestLeadPayload): string {
  const lines = [
    `🆕 Заявка инвестора (${sourceLabel(payload.source)})`,
    "",
    payload.title ? `Тема: ${payload.title}` : null,
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.car ? `Авто: ${payload.car}` : null,
    payload.year ? `Год: ${payload.year}` : null,
    payload.context ? `Контекст: ${payload.context}` : null,
    payload.telegramUserId ? `Telegram ID: ${payload.telegramUserId}` : null,
    "",
    "Источник: invest.demidovpark.ru",
  ];
  return lines.filter((line): line is string => line !== null).join("\n");
}

async function telegramApi(
  method: string,
  body: URLSearchParams,
  attempt = 1,
): Promise<{ ok: boolean; description?: string }> {
  const token = getToken();
  if (!token) {
    return { ok: false, description: "нет TOKEN_TELEGRAM" };
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { ok?: boolean; description?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, description: data.description || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (error) {
    const description =
      error instanceof Error ? error.message : "fetch failed";
    if (
      attempt < 3 &&
      /fetch failed|ECONNRESET|ETIMEDOUT|network|timed out/i.test(description)
    ) {
      await new Promise((r) => setTimeout(r, 400 * attempt));
      return telegramApi(method, body, attempt + 1);
    }
    return { ok: false, description };
  }
}

async function sendLeadTextToDestinations(
  text: string,
): Promise<{ delivered: number; lastError: string | null }> {
  const destinations = getLeadDestinations();
  let delivered = 0;
  let lastError: string | null = null;

  for (const chatId of destinations) {
    const messageResult = await telegramApi(
      "sendMessage",
      new URLSearchParams({
        chat_id: chatId,
        text: text.slice(0, 4000),
        disable_web_page_preview: "true",
      }),
    );
    if (!messageResult.ok) {
      const description = messageResult.description ?? "sendMessage failed";
      lastError = description;
      if (/can't initiate conversation/i.test(description)) {
        logWarn("web", "lead: менеджер ещё не открыл бота (/start)", {
          description,
          chatIdSuffix: chatId.slice(-4),
        });
      } else {
        logError("web", "lead: sendMessage failed", {
          description,
          chatIdSuffix: chatId.slice(-4),
        });
      }
      continue;
    }
    delivered += 1;
  }
  return { delivered, lastError };
}

/** Повторно отправить тексты со статусом failed/pending (без вложений). */
export async function flushUndeliveredLeadTexts(): Promise<number> {
  const rows = await listUndeliveredLeads(15);
  if (rows.length === 0) return 0;

  const now = Date.now();
  let resent = 0;

  for (const row of rows) {
    if (!row.message_text?.trim()) continue;
    if (row.deliver_status === "pending") {
      const ageMs = now - new Date(row.created_at).getTime();
      if (ageMs < 90_000) continue;
    }

    const text = row.message_text.startsWith("🔁")
      ? row.message_text
      : `🔁 Повторная доставка заявки\n\n${row.message_text}`;

    const { delivered, lastError } = await sendLeadTextToDestinations(text);
    if (delivered > 0) {
      await updateLeadDelivery(row.id, { deliverStatus: "delivered" });
      resent += 1;
      logInfo("web", "lead: retry delivered", {
        id: row.id,
        source: row.source,
      });
      void notifyOpsLeadRecovered({
        leadId: row.id,
        source: row.source,
        retryCount: row.retry_count,
        preview: row.message_text.slice(0, 400),
      });
    } else {
      await updateLeadDelivery(row.id, {
        deliverStatus: "failed",
        lastError: lastError ?? "retry failed",
        incrementRetry: true,
      });
    }
  }
  return resent;
}

async function notifyOpsLeadRecovered(input: {
  leadId: string;
  source: string;
  retryCount: number;
  preview: string;
}): Promise<void> {
  const ops = getOpsUserIds();
  if (ops.length === 0) return;

  const text = [
    "✅ invest: заявка доставлена после сбоя",
    "",
    `Источник: ${input.source}`,
    `id: ${input.leadId}`,
    `попыток до успеха: ${input.retryCount + 1}`,
    "",
    "Кратко:",
    input.preview.replace(/^🔁[^\n]*\n\n?/, "").slice(0, 350),
  ].join("\n");

  for (const chatId of ops) {
    const result = await telegramApi(
      "sendMessage",
      new URLSearchParams({
        chat_id: chatId,
        text: text.slice(0, 3900),
        disable_web_page_preview: "true",
      }),
    );
    if (!result.ok) {
      logWarn("web", "lead: ops recovery notify failed", {
        description: result.description,
        leadId: input.leadId,
      });
    }
  }
}

export async function sendInvestLeadToManager(
  payload: InvestLeadPayload,
): Promise<LeadSendResult> {
  const token = getToken();
  const destinations = getLeadDestinations();
  const text = formatLeadMessage(payload);

  const leadId = await saveLead({
    source: payload.source,
    telegramId: payload.telegramUserId ?? undefined,
    name: payload.name,
    phone: payload.phone,
    title: payload.title,
    car: payload.car,
    year: payload.year,
    context: payload.context,
    messageText: text,
    payload: {
      hasTelegram: Boolean(payload.telegramUserId),
    },
    deliverStatus: "pending",
  });

  if (payload.telegramUserId) {
    void recordBotEvent({
      eventType: "lead",
      telegramId: payload.telegramUserId,
      meta: { leadId, source: payload.source },
      segment: "lead",
    });
  }

  if (!token || destinations.length === 0) {
    if (leadId) {
      await updateLeadDelivery(leadId, {
        deliverStatus: "failed",
        lastError: "нет TOKEN_TELEGRAM или чатов",
      });
    }
    logError("web", "lead: не настроен TOKEN_TELEGRAM или LEAD_TELEGRAM_CHAT_ID/ID_ADMIN", {
      hasToken: Boolean(token),
      destinations: destinations.length,
      source: payload.source,
      leadId,
    });
    return {
      ok: false,
      error: "Заявка временно не принимается. Напишите в Telegram или позвоните.",
    };
  }

  const { delivered, lastError } = await sendLeadTextToDestinations(text);

  if (delivered === 0) {
    if (leadId) {
      await updateLeadDelivery(leadId, {
        deliverStatus: "failed",
        lastError: lastError ?? "не доставлено",
      });
    }
    logCritical("web", "lead: не доставлено ни в один чат", {
      source: payload.source,
      leadId,
      phoneLen: payload.phone.length,
      destCount: destinations.length,
      hint:
        lastError?.includes("chat not found") || lastError?.includes("Chat not found")
          ? "Проверьте LEAD_TELEGRAM_CHAT_ID / ID_ADMIN: бот в чате, в личке — /start"
          : undefined,
    });
    void flushUndeliveredLeadTexts();
    return {
      ok: false,
      error: "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.",
    };
  }

  if (leadId) {
    await updateLeadDelivery(leadId, { deliverStatus: "delivered" });
  }

  if (delivered < destinations.length) {
    logWarn("web", "lead: delivered partially", {
      delivered,
      destCount: destinations.length,
      source: payload.source,
      leadId,
    });
  }

  logInfo("web", "lead: sent", {
    source: payload.source,
    destinations: delivered,
    leadId,
    phoneLen: payload.phone.length,
  });

  void flushUndeliveredLeadTexts();
  return { ok: true };
}
