"use client";

import {
  formatBotUserLabel,
  type BotUserPreview,
} from "@/lib/bot-segments";

const PREVIEW_LIMIT = 100;

export function AudienceUsersList({
  users,
  emptyHint,
  compact = false,
}: {
  users: BotUserPreview[];
  emptyHint?: string;
  compact?: boolean;
}) {
  if (users.length === 0) {
    return (
      <p
        className={
          compact
            ? "py-1 text-sm text-muted-foreground"
            : "px-6 py-4 text-sm text-muted-foreground"
        }
      >
        {emptyHint || "Пусто"}
      </p>
    );
  }

  const visible = users.slice(0, PREVIEW_LIMIT);
  const rest = users.length - visible.length;

  return (
    <div>
      <ul
        className={
          compact
            ? "max-h-48 divide-y divide-border overflow-y-auto"
            : "divide-y divide-border"
        }
      >
        {visible.map((user) => (
          <li
            key={user.telegram_id}
            className={
              compact
                ? "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-0 py-1.5 text-sm"
                : "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-6 py-3 text-sm"
            }
          >
            <span className="font-mono text-accent">{user.telegram_id}</span>
            <span className="text-muted-foreground">
              {formatBotUserLabel(user)}
            </span>
          </li>
        ))}
      </ul>
      {rest > 0 ? (
        <p
          className={
            compact
              ? "pt-2 text-xs text-muted-foreground"
              : "border-t border-border px-6 py-3 text-xs text-muted-foreground"
          }
        >
          и ещё {rest}
        </p>
      ) : null}
    </div>
  );
}
