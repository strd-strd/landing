"use client";

import Link from "next/link";

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
};

/**
 * Обязательный чекбокс перед отправкой заявки: согласие 152-ФЗ + политика.
 */
export function ConsentCheckbox({
  checked,
  onChange,
  id = "pdn-consent",
  className = "flex cursor-pointer items-start gap-3 text-sm text-muted-foreground",
}: ConsentCheckboxProps) {
  return (
    <label htmlFor={id} className={className}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 shrink-0 cursor-pointer accent-accent"
        required
      />
      <span>
        Я даю{" "}
        <Link
          href="/consent"
          className="text-foreground underline underline-offset-2 transition-colors hover:text-accent"
          onClick={(event) => event.stopPropagation()}
        >
          согласие на обработку персональных данных
        </Link>{" "}
        и принимаю{" "}
        <Link
          href="/privacy"
          className="text-foreground underline underline-offset-2 transition-colors hover:text-accent"
          onClick={(event) => event.stopPropagation()}
        >
          политику конфиденциальности
        </Link>
        .
      </span>
    </label>
  );
}
