#!/usr/bin/env bash
# Вставка на FastFox RU (5.44.41.186) от root.
# Обновляет /var/www/investdemidov с GitHub и перезапускает PM2 investdemidov :3005.
set -euo pipefail

APP=/var/www/investdemidov
EXPECTED_HOST=invest.demidovpark.ru
PORT=3005

echo "== до обновления =="
cd "$APP"
git remote -v | head -2
git log -1 --oneline

echo "== git fetch / reset =="
git config --global --add safe.directory "$APP" || true
git fetch origin
git reset --hard origin/main
git log -1 --oneline
chown -R nodejs:nodejs "$APP"

echo "== build =="
sudo -u nodejs -H bash -c "cd $APP && rm -rf .next && npm ci && NODE_OPTIONS=--max-old-space-size=1536 npm run build"
echo "build exit: $?"

echo "== pm2 =="
sudo -u nodejs pm2 restart investdemidov --update-env
sudo -u nodejs pm2 save

echo "== проверка HTTP =="
sleep 2
curl -sI "http://127.0.0.1:${PORT}/" | head -5
echo "invest markers: $(curl -sL "http://127.0.0.1:${PORT}/" | grep -oE 'Инвестируйте|пул инвесторов|Демидов Парк' | sort | uniq -c | tr '\n' ' ')"
echo "done. Коммит на сервере: $(git log -1 --oneline)"
echo "Проверь https://${EXPECTED_HOST}/"
