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

export function isBotSegment(value: string): value is BotSegment {
  return (BOT_SEGMENTS as readonly string[]).includes(value);
}
