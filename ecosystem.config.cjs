/**
 * PM2 на FastFox RU (5.44.41.186) рядом с:
 *   proect-1 :3000 (/var/www/lishkov)
 *   psyinst :3001 (/var/www/psyinst)
 *   strahovaniesmirnov :3003
 *   demidovpark :3004
 *   sglonass :3006
 * Этот проект — порт 3005, папка /var/www/investdemidov (invest.demidovpark.ru).
 *
 *   sudo -u nodejs -H bash -c 'cd /var/www/investdemidov && pm2 start ecosystem.config.cjs'
 *   sudo -u nodejs pm2 save
 */
module.exports = {
  apps: [
    {
      name: "investdemidov",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3005",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--dns-result-order=ipv4first",
      },
    },
    {
      // Telegram long polling (RU): вебхук часто Connection timed out.
      name: "investdemidov-tg-poll",
      cwd: __dirname,
      script: "node_modules/tsx/dist/cli.mjs",
      args: "bot/polling.ts",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--dns-result-order=ipv4first",
      },
    },
  ],
};
