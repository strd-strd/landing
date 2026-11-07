/** Модели Yandex AI Studio (OpenAI-compatible). */
export const YANDEX_MODELS = [
  "yandexgpt/latest",
  "yandexgpt/rc",
  "yandexgpt-lite",
  "aliceai-llm",
  "qwen3-235b-a22b-fp8",
  "gpt-oss-120b",
  "gpt-oss-20b",
  "gemma-3-27b-it",
] as const;

/** Модели OpenAI — запасной провайдер. */
export const OPENAI_MODELS = [
  "gpt-4.1-mini",
  "gpt-4.1",
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1-nano",
  "o4-mini",
] as const;

export const MODELS = [...YANDEX_MODELS, ...OPENAI_MODELS] as const;

export type ModelId = (typeof MODELS)[number];
export type YandexModelId = (typeof YANDEX_MODELS)[number];

export const DEFAULT_MODEL: ModelId = "yandexgpt/latest";

export const MODEL_LABELS: Record<ModelId, string> = {
  "yandexgpt/latest": "YandexGPT Pro 5",
  "yandexgpt/rc": "YandexGPT Pro 5.1",
  "yandexgpt-lite": "YandexGPT Lite 5",
  "aliceai-llm": "Alice AI LLM",
  "qwen3-235b-a22b-fp8": "Qwen3 235B",
  "gpt-oss-120b": "GPT-OSS 120B",
  "gpt-oss-20b": "GPT-OSS 20B",
  "gemma-3-27b-it": "Gemma 3 27B",
  "gpt-4.1-mini": "gpt-4.1-mini",
  "gpt-4.1": "gpt-4.1",
  "gpt-4o-mini": "gpt-4o-mini",
  "gpt-4o": "gpt-4o",
  "gpt-4.1-nano": "gpt-4.1-nano",
  "o4-mini": "o4-mini",
};

export function isKnownModel(model: string): model is ModelId {
  return (MODELS as readonly string[]).includes(model);
}

export function isYandexModel(model: string): model is YandexModelId {
  return (YANDEX_MODELS as readonly string[]).includes(model);
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
