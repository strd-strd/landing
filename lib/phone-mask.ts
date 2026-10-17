/**
 * Маска телефона РФ: +7 (XXX) XXX-XX-XX
 * Можно вводить с 8 / без кода — нормализуем к +7.
 */

export const PHONE_PLACEHOLDER = "+7 (___) ___-__-__";

/** Только цифры, ведущая 8 → 7, максимум 11 (7 + 10). */
export function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (digits.length > 0 && !digits.startsWith("7")) {
    digits = `7${digits}`;
  }
  return digits.slice(0, 11);
}

/** Отображение по маске по мере ввода. */
export function formatPhoneMask(value: string): string {
  const digits = phoneDigits(value);
  if (!digits) return "";

  const rest = digits.slice(1);
  const a = rest.slice(0, 3);
  const b = rest.slice(3, 6);
  const c = rest.slice(6, 8);
  const d = rest.slice(8, 10);

  let out = "+7";
  if (a.length > 0) {
    out += ` (${a}`;
    if (a.length === 3) out += ")";
  }
  if (b.length > 0) out += ` ${b}`;
  if (c.length > 0) out += `-${c}`;
  if (d.length > 0) out += `-${d}`;
  return out;
}

/** Полный номер: 11 цифр, начинается с 7. */
export function isValidRuPhone(value: string): boolean {
  const digits = phoneDigits(value);
  return digits.length === 11 && digits.startsWith("7");
}

/** Для API / Telegram: +79040591222 */
export function phoneE164(value: string): string {
  const digits = phoneDigits(value);
  if (!digits) return "";
  return `+${digits}`;
}
