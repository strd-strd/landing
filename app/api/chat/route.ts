import { NextResponse } from "next/server";
import { formatAgentError, replyWithAgent, resetAgentChat } from "@/lib/agent";
import { loadAgentSettings, loadChatHistory } from "@/lib/agent-config";
import { allowChatByKey } from "@/lib/agent-limits";
import { logError, logWarn } from "@/lib/app-log";
import { getRequestIp } from "@/lib/form-antispam";
import { getOrCreateWebChatId } from "@/lib/web-chat-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const chatId = await getOrCreateWebChatId();
  const [messages, settings] = await Promise.all([
    loadChatHistory(chatId),
    loadAgentSettings(),
  ]);
  return NextResponse.json({ messages, model: settings.model });
}

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  if (!allowChatByKey(`ip:${ip}`)) {
    return NextResponse.json(
      { error: "Слишком много сообщений. Подождите минуту." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    text?: unknown;
  } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "Сообщение пустое" }, { status: 400 });
  }
  if (text.length > 4000) {
    return NextResponse.json(
      { error: "Сообщение слишком длинное" },
      { status: 400 },
    );
  }

  const chatId = await getOrCreateWebChatId();
  if (!allowChatByKey(chatId)) {
    return NextResponse.json(
      { error: "Слишком много сообщений. Подождите минуту." },
      { status: 429 },
    );
  }

  try {
    const result = await replyWithAgent(chatId, text);
    return NextResponse.json(result);
  } catch (error) {
    logError("web", "chat agent failed", {
      name: error instanceof Error ? error.name : undefined,
      textLen: text.length,
    });
    return NextResponse.json(
      { error: formatAgentError(error) },
      { status: 502 },
    );
  }
}

export async function DELETE() {
  const chatId = await getOrCreateWebChatId();
  await resetAgentChat(chatId);
  logWarn("web", "chat history cleared", { chatId: "web" });
  return NextResponse.json({ ok: true });
}
