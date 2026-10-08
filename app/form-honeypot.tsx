"use client";

import { useId, useSyncExternalStore } from "react";
import {
  FORM_TOKEN_VALUE,
  HONEYPOT_FIELD,
  STARTED_FIELD,
  TOKEN_FIELD,
} from "@/lib/form-antispam";

const emptySubscribe = () => () => undefined;

let clientStartedAt = "";

function getClientStartedAt(): string {
  if (!clientStartedAt) {
    clientStartedAt = String(Date.now());
  }
  return clientStartedAt;
}

/**
 * Невидимые поля против ботов: honeypot + время открытия + JS-токен.
 * Должно жить внутри <form>.
 */
export function FormHoneypot() {
  const honeyId = useId();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const startedAt = isClient ? getClientStartedAt() : "";
  const token = isClient ? FORM_TOKEN_VALUE : "";

  return (
    <div
      className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden opacity-0"
      aria-hidden="true"
    >
      <label htmlFor={honeyId}>
        Не заполняйте это поле
        <input
          id={honeyId}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
      <input type="hidden" name={STARTED_FIELD} value={startedAt} readOnly />
      <input type="hidden" name={TOKEN_FIELD} value={token} readOnly />
    </div>
  );
}
