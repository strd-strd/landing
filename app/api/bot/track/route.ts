import { NextResponse } from "next/server";
import { logError } from "@/lib/app-log";
import {
  isBotEventType,
  recordBotEvent,
  segmentForEvent,
} from "@/lib/bot-events-db";
import { isBotSegment } from "@/lib/bot-segments";

export const runtime = "nodejs";

/**
 * Тонкий трек для будущего бота / Mini App.
 * Тело: { event_type, telegram_id?, meta?, username?, firstName?, lastName?, segment? }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      event_type?: string;
      eventType?: string;
      telegram_id?: string;
      telegramUserId?: string;
      meta?: Record<string, unknown>;
      username?: string;
      firstName?: string;
      lastName?: string;
      segment?: string;
    };

    const eventRaw = (body.event_type ?? body.eventType ?? "").trim();
    if (!eventRaw || !isBotEventType(eventRaw)) {
      return NextResponse.json(
        { error: "Укажите корректный event_type." },
        { status: 400 },
      );
    }

    const telegramId = (
      body.telegram_id ??
      body.telegramUserId ??
      ""
    ).trim();
    if (telegramId && !/^\d+$/.test(telegramId)) {
      return NextResponse.json(
        { error: "Некорректный telegram_id." },
        { status: 400 },
      );
    }

    const segmentRaw = body.segment?.trim();
    const segment =
      segmentRaw && isBotSegment(segmentRaw)
        ? segmentRaw
        : segmentForEvent(eventRaw);

    const id = await recordBotEvent({
      eventType: eventRaw,
      telegramId: telegramId || null,
      meta: body.meta && typeof body.meta === "object" ? body.meta : {},
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      segment,
    });

    if (!id) {
      return NextResponse.json(
        { error: "Не удалось записать событие." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    logError("web", "bot track failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Не удалось записать событие." },
      { status: 500 },
    );
  }
}
