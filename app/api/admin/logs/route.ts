import { NextResponse } from "next/server";
import { isFullAdminSession } from "@/lib/admin-auth";
import { listAppLogs, logError } from "@/lib/app-log";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isFullAdminSession())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const raw = Number(searchParams.get("limit") ?? "100");
    const limit = Number.isFinite(raw) ? raw : 100;
    const errorsOnly =
      searchParams.get("errorsOnly") === "1" ||
      searchParams.get("errorsOnly") === "true";
    const logs = await listAppLogs(limit, { errorsOnly });
    return NextResponse.json({ ok: true, logs });
  } catch (error) {
    logError("web", "admin logs: list failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Не удалось загрузить логи" },
      { status: 502 },
    );
  }
}
