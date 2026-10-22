import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Service-role клиент только на сервере. null — если env не задан.
 *
 * Не ставить wizard Next.js (`NEXT_PUBLIC_*` + `@supabase/ssr` + middleware):
 * лиды/логи только через service role. Publishable/anon в клиент не тащим.
 *
 * Env:
 * - `SUPABASE_URL` (или `NEXT_PUBLIC_SUPABASE_URL` — URL не секрет)
 * - `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → `service_role` (секрет)
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (client) return client;
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
