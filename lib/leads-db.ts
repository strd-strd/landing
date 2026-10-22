/**
 * Persist инвест-заявок в Supabase (InvestDemidov_leads).
 */

import { logError } from "@/lib/app-log";
import { addUserSegment } from "@/lib/bot-events-db";
import { getSupabaseAdmin, supabaseAdminDiag } from "@/lib/supabase-admin";

export type LeadDeliverStatus = "pending" | "delivered" | "failed";

export type SavedLeadRow = {
  id: string;
  source: string;
  message_text: string | null;
  deliver_status: LeadDeliverStatus;
  retry_count: number;
  created_at: string;
};

/** Сохранить заявку до/вместе с отправкой в Telegram. */
export async function saveLead(input: {
  source: string;
  telegramId?: string;
  name: string;
  phone: string;
  title?: string;
  car?: string;
  year?: string;
  context?: string;
  messageText: string;
  payload?: Record<string, unknown>;
  deliverStatus?: LeadDeliverStatus;
}): Promise<string | null> {
  const db = getSupabaseAdmin();
  if (!db) {
    logError("store", "saveLead: нет Supabase env", supabaseAdminDiag());
    return null;
  }

  try {
    const { data, error } = await db
      .from("InvestDemidov_leads")
      .insert({
        source: input.source,
        telegram_id: input.telegramId ?? null,
        name: input.name,
        phone: input.phone,
        title: input.title ?? null,
        car: input.car ?? null,
        year: input.year ?? null,
        context: input.context ?? null,
        payload: input.payload ?? {},
        status: "new",
        message_text: input.messageText,
        deliver_status: input.deliverStatus ?? "pending",
        retry_count: 0,
      })
      .select("id")
      .single();

    if (error || !data) {
      logError("store", "saveLead failed", {
        message: error?.message ?? "no data",
        ...supabaseAdminDiag(),
      });
      return null;
    }

    if (input.telegramId) {
      await addUserSegment(input.telegramId, "lead");
    }
    return String((data as { id: string }).id);
  } catch (error) {
    logError("store", "saveLead exception", {
      message: error instanceof Error ? error.message : String(error),
      ...supabaseAdminDiag(),
    });
    return null;
  }
}

export async function updateLeadDelivery(
  id: string,
  update: {
    deliverStatus: LeadDeliverStatus;
    lastError?: string | null;
    incrementRetry?: boolean;
  },
): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db || !id) return;

  try {
    const patch: Record<string, unknown> = {
      deliver_status: update.deliverStatus,
      last_error: update.lastError ?? null,
    };
    if (update.deliverStatus === "delivered") {
      patch.delivered_at = new Date().toISOString();
    }
    if (update.incrementRetry) {
      const { data } = await db
        .from("InvestDemidov_leads")
        .select("retry_count")
        .eq("id", id)
        .maybeSingle();
      const prev =
        data && typeof (data as { retry_count?: number }).retry_count === "number"
          ? (data as { retry_count: number }).retry_count
          : 0;
      patch.retry_count = prev + 1;
    }

    const { error } = await db
      .from("InvestDemidov_leads")
      .update(patch)
      .eq("id", id);
    if (error) {
      logError("store", "updateLeadDelivery failed", {
        message: error.message,
        id,
      });
    }
  } catch (error) {
    logError("store", "updateLeadDelivery exception", {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

/** Недоставленные тексты для повторной отправки (до 7 суток, ≤5 ретраев). */
export async function listUndeliveredLeads(limit = 20): Promise<SavedLeadRow[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  try {
    const { data, error } = await db
      .from("InvestDemidov_leads")
      .select("id, source, message_text, deliver_status, retry_count, created_at")
      .in("deliver_status", ["pending", "failed"])
      .gte("created_at", since)
      .lt("retry_count", 5)
      .not("message_text", "is", null)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      logError("store", "listUndeliveredLeads failed", {
        message: error.message,
      });
      return [];
    }
    return (data ?? []) as SavedLeadRow[];
  } catch (error) {
    logError("store", "listUndeliveredLeads exception", {
      message: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
