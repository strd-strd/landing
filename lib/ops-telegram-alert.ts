/**
 * Отправка ops-алертов в Telegram через NL-прокси.
 * Отдельный модуль: undici не тащить статически в app-log → клиентский граф.
 */

import { getOpsUserIds, getToken } from "@/lib/telegram-env";
import { telegramFetch } from "@/lib/telegram-fetch";

/** Отправить текст главному админу (ID_OPS) через telegramFetch + прокси. */
export async function sendOpsAlertText(text: string): Promise<boolean> {
  const token = getToken();
  const ops = getOpsUserIds();
  if (!token || ops.length === 0 || !text.trim()) return false;

  const body = text.slice(0, 3900);
  let ok = false;

  for (const chatId of ops) {
    try {
      const res = await telegramFetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: body,
            disable_web_page_preview: true,
          }),
        },
      );
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
