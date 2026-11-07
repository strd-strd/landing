import { NextResponse } from "next/server";
import { isFullAdminSession } from "@/lib/admin-auth";
import { logError } from "@/lib/app-log";
import {
  listAudienceOptions,
  previewBroadcastAudienceCount,
} from "@/lib/bot-audience";
import { normalizeAudienceListIds } from "@/lib/bot-segments";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isFullAdminSession())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  try {
    const lists = await listAudienceOptions();
    return NextResponse.json({ ok: true, lists });
  } catch (error) {
    logError("web", "admin audience: GET failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Не удалось загрузить аудиторию" },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isFullAdminSession())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      includeLists?: unknown;
      excludeLists?: unknown;
    };
    const includeLists = normalizeAudienceListIds(body.includeLists);
    const excludeLists = normalizeAudienceListIds(body.excludeLists);
    const count = await previewBroadcastAudienceCount({
      includeLists: includeLists.length > 0 ? includeLists : ["all"],
      excludeLists,
    });
    return NextResponse.json({ ok: true, count });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
    }
    logError("web", "admin audience: preview failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Не удалось посчитать аудиторию" },
      { status: 502 },
    );
  }
}
