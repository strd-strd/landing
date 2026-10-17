"use client";

import { useId, useState, useSyncExternalStore } from "react";
import {
  FORM_TOKEN_VALUE,
  HONEYPOT_FIELD,
  STARTED_FIELD,
  TOKEN_FIELD,
} from "@/lib/form-antispam";

const emptySubscribe = () => () => undefined;

/**
 * Невидимые поля против ботов: honeypot + время открытия + JS-токен.
 * Должно жить внутри <form>.
 * Таймер — на каждый mount формы (попап заново открывается с новым startedAt).
 */
export function FormHoneypot() {
  const honeyId = useId();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [startedAt] = useState(() => String(Date.now()));
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
      <input
        type="hidden"
        name={STARTED_FIELD}
        value={isClient ? startedAt : ""}
        readOnly
      />
      <input type="hidden" name={TOKEN_FIELD} value={token} readOnly />
    </div>
  );
}
