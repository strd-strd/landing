import { ProxyAgent, fetch as undiciFetch } from "undici";
import type { RequestInit as UndiciRequestInit } from "undici";

let proxyAgent: ProxyAgent | null | undefined;
let proxyLogged = false;

/** TELEGRAM_PROXY_URL, иначе PROXY_URL (HTTP-прокси только для api.telegram.org). */
export function resolveTelegramProxyUrl(): string {
  return (
    (process.env.TELEGRAM_PROXY_URL ?? "").trim() ||
    (process.env.PROXY_URL ?? "").trim()
  );
}

function getTelegramProxyAgent(): ProxyAgent | null {
  if (proxyAgent !== undefined) return proxyAgent;

  const proxyUrl = resolveTelegramProxyUrl();
  if (!proxyUrl) {
    proxyAgent = null;
    return null;
  }

  try {
    const parsed = new URL(proxyUrl);
    proxyAgent = new ProxyAgent(proxyUrl);
    if (!proxyLogged) {
      proxyLogged = true;
      console.log("[telegram] outbound proxy enabled", {
        host: parsed.host,
      });
    }
  } catch {
    console.error("[telegram] invalid TELEGRAM_PROXY_URL/PROXY_URL");
    proxyAgent = null;
  }
  return proxyAgent;
}

type GrammyFetchInit = RequestInit & {
  /** node-fetch / grammY baseFetchConfig — undici не понимает */
  agent?: unknown;
  compress?: unknown;
};

/**
 * fetch к Telegram API через HTTP-прокси (FastFox RU → NL tinyproxy).
 * Без env — обычный fetch (локальная разработка).
 *
 * grammY в Node передаёт: agent, compress, duplex, signal —
 * для undici выбрасываем agent/compress/signal.
 */
export function telegramFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const proxy = getTelegramProxyAgent();
  if (!proxy) {
    return fetch(input, init);
  }

  const raw = (init ?? {}) as GrammyFetchInit;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip grammY Node fields
  const { agent, compress, signal, ...rest } = raw;

  return undiciFetch(input as string | URL, {
    ...(rest as UndiciRequestInit),
    dispatcher: proxy,
  }) as unknown as Promise<Response>;
}
