/**
 * Env Telegram: роли и токен.
 * ID_OPS — разработчик / главный админ: алерты об ошибках.
 * ID_ADMIN — менеджер(ы): заявки инвесторов в боте.
 */

function parseTelegramIds(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^-?\d+$/.test(id));
}

export function getToken(): string | null {
  const token = process.env.TOKEN_TELEGRAM?.trim();
  return token || null;
}

/** Приватный канал/группа заявок (опционально). */
export function getLeadChannelId(): string | null {
  const lead = process.env.LEAD_TELEGRAM_CHAT_ID?.trim();
  return lead && /^-?\d+$/.test(lead) ? lead : null;
}

/** Менеджеры: получают заявки. */
export function getAdminUserIds(): string[] {
  return parseTelegramIds(process.env.ID_ADMIN);
}

/**
 * Ops / разработчик: ошибки сайта.
 * Если ID_OPS пуст — fallback на первого из ID_ADMIN.
 */
export function getOpsUserIds(): string[] {
  const ops = parseTelegramIds(process.env.ID_OPS);
  if (ops.length > 0) return ops;
  return getAdminUserIds().slice(0, 1);
}

/** Куда слать заявку: группа (если есть) + лички менеджеров. Не ID_OPS. */
export function getLeadDestinations(): string[] {
  const ids = new Set<string>();
  const channel = getLeadChannelId();
  if (channel) ids.add(channel);
  for (const id of getAdminUserIds()) ids.add(id);
  return [...ids];
}

export function isManagerTelegramId(userId: string | number): boolean {
  return getAdminUserIds().includes(String(userId));
}

export function isOpsTelegramId(userId: string | number): boolean {
  return getOpsUserIds().includes(String(userId));
}
