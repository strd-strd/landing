/**
 * Пользователи бота + сегменты + журнал движений (InvestDemidov_bot_*).
 */

import { logError } from "@/lib/app-log";
import {
  isBotSegment,
  type BotSegment,
} from "@/lib/bot-segments";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/** Типы событий «ячеек» движений (бот / mini / сайт). */
export const BOT_EVENT_TYPES = [
  "bot_start",
  "miniapp_open",
  "question",
  "lead",
  "callback_open",
  "calc_pool",
  "calc_car",
  "segment",
  "broadcast_opt_out",
  "other",
] as const;

export type BotEventType = (typeof BOT_EVENT_TYPES)[number];

export function isBotEventType(value: string): value is BotEventType {
  return (BOT_EVENT_TYPES as readonly string[]).includes(value);
}

export async function upsertBotUser(input: {
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  consented?: boolean;
  segment?: BotSegment;
}): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) {
    logError("bot", "upsertBotUser: нет Supabase env");
    return;
  }

  const now = new Date().toISOString();
  try {
    const { error } = await db.from("InvestDemidov_bot_users").upsert(
      {
        telegram_id: input.telegramId,
        username: input.username ?? null,
        first_name: input.firstName ?? null,
        last_name: input.lastName ?? null,
        last_seen_at: now,
        status: "active",
        ...(input.consented ? { consented_at: now } : {}),
      },
      { onConflict: "telegram_id" },
    );

    if (error) {
      logError("bot", "upsertBotUser failed", { message: error.message });
      return;
    }

    if (input.segment) {
      await addUserSegment(input.telegramId, input.segment);
    }
  } catch (error) {
    logError("bot", "upsertBotUser exception", {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function addUserSegment(
  telegramId: string,
  segment: BotSegment,
): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;

  const now = new Date().toISOString();

  await db.from("InvestDemidov_bot_users").upsert(
    {
      telegram_id: telegramId,
      last_seen_at: now,
      status: "active",
    },
    { onConflict: "telegram_id" },
  );

  const { data: existing, error: selectError } = await db
    .from("InvestDemidov_bot_user_segments")
    .select("telegram_id")
    .eq("telegram_id", telegramId)
    .eq("segment", segment)
    .maybeSingle();

  if (selectError) {
    logError("bot", "addUserSegment select failed", {
      message: selectError.message,
      segment,
    });
    return;
  }

  if (existing) {
    const { error } = await db
      .from("InvestDemidov_bot_user_segments")
      .update({ last_at: now })
      .eq("telegram_id", telegramId)
      .eq("segment", segment);
    if (error) {
      logError("bot", "addUserSegment update failed", {
        message: error.message,
        segment,
      });
    }
    return;
  }

  const { error } = await db.from("InvestDemidov_bot_user_segments").insert({
    telegram_id: telegramId,
    segment,
    first_at: now,
    last_at: now,
  });
  if (error) {
    logError("bot", "addUserSegment insert failed", {
      message: error.message,
      segment,
    });
  }
}

/**
 * Записать движение: /start, открытие mini, вопрос, заявка и т.п.
 * Опционально обновляет профиль и сегмент.
 */
export async function recordBotEvent(input: {
  eventType: BotEventType;
  telegramId?: string | null;
  meta?: Record<string, unknown>;
  username?: string;
  firstName?: string;
  lastName?: string;
  segment?: BotSegment;
}): Promise<string | null> {
  const db = getSupabaseAdmin();
  if (!db) {
    logError("bot", "recordBotEvent: нет Supabase env");
    return null;
  }

  const telegramId = input.telegramId?.trim() || null;

  try {
    if (telegramId) {
      await upsertBotUser({
        telegramId,
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        segment: input.segment,
      });
    }

    const { data, error } = await db
      .from("InvestDemidov_bot_events")
      .insert({
        event_type: input.eventType,
        telegram_id: telegramId,
        meta: input.meta ?? {},
      })
      .select("id")
      .single();

    if (error || !data) {
      logError("bot", "recordBotEvent failed", {
        message: error?.message ?? "no data",
        eventType: input.eventType,
      });
      return null;
    }
    return String((data as { id: string }).id);
  } catch (error) {
    logError("bot", "recordBotEvent exception", {
      message: error instanceof Error ? error.message : String(error),
      eventType: input.eventType,
    });
    return null;
  }
}

/** Сегмент по типу события (если уместно). */
export function segmentForEvent(eventType: BotEventType): BotSegment | undefined {
  switch (eventType) {
    case "bot_start":
      return "start";
    case "miniapp_open":
      return "mini";
    case "question":
      return "ask_manager";
    case "lead":
      return "lead";
    case "calc_pool":
      return "calc_pool";
    case "calc_car":
      return "calc_car";
    default:
      return undefined;
  }
}

export { isBotSegment };
