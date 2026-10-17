# Демидов Парк — инвестиции

Инвест-лендинг: [invest.demidovpark.ru](https://invest.demidovpark.ru).  
Сестра проката: [demidovpark.ru](https://demidovpark.ru). План — [`ROADMAP.md`](./ROADMAP.md).

## Стек

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4.

## Локально

```bash
npm ci
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Env — `.env.local` (шаблон `.env.example`).

## Beget (прод)

| | |
|---|---|
| Папка | `/var/www/investdemidov` |
| Порт | `3005` |
| PM2 | `investdemidov` |
| Домен | `invest.demidovpark.ru` |
| Nginx | `deploy/nginx-invest.conf` |
| Обновление | `scripts/deploy-on-server.sh` (от root) |

Команды первого переноса и обновления — в скилле `.agents/skills/beget-deploy/SKILL.md`.
