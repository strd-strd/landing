/**
 * Grammy-бот invest: /start → welcome + URL к Евгению,
 * обычный текст → тот же ИИ-консультант, что виджет сайта.
 */

import { Bot, InlineKeyboard, type Context } from "grammy";
import { askInvestAssistant, formatAgentError } from "@/lib/agent";
import { allowChatByKey } from "@/lib/agent-limits";
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
    "Напишите вопрос — ответит ИИ-консультант (как на сайте).",
    "Чтобы сразу человеку — кнопка «Написать Евгению».",
  ].join("\n");
}

/** Inline URL: reply-клавиатура Telegram не умеет открывать ссылки. */
function mainKeyboard() {
  return new InlineKeyboard()
    .url("Написать Евгению", CONTACTS.telegramUrl)
    .row()
    .url("Сайт Invest", getSiteUrl());
}

function evgeniyKeyboard() {
  return new InlineKeyboard().url("Написать Евгению", CONTACTS.telegramUrl);
}

async function sendWelcome(ctx: Context, firstName: string) {
  await ctx.reply(welcomeText(firstName), {
    link_preview_options: { is_disabled: true },
    reply_markup: mainKeyboard(),
  });
}

function botChatId(telegramId: string | number): string {
  return `tg:${telegramId}`;
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

  bot.command("manager", async (ctx) => {
    const from = ctx.from;
    await ctx.reply(
      [
        "Напишите Евгению в Telegram — менеджер ответит лично:",
        CONTACTS.telegramUrl,
      ].join("\n"),
      {
        link_preview_options: { is_disabled: true },
        reply_markup: evgeniyKeyboard(),
      },
    );
    if (!from) return;
    void recordBotEvent({
      eventType: "callback_open",
      telegramId: String(from.id),
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name,
      meta: { action: "manager_link" },
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

    const telegramId = String(from.id);
    const chatKey = botChatId(telegramId);

    void upsertBotUser({
      telegramId,
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name,
      segment: "ask_manager",
    });

    void recordBotEvent({
      eventType: "question",
      telegramId,
      meta: { textLen: text.length, channel: "ai" },
      segment: "ask_manager",
    });

    if (!allowChatByKey(`tg:${telegramId}`)) {
      await ctx.reply("Слишком много сообщений. Подождите минуту.", {
        link_preview_options: { is_disabled: true },
        reply_markup: evgeniyKeyboard(),
      });
      return;
    }

    try {
      await ctx.replyWithChatAction("typing");
      const { reply } = await askInvestAssistant(chatKey, text);
      await ctx.reply(reply, {
        link_preview_options: { is_disabled: true },
        reply_markup: evgeniyKeyboard(),
      });
    } catch (error) {
      logError("bot", "chat agent failed", {
        name: error instanceof Error ? error.name : undefined,
        textLen: text.length,
      });
      await ctx.reply(formatAgentError(error), {
        link_preview_options: { is_disabled: true },
        reply_markup: evgeniyKeyboard(),
      });
    }
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
