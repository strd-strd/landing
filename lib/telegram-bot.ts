/**
 * Минимальный Grammy-бот invest: /start → запись в DB + сегмент start,
 * отписка от рассылки, вопрос менеджеру.
 */

import { Bot, InlineKeyboard, type Context } from "grammy";
import { logError } from "@/lib/app-log";
import { setBroadcastOptOut } from "@/lib/bot-audience";
import { recordBotEvent, upsertBotUser } from "@/lib/bot-events-db";
import { CONTACTS } from "@/lib/contacts";
import { getSiteUrl } from "@/lib/site-url";
import { telegramFetch } from "@/lib/telegram-fetch";

let botSingleton: Bot | null = null;

function welcomeText(firstName: string): string {
  const name = firstName.trim() || "друг";
  return [
    `Здравствуйте, ${name}!`,
    "",
    "Это бот Invest «Демидов Парк»: инвестиции в автопарк и сдача авто в управление.",
    `Сайт: ${getSiteUrl()}`,
    `Телефон: ${CONTACTS.phoneDisplay}`,
    "",
    "Напишите вопрос или нажмите кнопку — менеджер ответит здесь.",
  ].join("\n");
}

function mainKeyboard() {
  return new InlineKeyboard()
    .url("Сайт Invest", getSiteUrl())
    .row()
    .text("Задать вопрос", "ask_manager")
    .url("Telegram менеджера", CONTACTS.telegramUrl);
}

async function sendWelcome(ctx: Context, firstName: string) {
  await ctx.reply(welcomeText(firstName), {
    link_preview_options: { is_disabled: true },
    reply_markup: mainKeyboard(),
  });
}

export function createTelegramBot(): Bot {
  const token = process.env.TOKEN_TELEGRAM?.trim();
  if (!token) {
    throw new Error("TOKEN_TELEGRAM is empty");
  }

  const bot = new Bot(token, {
    client: {
      fetch: telegramFetch as unknown as typeof fetch,
    },
  });

  bot.catch((err) => {
    logError("bot", "update failed", {
      message:
        err.error instanceof Error ? err.error.message : String(err.error),
    });
  });

  bot.command("start", async (ctx) => {
    const from = ctx.from;
    if (!from) return;

    await sendWelcome(ctx, from.first_name ?? "");

    void upsertBotUser({
      telegramId: String(from.id),
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name,
      consented: true,
      segment: "start",
    }).catch((error) => {
      logError("bot", "upsert after start failed", {
        message: error instanceof Error ? error.message : String(error),
      });
    });

    void recordBotEvent({
      eventType: "bot_start",
      telegramId: String(from.id),
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name,
      segment: "start",
    });
  });

  bot.callbackQuery("ask_manager", async (ctx) => {
    const from = ctx.from;
    if (!from) {
      await ctx.answerCallbackQuery();
      return;
    }
    await ctx.answerCallbackQuery({ text: "Напишите вопрос" });
    await ctx.reply(
      "Напишите ваш вопрос следующим сообщением — менеджер увидит его и ответит здесь.",
      { link_preview_options: { is_disabled: true } },
    );
    void recordBotEvent({
      eventType: "question",
      telegramId: String(from.id),
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name,
      segment: "ask_manager",
    });
  });

  bot.callbackQuery("bc:unsub", async (ctx) => {
    const from = ctx.from;
    await ctx.answerCallbackQuery({ text: "Вы отписаны от рассылок" });
    if (!from) return;
    await setBroadcastOptOut(String(from.id), true);
    void recordBotEvent({
      eventType: "broadcast_opt_out",
      telegramId: String(from.id),
    });
    await ctx.reply(
      "Вы отписаны от рекламных рассылок бота. Чтобы снова получать — напишите /start.",
      { link_preview_options: { is_disabled: true } },
    );
  });

  bot.callbackQuery("bc:resub", async (ctx) => {
    const from = ctx.from;
    await ctx.answerCallbackQuery({ text: "Подписка восстановлена" });
    if (!from) return;
    await setBroadcastOptOut(String(from.id), false);
    await ctx.reply("Снова будете получать рассылки.", {
      link_preview_options: { is_disabled: true },
    });
  });

  bot.on("message:text", async (ctx) => {
    const from = ctx.from;
    if (!from) return;
    const text = ctx.message.text?.trim() ?? "";
    if (!text || text.startsWith("/")) return;

    void upsertBotUser({
      telegramId: String(from.id),
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name,
      segment: "ask_manager",
    });

    void recordBotEvent({
      eventType: "question",
      telegramId: String(from.id),
      meta: { textLen: text.length },
      segment: "ask_manager",
    });

    await ctx.reply(
      [
        "Сообщение принято. Менеджер ответит здесь в чате.",
        `Или позвоните: ${CONTACTS.phoneDisplay}`,
      ].join("\n"),
      { link_preview_options: { is_disabled: true } },
    );
  });

  return bot;
}

export function getTelegramBot(): Bot {
  if (!botSingleton) {
    botSingleton = createTelegramBot();
  }
  return botSingleton;
}

export async function ensureTelegramBot(): Promise<Bot> {
  return getTelegramBot();
}
