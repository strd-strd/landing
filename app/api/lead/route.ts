import { NextResponse } from "next/server";
import { logError, logWarn } from "@/lib/app-log";
import {
  allowLeadByIp,
  checkFormAntispam,
  getRequestIp,
} from "@/lib/form-antispam";
import { isValidRuPhone, phoneE164 } from "@/lib/phone-mask";
import { sendInvestLeadToManager } from "@/lib/telegram-lead";

export const runtime = "nodejs";

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Тихий отказ: боту отвечаем успехом, в Telegram не шлём. */
function silentOk() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const ip = getRequestIp(request);

    const antispam = checkFormAntispam(form);
    if (!antispam.ok) {
      logWarn("web", "lead: spam blocked", { reason: antispam.reason, ip });
      return silentOk();
    }

    const name = asString(form.get("name"));
    const phoneRaw = asString(form.get("phone"));
    const sourceRaw = asString(form.get("source"));
    const source = sourceRaw === "popup" ? "popup" : "callback";
    const context = asString(form.get("context"));
    const car = asString(form.get("car"));
    const year = asString(form.get("year"));
    const title = asString(form.get("title"));

    if (name.length < 2) {
      return NextResponse.json({ error: "Укажите имя." }, { status: 400 });
    }
    if (!isValidRuPhone(phoneRaw)) {
      return NextResponse.json(
        { error: "Укажите телефон в формате +7 (XXX) XXX-XX-XX." },
        { status: 400 },
      );
    }
    const phone = phoneE164(phoneRaw);

    if (!allowLeadByIp(ip)) {
      logWarn("web", "lead: rate-limit", { ip, source });
      return NextResponse.json(
        {
          error:
            "Слишком много заявок. Подождите несколько минут или напишите в Telegram.",
        },
        { status: 429 },
      );
    }

    const result = await sendInvestLeadToManager({
      name,
      phone,
      source,
      context: context || undefined,
      car: car || undefined,
      year: year || undefined,
      title: title || undefined,
    });

    if (!result.ok) {
      // Детали уже в logError/logCritical (+ DB + алерт ID_OPS)
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logError("web", "lead: unexpected error", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте позже." },
      { status: 500 },
    );
  }
}
