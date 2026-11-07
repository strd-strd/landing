import { NextResponse } from "next/server";
import { isFullAdminSession } from "@/lib/admin-auth";
import { logError, logInfo, logWarn } from "@/lib/app-log";
import { resolveBroadcastAudience } from "@/lib/bot-audience";
import {
  normalizeAudienceListIds,
  type AudienceListId,
} from "@/lib/bot-segments";
import { telegramFetch } from "@/lib/telegram-fetch";

export const runtime = "nodejs";

const UNSUB_KEYBOARD = {
  inline_keyboard: [
    [{ text: "Отписаться от рассылки", callback_data: "bc:unsub" }],
  ],
};

export async function POST(request: Request) {
  if (!(await isFullAdminSession())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const token = process.env.TOKEN_TELEGRAM?.trim();
  if (!token) {
    logError("web", "admin broadcast: нет TOKEN_TELEGRAM");
    return NextResponse.json({ error: "Нет TOKEN_TELEGRAM" }, { status: 502 });
  }

  let text = "";
  let includeLists: AudienceListId[] = ["all"];
  let excludeLists: AudienceListId[] = ["opted_out"];
  try {
    const body = (await request.json()) as {
      text?: string;
      includeLists?: unknown;
      excludeLists?: unknown;
    };
    text = body.text?.trim() ?? "";
    const include = normalizeAudienceListIds(body.includeLists);
    const exclude = normalizeAudienceListIds(body.excludeLists);
    if (include.length > 0) includeLists = include;
    if (body.excludeLists !== undefined) excludeLists = exclude;
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  if (!text) {
    return NextResponse.json({ error: "Пустой текст" }, { status: 400 });
  }

  let recipients: string[];
  try {
    recipients = await resolveBroadcastAudience({
      includeLists,
      excludeLists,
    });
  } catch (error) {
    logError("web", "admin broadcast: audience resolve failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Не удалось собрать аудиторию" },
      { status: 502 },
    );
  }

  if (recipients.length === 0) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      failed: 0,
      total: 0,
      message: "В выборке никого нет",
    });
  }

  let sent = 0;
  let failed = 0;

  for (const telegramId of recipients) {
    try {
      const res = await telegramFetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramId,
            text: text.slice(0, 4096),
            link_preview_options: { is_disabled: true },
            reply_markup: UNSUB_KEYBOARD,
          }),
        },
      );
      const data = (await res.json()) as { ok?: boolean };
      if (data.ok) sent += 1;
      else failed += 1;
    } catch {
      failed += 1;
    }
  }

  const summary = {
    sent,
    failed,
    total: recipients.length,
    includeLists,
    excludeLists,
  };

  if (failed > 0 && sent === 0) {
    logError("web", "admin broadcast: никто не получил", summary);
  } else if (failed > 0) {
    logWarn("web", "admin broadcast: частичный сбой", summary);
  } else {
    logInfo("web", "admin broadcast ok", summary);
  }

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    total: recipients.length,
  });
}
