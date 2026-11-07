import { NextResponse } from "next/server";
import {
  loadAgentSettings,
  saveAgentSettings,
} from "@/lib/agent-config";
import {
  clampMemoryLimit,
  MAX_MEMORY_LIMIT,
  MIN_MEMORY_LIMIT,
} from "@/lib/agent-limits";
import { isFullAdminSession } from "@/lib/admin-auth";
import { logError, logInfo } from "@/lib/app-log";
import { isKnownModel } from "@/lib/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isFullAdminSession())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const settings = await loadAgentSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: Request) {
  if (!(await isFullAdminSession())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    systemPrompt?: unknown;
    model?: unknown;
    memoryLimit?: unknown;
  } | null;

  const systemPrompt =
    typeof body?.systemPrompt === "string" ? body.systemPrompt.trim() : "";
  const model = typeof body?.model === "string" ? body.model.trim() : "";
  const memoryLimit = clampMemoryLimit(body?.memoryLimit);

  if (!systemPrompt) {
    return NextResponse.json(
      { error: "Промпт не может быть пустым" },
      { status: 400 },
    );
  }
  if (!model || !isKnownModel(model)) {
    return NextResponse.json({ error: "Неизвестная модель" }, { status: 400 });
  }
  if (memoryLimit < MIN_MEMORY_LIMIT || memoryLimit > MAX_MEMORY_LIMIT) {
    return NextResponse.json(
      {
        error: `Память: целое число от ${MIN_MEMORY_LIMIT} до ${MAX_MEMORY_LIMIT}`,
      },
      { status: 400 },
    );
  }

  try {
    const settings = await saveAgentSettings({
      systemPrompt,
      model,
      memoryLimit,
    });
    logInfo("web", "admin agent settings saved", {
      model: settings.model,
      memoryLimit: settings.memoryLimit,
      promptLen: settings.systemPrompt.length,
    });
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    logError("web", "admin agent settings save failed", {
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не удалось сохранить настройки",
      },
      { status: 502 },
    );
  }
}
