import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const COOKIE = "investdemidov_web_chat";

/** Стабильный chat_id для веб-виджета (cookie, 30 дней). */
export async function getOrCreateWebChatId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value?.trim();
  if (existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing)) {
    return `web:${existing}`;
  }
  const id = randomUUID().replace(/-/g, "").slice(0, 24);
  jar.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return `web:${id}`;
}
