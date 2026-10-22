"use client";

import Link from "next/link";
import { useCallback, useSyncExternalStore } from "react";

export const COOKIE_CONSENT_KEY = "investdemidov_cookie_ok";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeCookieConsent(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getBannerVisibleSnapshot(): boolean {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) !== "1";
  } catch {
    return true;
  }
}

function getConsentAcceptedSnapshot(): boolean {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

/** true после «Хорошо» на баннере — для Метрики. */
export function useCookieConsentAccepted(): boolean {
  return useSyncExternalStore(
    subscribeCookieConsent,
    getConsentAcceptedSnapshot,
    getServerSnapshot,
  );
}

export function CookieBanner() {
  const visible = useSyncExternalStore(
    subscribeCookieConsent,
    getBannerVisibleSnapshot,
    getServerSnapshot,
  );

  const accept = useCallback(() => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "1");
    } catch {
      // ignore
    }
    emit();
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Уведомление о cookies"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border/80 bg-background/95 px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Мы используем cookies, чтобы сайт работал стабильнее, и Яндекс.Метрику
          для статистики посещений. Подробности — в{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-2 transition-colors hover:text-accent"
          >
            политике конфиденциальности
          </Link>{" "}
          и{" "}
          <Link
            href="/consent"
            className="text-foreground underline underline-offset-2 transition-colors hover:text-accent"
          >
            согласии на обработку ПДн
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
        >
          Хорошо
        </button>
      </div>
    </div>
  );
}
