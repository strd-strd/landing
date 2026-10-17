/**
 * PM2 на Beget рядом с:
 *   proect-1 :3000 (/var/www/html)
 *   ollmet :3001 (/var/www/ollmet)
 *   technodevil :3002 (/var/www/technodevil)
 *   strahovaniesmirnov :3003 (/var/www/strahovaniesmirnov)
 *   demidovpark :3004 (/var/www/demidovpark)
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
      },
    },
  ],
};
