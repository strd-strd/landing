import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE = "investdemidov_admin";

export type AdminRole = "admin";

export type AdminSession = {
  role: AdminRole;
};

function adminCreds(): { login: string; password: string } | null {
  const login = process.env.ADMIN_LOGIN?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!login || !password) return null;
  return { login, password };
}

function tokenFor(login: string, password: string): string {
  return createHash("sha256")
    .update(`admin:${login}:${password}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export async function isFullAdminSession(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const got = jar.get(COOKIE)?.value ?? "";
  if (!got) return null;

  const cred = adminCreds();
  if (!cred) return null;
  const expected = tokenFor(cred.login, cred.password);
  if (safeEqual(got, expected)) {
    return { role: "admin" };
  }
  return null;
}

export async function setAdminSession(): Promise<boolean> {
  const cred = adminCreds();
  if (!cred) return false;
  const jar = await cookies();
  jar.set(COOKIE, tokenFor(cred.login, cred.password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export function checkAdminCredentials(
  login: string,
  password: string,
): boolean {
  const cred = adminCreds();
  if (!cred) return false;
  return login === cred.login && password === cred.password;
}
