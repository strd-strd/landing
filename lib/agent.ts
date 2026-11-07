import OpenAI, { APIError } from "openai";
import {
  clearChatHistory,
  loadAgentSettings,
  loadChatHistory,
  saveChatHistory,
  type ChatMessage,
} from "@/lib/agent-config";
import { logError } from "@/lib/app-log";
import { CONTACTS } from "@/lib/contacts";
import { readEnv } from "@/lib/load-env";
import { isYandexModel } from "@/lib/models";

const YANDEX_BASE_URL = "https://ai.api.cloud.yandex.net/v1";
const FALLBACK_OPENAI_MODEL = "o4-mini";
const MAX_OUTPUT_CHARS = 3500;

type AgentMessage =
  | { role: "system"; content: string }
  | ChatMessage;

type CompletionResult = {
  text: string;
  model: string;
};

function getOpenAIClient() {
  const apiKey = readEnv("API_GPT");
  if (!apiKey) {
    throw new Error("Не задан API_GPT в .env.local");
  }
  return new OpenAI({ apiKey });
}

function getYandexClient() {
  const apiKey = readEnv("YANDEX_API_KEY");
  const folderId = readEnv("YANDEX_ID");
  if (!apiKey) {
    throw new Error("Не задан YANDEX_API_KEY в .env.local");
  }
  if (!folderId) {
    throw new Error("Не задан YANDEX_ID в .env.local");
  }
  return {
    client: new OpenAI({
      apiKey,
      baseURL: YANDEX_BASE_URL,
      project: folderId,
      defaultHeaders: {
        "OpenAI-Project": folderId,
      },
    }),
    folderId,
  };
}

function resolveModel(model: string): { client: OpenAI; model: string } {
  if (isYandexModel(model)) {
    const { client, folderId } = getYandexClient();
    const uri = model.startsWith("gpt://")
      ? model
      : `gpt://${folderId}/${model}`;
    return { client, model: uri };
  }
  return { client: getOpenAIClient(), model };
}

async function completeWithModel(
  client: OpenAI,
  model: string,
  messages: AgentMessage[],
): Promise<CompletionResult> {
  const completion = await client.chat.completions.create({
    model,
    messages,
  });
  return {
    text: completion.choices[0]?.message?.content?.trim() || "",
    model,
  };
}

function buildInvestContext(): string {
  return [
    "Контекст Invest Demidov (не выдумывай иное):",
    `- Бренд: ${CONTACTS.brand}, ${CONTACTS.city}`,
    `- Адрес: ${CONTACTS.address}; часы: ${CONTACTS.hours}`,
    `- Телефон: ${CONTACTS.phoneDisplay}`,
    `- Telegram: ${CONTACTS.telegramUrl}`,
    `- Сайт: ${CONTACTS.canonicalHost}`,
    "- Модели: пул инвесторов (вход от 100 000 ₽) и сдача своего авто в управление.",
    "- Ориентиры дохода: от 2 000 ₽/сутки, от 14 000 ₽/неделя, от 45 000 ₽/месяц — точные условия на встрече.",
    "- Если вопрос вне темы инвестиций/автопарка — кратко скажи об этом и предложи менеджера.",
  ].join("\n");
}

export async function replyWithAgent(chatId: string, userText: string) {
  const settings = await loadAgentSettings();
  const memoryLimit = settings.memoryLimit;
  const history = await loadChatHistory(chatId);
  const investContext = buildInvestContext();

  const promptHistory = [
    ...history.slice(-(memoryLimit - 1)),
    { role: "user" as const, content: userText },
  ];

  const messages: AgentMessage[] = [
    { role: "system", content: settings.systemPrompt },
    { role: "system", content: investContext },
    ...promptHistory,
  ];

  let reply = "";
  let usedModel = settings.model;

  if (isYandexModel(settings.model)) {
    try {
      const { client, model } = resolveModel(settings.model);
      const result = await completeWithModel(client, model, messages);
      reply = result.text;
      usedModel = result.model;
      if (!reply) throw new Error("empty_yandex_reply");
    } catch (error) {
      logError("web", "yandex unavailable, fallback to o4-mini", {
        model: settings.model,
        status: error instanceof APIError ? error.status : undefined,
        name: error instanceof Error ? error.name : undefined,
      });
      const client = getOpenAIClient();
      const result = await completeWithModel(
        client,
        FALLBACK_OPENAI_MODEL,
        messages,
      );
      reply = result.text;
      usedModel = result.model;
    }
  } else {
    const { client, model } = resolveModel(settings.model);
    const result = await completeWithModel(client, model, messages);
    reply = result.text;
    usedModel = result.model;
  }

  if (!reply) {
    reply = "Не получилось сформировать ответ.";
  }
  if (reply.length > MAX_OUTPUT_CHARS) {
    reply = `${reply.slice(0, MAX_OUTPUT_CHARS - 1)}…`;
  }

  const nextHistory: ChatMessage[] = (
    [
      ...history,
      { role: "user" as const, content: userText },
      { role: "assistant" as const, content: reply },
    ] satisfies ChatMessage[]
  ).slice(-memoryLimit);

  try {
    await saveChatHistory(chatId, nextHistory);
  } catch (error) {
    logError("web", "chat history persist error", {
      name: error instanceof Error ? error.name : undefined,
    });
  }

  return { reply, model: usedModel };
}

export function formatAgentError(error: unknown): string {
  if (error instanceof APIError) {
    const text = `${error.message} ${error.code ?? ""}`.toLowerCase();
    if (
      error.status === 429 &&
      (text.includes("credit") || text.includes("quota"))
    ) {
      return "Ассистент временно недоступен: закончились кредиты у провайдера. Напишите менеджеру.";
    }
    if (error.status === 429) {
      return "Слишком много запросов к модели. Попробуйте через минуту.";
    }
    if (error.status === 401) {
      return "Ключ API модели недействителен. Проверьте YANDEX_API_KEY / API_GPT на сервере.";
    }
    return "Не удалось получить ответ. Попробуйте ещё раз или напишите менеджеру.";
  }

  if (error instanceof Error) {
    if (error.message.includes("YANDEX_API_KEY")) {
      return "Не задан YANDEX_API_KEY на сервере.";
    }
    if (error.message.includes("YANDEX_ID")) {
      return "Не задан YANDEX_ID на сервере.";
    }
    if (error.message.includes("API_GPT")) {
      return "Не задан API_GPT на сервере.";
    }
  }

  return "Не удалось получить ответ. Попробуйте ещё раз или напишите менеджеру.";
}

export async function resetAgentChat(chatId: string) {
  await clearChatHistory(chatId);
}
