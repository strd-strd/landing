import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Какой ключ лежит в SUPABASE_SERVICE_ROLE_KEY (без утечки значения).
 * publishable/anon → RLS не обходится → «violates row-level security policy».
 */
export type SupabaseServiceKeyKind =
  | "missing"
  | "service_role"
  | "publishable_or_anon"
  | "unknown";

export function getSupabaseServiceKeyKind(): SupabaseServiceKeyKind {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return "missing";
  if (
    key.startsWith("sb_publishable_") ||
    key.startsWith("eyJ") && jwtRoleLooksPublic(key)
  ) {
    return "publishable_or_anon";
  }
  if (key.startsWith("sb_secret_")) return "service_role";
  if (key.startsWith("eyJ") && jwtRoleIsService(key)) return "service_role";
  // Длинный legacy JWT без разбора — считаем service, если не publishable-префикс
  if (key.length > 40 && !key.startsWith("sb_publishable_")) return "unknown";
  return "unknown";
}

function jwtPayload(key: string): Record<string, unknown> | null {
  try {
    const parts = key.split(".");
    if (parts.length < 2) return null;
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    const parsed: unknown = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function jwtRoleIsService(key: string): boolean {
  const payload = jwtPayload(key);
  return payload?.role === "service_role";
}

function jwtRoleLooksPublic(key: string): boolean {
  const payload = jwtPayload(key);
  const role = payload?.role;
  return role === "anon" || role === "authenticated";
}

/**
 * Service-role клиент только на сервере. null — если env не задан.
 *
 * Не ставить wizard Next.js (`NEXT_PUBLIC_*` + `@supabase/ssr` + middleware):
 * лиды/логи только через service role. Publishable/anon в клиент не тащим.
 *
 * Env:
 * - `SUPABASE_URL` (или `NEXT_PUBLIC_SUPABASE_URL` — URL не секрет)
 * - `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → `service_role` / secret
 *   (НЕ `anon` / `sb_publishable_…`)
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

/** Контекст для логов store без секретов. */
export function supabaseAdminDiag(): {
  hasUrl: boolean;
  hasServiceRoleKey: boolean;
  serviceKeyKind: SupabaseServiceKeyKind;
} {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return {
    hasUrl: Boolean(url),
    hasServiceRoleKey: Boolean(key),
    serviceKeyKind: getSupabaseServiceKeyKind(),
  };
}
