/**
 * Сегменты аудитории бота / Mini App (invest).
 * Пользователь может одновременно быть в нескольких списках.
 */

export const BOT_SEGMENTS = [
  "start",
  "mini",
  "ask_manager",
  "lead",
  "calc_pool",
  "calc_car",
] as const;

export type BotSegment = (typeof BOT_SEGMENTS)[number];

export type AudienceListId = "all" | "opted_out" | BotSegment;

/** Краткая карточка пользователя для админки / сегментов. */
export type BotUserPreview = {
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
};

export type AudienceListOption = {
  id: AudienceListId;
  label: string;
  hint: string;
  count: number;
  users: BotUserPreview[];
};

export function formatBotUserLabel(user: BotUserPreview): string {
  const handle = user.username?.trim()
    ? `@${user.username.trim()}`
    : "";
  const name = [user.first_name, user.last_name]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ")
    .trim();
  if (handle && name) return `${handle} · ${name}`;
  if (handle) return handle;
  if (name) return name;
  return "без имени";
}

const SEGMENT_META: Record<BotSegment, { label: string; hint: string }> = {
  start: {
    label: "Нажали /start",
    hint: "Запускали бота командой Start",
  },
  mini: {
    label: "Открывали Mini App",
    hint: "Заходили в мини-приложение",
  },
  ask_manager: {
    label: "Диалог в боте",
    hint: "Писали ИИ-консультанту в Telegram-боте",
  },
  lead: {
    label: "Оставили заявку",
    hint: "Заявка с привязкой к Telegram ID",
  },
  calc_pool: {
    label: "Считали пул",
    hint: "Калькулятор пула инвесторов",
  },
  calc_car: {
    label: "Считали своё авто",
    hint: "Калькулятор сдачи авто",
  },
};

export function isBotSegment(value: string): value is BotSegment {
  return (BOT_SEGMENTS as readonly string[]).includes(value);
}

export function parseAudienceListId(raw: string): AudienceListId | null {
  const value = raw.trim();
  if (value === "all" || value === "opted_out") return value;
  if (isBotSegment(value)) return value;
  return null;
}

export function normalizeAudienceListIds(input: unknown): AudienceListId[] {
  if (!Array.isArray(input)) return [];
  const out: AudienceListId[] = [];
  const seen = new Set<string>();
  for (const item of input) {
    if (typeof item !== "string") continue;
    const id = parseAudienceListId(item);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function defaultAudienceListOptions(): AudienceListOption[] {
  return [
    {
      id: "all",
      label: "Все пользователи",
      hint: "Все, кто есть в базе бота",
      count: 0,
      users: [],
    },
    ...BOT_SEGMENTS.map((id) => ({
      id,
      label: SEGMENT_META[id].label,
      hint: SEGMENT_META[id].hint,
      count: 0,
      users: [] as BotUserPreview[],
    })),
    {
      id: "opted_out",
      label: "Отписались от рассылки",
      hint: "Исключайте справа, если не хотите писать отписавшимся",
      count: 0,
      users: [],
    },
  ];
}
