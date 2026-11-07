/**
 * Аудитория бота для админки и рассылок (InvestDemidov_bot_*).
 */

import { logError } from "@/lib/app-log";
import {
  defaultAudienceListOptions,
  type AudienceListId,
  type AudienceListOption,
  type BotUserPreview,
} from "@/lib/bot-segments";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const AUDIENCE_USER_LIMIT = 5000;
const USERS_TABLE = "InvestDemidov_bot_users";
const SEGMENTS_TABLE = "InvestDemidov_bot_user_segments";

function toUserPreview(row: {
  telegram_id: string | number;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}): BotUserPreview {
  return {
    telegram_id: String(row.telegram_id),
    username: row.username ?? null,
    first_name: row.first_name ?? null,
    last_name: row.last_name ?? null,
  };
}

export type BotUserRow = {
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  consented_at: string | null;
  status: string;
  broadcast_opt_out_at: string | null;
  last_seen_at: string;
  created_at: string;
};

export async function listActiveBotUsers(limit = 500): Promise<BotUserRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const { data, error } = await db
    .from(USERS_TABLE)
    .select(
      "telegram_id, username, first_name, last_name, consented_at, status, broadcast_opt_out_at, last_seen_at, created_at",
    )
    .eq("status", "active")
    .order("last_seen_at", { ascending: false })
    .limit(limit);

  if (error) {
    logError("bot", "listActiveBotUsers failed", { message: error.message });
    return [];
  }
  return (data ?? []) as BotUserRow[];
}

export async function listAudienceOptions(): Promise<AudienceListOption[]> {
  const options = defaultAudienceListOptions();
  const db = getSupabaseAdmin();
  if (!db) return options;

  const { data: rawUsers, error: usersError } = await db
    .from(USERS_TABLE)
    .select(
      "telegram_id, username, first_name, last_name, broadcast_opt_out_at, last_seen_at",
    )
    .eq("status", "active")
    .order("last_seen_at", { ascending: false })
    .limit(AUDIENCE_USER_LIMIT);

  if (usersError) {
    logError("bot", "listAudienceOptions users failed", {
      message: usersError.message,
    });
    return options;
  }

  const users = rawUsers ?? [];
  const byId = new Map<string, BotUserPreview>();
  for (const row of users) {
    byId.set(String(row.telegram_id), toUserPreview(row));
  }

  const { data: segmentRows, error: segmentsError } = await db
    .from(SEGMENTS_TABLE)
    .select("telegram_id, segment, last_at")
    .order("last_at", { ascending: false })
    .limit(AUDIENCE_USER_LIMIT);

  if (segmentsError) {
    logError("bot", "listAudienceOptions segments failed", {
      message: segmentsError.message,
    });
  }

  const bySegment = new Map<string, BotUserPreview[]>();
  const seenInSegment = new Map<string, Set<string>>();
  for (const row of segmentRows ?? []) {
    const segment = String(row.segment);
    const id = String(row.telegram_id);
    const seen = seenInSegment.get(segment) ?? new Set<string>();
    if (seen.has(id)) continue;
    seen.add(id);
    seenInSegment.set(segment, seen);
    const preview =
      byId.get(id) ??
      ({
        telegram_id: id,
        username: null,
        first_name: null,
        last_name: null,
      } satisfies BotUserPreview);
    const list = bySegment.get(segment) ?? [];
    list.push(preview);
    bySegment.set(segment, list);
  }

  for (const option of options) {
    if (option.id === "all") {
      option.users = users.map(toUserPreview);
      option.count = option.users.length;
      continue;
    }
    if (option.id === "opted_out") {
      option.users = users
        .filter((row) => row.broadcast_opt_out_at != null)
        .map(toUserPreview);
      option.count = option.users.length;
      continue;
    }
    option.users = bySegment.get(option.id) ?? [];
    option.count = option.users.length;
  }

  return options;
}

async function telegramIdsForList(listId: AudienceListId): Promise<Set<string>> {
  const db = getSupabaseAdmin();
  const ids = new Set<string>();
  if (!db) return ids;

  if (listId === "all") {
    const { data } = await db
      .from(USERS_TABLE)
      .select("telegram_id")
      .eq("status", "active")
      .limit(5000);
    for (const row of data ?? []) {
      if (row.telegram_id) ids.add(String(row.telegram_id));
    }
    return ids;
  }

  if (listId === "opted_out") {
    const { data } = await db
      .from(USERS_TABLE)
      .select("telegram_id")
      .eq("status", "active")
      .not("broadcast_opt_out_at", "is", null)
      .limit(5000);
    for (const row of data ?? []) {
      if (row.telegram_id) ids.add(String(row.telegram_id));
    }
    return ids;
  }

  const { data } = await db
    .from(SEGMENTS_TABLE)
    .select("telegram_id")
    .eq("segment", listId)
    .limit(5000);
  for (const row of data ?? []) {
    if (row.telegram_id) ids.add(String(row.telegram_id));
  }
  return ids;
}

export async function resolveBroadcastAudience(input: {
  includeLists: AudienceListId[];
  excludeLists: AudienceListId[];
}): Promise<string[]> {
  const include =
    input.includeLists.length > 0
      ? input.includeLists
      : (["all"] as AudienceListId[]);

  const union = new Set<string>();
  for (const listId of include) {
    const ids = await telegramIdsForList(listId);
    for (const id of ids) union.add(id);
  }

  for (const listId of input.excludeLists) {
    const ids = await telegramIdsForList(listId);
    for (const id of ids) union.delete(id);
  }

  return [...union];
}

export async function previewBroadcastAudienceCount(input: {
  includeLists: AudienceListId[];
  excludeLists: AudienceListId[];
}): Promise<number> {
  const ids = await resolveBroadcastAudience(input);
  return ids.length;
}

export async function setBroadcastOptOut(
  telegramId: string,
  optedOut: boolean,
): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db
    .from(USERS_TABLE)
    .update({
      broadcast_opt_out_at: optedOut ? new Date().toISOString() : null,
      last_seen_at: new Date().toISOString(),
    })
    .eq("telegram_id", telegramId);
  if (error) {
    logError("bot", "setBroadcastOptOut failed", { message: error.message });
  }
}
