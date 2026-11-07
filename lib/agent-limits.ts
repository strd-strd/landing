/** Сколько последних сообщений диалога помнить по умолчанию. */
export const DEFAULT_MEMORY_LIMIT = 20;
export const MIN_MEMORY_LIMIT = 2;
export const MAX_MEMORY_LIMIT = 200;

export function clampMemoryLimit(value: unknown): number {
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  if (!Number.isFinite(num)) return DEFAULT_MEMORY_LIMIT;
  return Math.min(
    MAX_MEMORY_LIMIT,
    Math.max(MIN_MEMORY_LIMIT, Math.floor(num)),
  );
}

const CHAT_RATE_WINDOW_MS = 60_000;
const CHAT_RATE_MAX = 20;
const chatHits = new Map<string, number[]>();

/** true = можно принимать сообщение; false = слишком часто. */
export function allowChatByKey(key: string): boolean {
  const now = Date.now();
  const prev = chatHits.get(key) ?? [];
  const recent = prev.filter((t) => now - t < CHAT_RATE_WINDOW_MS);
  if (recent.length >= CHAT_RATE_MAX) {
    chatHits.set(key, recent);
    return false;
  }
  recent.push(now);
  chatHits.set(key, recent);
  return true;
}
