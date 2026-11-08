import { ProxyAgent, fetch as undiciFetch } from "undici";
import type { RequestInit as UndiciRequestInit } from "undici";

let telegramProxyAgent: ProxyAgent | null | undefined;
let openAiProxyAgent: ProxyAgent | null | undefined;
const agentsByUrl = new Map<string, ProxyAgent>();

/** TELEGRAM_PROXY_URL, иначе PROXY_URL (HTTP-прокси для api.telegram.org). */
export function resolveTelegramProxyUrl(): string {
  return (
    (process.env.TELEGRAM_PROXY_URL ?? "").trim() ||
    (process.env.PROXY_URL ?? "").trim()
  );
}

/**
 * Прокси для OpenAI с RU VPS (гео-блок).
 * OPENAI_PROXY_URL → TELEGRAM_PROXY_URL → PROXY_URL.
 */
export function resolveOpenAIProxyUrl(): string {
  return (
    (process.env.OPENAI_PROXY_URL ?? "").trim() || resolveTelegramProxyUrl()
  );
}

function getOrCreateProxyAgent(
  proxyUrl: string,
  logLabel: "[telegram]" | "[agent]",
): ProxyAgent | null {
  const cached = agentsByUrl.get(proxyUrl);
  if (cached) return cached;

  try {
    const parsed = new URL(proxyUrl);
    const agent = new ProxyAgent(proxyUrl);
    agentsByUrl.set(proxyUrl, agent);
    console.log(`${logLabel} outbound proxy enabled`, { host: parsed.host });
    return agent;
  } catch {
    console.error(`${logLabel} invalid proxy URL`);
    return null;
  }
}

function getTelegramProxyAgent(): ProxyAgent | null {
  if (telegramProxyAgent !== undefined) return telegramProxyAgent;

  const proxyUrl = resolveTelegramProxyUrl();
  if (!proxyUrl) {
    telegramProxyAgent = null;
    return null;
  }

  telegramProxyAgent = getOrCreateProxyAgent(proxyUrl, "[telegram]");
  return telegramProxyAgent;
}

/** Тот же NL tinyproxy, что и Telegram — для api.openai.com с RU. */
export function getOpenAIProxyAgent(): ProxyAgent | null {
  if (openAiProxyAgent !== undefined) return openAiProxyAgent;

  const proxyUrl = resolveOpenAIProxyUrl();
  if (!proxyUrl) {
    openAiProxyAgent = null;
    return null;
  }

  openAiProxyAgent = getOrCreateProxyAgent(proxyUrl, "[agent]");
  return openAiProxyAgent;
}

type ProxyFetchInit = RequestInit & {
  /** node-fetch / grammY baseFetchConfig — undici не понимает */
  agent?: unknown;
  compress?: unknown;
};

function fetchViaProxy(
  proxy: ProxyAgent,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const rest = { ...((init ?? {}) as ProxyFetchInit) };
  // undici падает на node-fetch/grammY agent и на AbortSignal из OpenAI SDK
  delete rest.agent;
  delete rest.compress;
  delete rest.signal;

  return undiciFetch(input as string | URL, {
    ...(rest as UndiciRequestInit),
    dispatcher: proxy,
  }) as unknown as Promise<Response>;
}

/**
 * fetch к Telegram API через HTTP-прокси (FastFox RU → NL tinyproxy).
 *
 * grammY в Node передаёт: agent (http.Agent), compress, duplex, signal.
 * npm-undici падает на signal («Expected AbortSignal») и на agent —
 * выбрасываем их. Таймаут grammY всё равно через Promise.race.
 */
export function telegramFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const proxy = getTelegramProxyAgent();
  if (!proxy) {
    return fetch(input, init);
  }
  return fetchViaProxy(proxy, input, init);
}

/**
 * fetch к OpenAI через NL-прокси (обход unsupported_country_region_territory).
 * Без прокси — обычный fetch. signal выбрасывается (undici).
 */
export function openaiProxyFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const proxy = getOpenAIProxyAgent();
  if (!proxy) {
    return fetch(input, init);
  }
  return fetchViaProxy(proxy, input, init);
}
