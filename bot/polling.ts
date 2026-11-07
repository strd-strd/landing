/**
 * Long polling для VPS (RU): Telegram вебхук часто не достучится.
 * Исходящие — через TELEGRAM_PROXY_URL (lib/telegram-fetch).
 *
 * PM2: ecosystem app `investdemidov-tg-poll`
 */
import { loadEnvFile } from "../lib/load-env";
import { getTelegramBot } from "../lib/telegram-bot";

loadEnvFile();

async function main() {
  const bot = getTelegramBot();

  for (let attempt = 1; attempt <= 3; attempt++) {
    await bot.api.deleteWebhook({ drop_pending_updates: true });
    console.log("[bot] webhook deleted, starting long polling", { attempt });
    try {
      await bot.start({
        onStart: (info) => {
          console.log("[bot] polling online", { username: info.username });
        },
      });
      return;
    } catch (error) {
      const description =
        error && typeof error === "object" && "description" in error
          ? String((error as { description?: string }).description)
          : "";
      const isConflict =
        description.includes("terminated by setWebhook") ||
        description.includes("Conflict");
      console.error("[bot] polling start failed", {
        attempt,
        name: error instanceof Error ? error.name : undefined,
        description: description || undefined,
      });
      if (!isConflict || attempt === 3) throw error;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

main().catch((error) => {
  console.error("[bot] telegram polling fatal", {
    name: error instanceof Error ? error.name : undefined,
    message: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
