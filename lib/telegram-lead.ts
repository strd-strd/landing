/**
 * Отправка инвест-лида менеджеру в Telegram.
 * Секреты только из env, не логируем токен и сырые ПДн.
 */

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

function getLeadChatId(): string | null {
  const lead = process.env.LEAD_TELEGRAM_CHAT_ID?.trim();
  if (lead) return lead;
  const admin = process.env.ID_ADMIN?.trim();
  return admin || null;
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

export async function sendInvestLeadToManager(
  payload: InvestLeadPayload,
): Promise<LeadSendResult> {
  const token = getToken();
  const chatId = getLeadChatId();

  if (!token || !chatId) {
    console.error("[web] lead: не настроен TOKEN_TELEGRAM или LEAD_TELEGRAM_CHAT_ID");
    return {
      ok: false,
      error: "Заявка временно не принимается. Напишите в Telegram или позвоните.",
    };
  }

  const text = formatLeadMessage(payload);
  const body = new URLSearchParams({
    chat_id: chatId,
    text,
    disable_web_page_preview: "true",
  });

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { ok?: boolean; description?: string };
    if (!res.ok || !data.ok) {
      console.error("[web] lead: sendMessage failed", {
        description: data.description || `HTTP ${res.status}`,
      });
      return {
        ok: false,
        error: "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.",
      };
    }
    return { ok: true };
  } catch (error) {
    console.error("[web] lead: telegram network error", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return {
      ok: false,
      error: "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.",
    };
  }
}
