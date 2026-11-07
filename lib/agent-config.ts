import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  clampMemoryLimit,
  DEFAULT_MEMORY_LIMIT,
} from "@/lib/agent-limits";
import { logError } from "@/lib/app-log";
import { DEFAULT_MODEL, type ChatMessage } from "@/lib/models";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type { ChatMessage };
export type AgentSettings = {
  systemPrompt: string;
  model: string;
  memoryLimit: number;
};

export {
  clampMemoryLimit,
  DEFAULT_MEMORY_LIMIT,
  MAX_MEMORY_LIMIT,
  MIN_MEMORY_LIMIT,
} from "@/lib/agent-limits";

export const DEFAULT_SETTINGS: AgentSettings = {
  systemPrompt:
    "Ты консультант по инвестициям в автопарк «Демидов Парк» (Нижний Новгород). Отвечай кратко на русском.",
  model: DEFAULT_MODEL,
  memoryLimit: DEFAULT_MEMORY_LIMIT,
};

const SETTINGS_TABLE = "InvestDemidov_agent_settings";
const MESSAGES_TABLE = "InvestDemidov_chat_messages";
const seedPath = () => path.join(process.cwd(), "data", "agent.json");

const memoryHistory = new Map<string, ChatMessage[]>();

type SettingsRow = {
  id: number;
  system_prompt: string;
  model: string;
  memory_limit?: number | null;
};

function parseSettings(raw: string): AgentSettings {
  const parsed = JSON.parse(raw) as Partial<AgentSettings>;
  return {
    systemPrompt:
      typeof parsed.systemPrompt === "string" && parsed.systemPrompt.trim()
        ? parsed.systemPrompt
        : DEFAULT_SETTINGS.systemPrompt,
    model:
      typeof parsed.model === "string" && parsed.model.trim()
        ? parsed.model
        : DEFAULT_SETTINGS.model,
    memoryLimit: clampMemoryLimit(parsed.memoryLimit),
  };
}

async function readBundledSettings(): Promise<AgentSettings | null> {
  try {
    const raw = await readFile(seedPath(), "utf8");
    return parseSettings(raw);
  } catch {
    return null;
  }
}

async function writeBundledSettings(settings: AgentSettings): Promise<void> {
  await writeFile(
    seedPath(),
    `${JSON.stringify(
      {
        systemPrompt: settings.systemPrompt,
        model: settings.model,
        memoryLimit: settings.memoryLimit,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

export async function loadAgentSettings(): Promise<AgentSettings> {
  const db = getSupabaseAdmin();
  if (db) {
    const { data, error } = await db
      .from(SETTINGS_TABLE)
      .select("id, system_prompt, model, memory_limit")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data) {
      const row = data as SettingsRow;
      return {
        systemPrompt: row.system_prompt,
        model: row.model,
        memoryLimit: clampMemoryLimit(row.memory_limit),
      };
    }

    if (error) {
      logError("store", "agent settings load error", { code: error.code });
    }
  }

  const seeded = (await readBundledSettings()) ?? DEFAULT_SETTINGS;
  if (db) {
    try {
      await saveAgentSettings(seeded);
    } catch {
      /* seed optional if SQL ещё не применён */
    }
  }
  return seeded;
}

export async function saveAgentSettings(
  settings: AgentSettings,
): Promise<AgentSettings> {
  const next: AgentSettings = {
    systemPrompt: settings.systemPrompt.trim() || DEFAULT_SETTINGS.systemPrompt,
    model: settings.model.trim() || DEFAULT_SETTINGS.model,
    memoryLimit: clampMemoryLimit(settings.memoryLimit),
  };

  const db = getSupabaseAdmin();
  if (db) {
    const { error } = await db.from(SETTINGS_TABLE).upsert(
      {
        id: 1,
        system_prompt: next.systemPrompt,
        model: next.model,
        memory_limit: next.memoryLimit,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) {
      logError("store", "agent settings save error", { code: error.code });
      throw new Error(
        "Не удалось сохранить в Supabase. Выполните supabase/investdemidov-agent.sql",
      );
    }
  }

  try {
    await writeBundledSettings(next);
  } catch (error) {
    logError("store", "agent.json write error", {
      name: error instanceof Error ? error.name : undefined,
    });
    if (!db) {
      throw new Error("Не удалось сохранить настройки агента");
    }
  }

  return next;
}

export async function loadChatHistory(chatId: string): Promise<ChatMessage[]> {
  const db = getSupabaseAdmin();
  if (db) {
    const { data, error } = await db
      .from(MESSAGES_TABLE)
      .select("role, content")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (!error) {
      return ((data as { role: string; content: string }[]) ?? []).filter(
        (m): m is ChatMessage =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string",
      );
    }
    logError("store", "chat history load error", {
      chatId: chatId.startsWith("web:") ? "web" : "tg",
      code: error.code,
    });
  }

  return memoryHistory.get(chatId) ?? [];
}

export async function saveChatHistory(
  chatId: string,
  messages: ChatMessage[],
): Promise<void> {
  memoryHistory.set(chatId, messages);

  const db = getSupabaseAdmin();
  if (!db) return;

  const { error: deleteError } = await db
    .from(MESSAGES_TABLE)
    .delete()
    .eq("chat_id", chatId);

  if (deleteError) {
    logError("store", "chat history clear error", {
      chatId: chatId.startsWith("web:") ? "web" : "tg",
      code: deleteError.code,
    });
    return;
  }

  if (messages.length === 0) return;

  const now = Date.now();
  const rows = messages.map((message, index) => ({
    chat_id: chatId,
    role: message.role,
    content: message.content,
    created_at: new Date(now + index).toISOString(),
  }));

  const { error: insertError } = await db.from(MESSAGES_TABLE).insert(rows);
  if (insertError) {
    logError("store", "chat history save error", {
      chatId: chatId.startsWith("web:") ? "web" : "tg",
      code: insertError.code,
      length: messages.length,
    });
  }
}

export async function clearChatHistory(chatId: string): Promise<void> {
  memoryHistory.delete(chatId);
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from(MESSAGES_TABLE).delete().eq("chat_id", chatId);
  if (error) {
    logError("store", "chat history delete error", {
      chatId: chatId.startsWith("web:") ? "web" : "tg",
      code: error.code,
    });
  }
}
