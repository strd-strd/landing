<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Правила для агентов и людей, меняющих этот репозиторий. Читать перед правками. Не ломать существующий лендинг без явной задачи.

# Стек

- **Next.js 16** (App Router), **React 19**, **TypeScript** (`strict: true`)
- Стили: `app/globals.css` + **Tailwind CSS 4**
- Алиас: `@/*` → корень проекта
- Данные: JSON на диске в `data/` + **Supabase** (service role) для логов, заявок и событий бота
- SQL-схема: `supabase/investdemidov.sql` (префикс `InvestDemidov_`)

Процесс: `npm run dev` (только Next). Next сам читает `.env.local`.

# Карта кода

| Зона | Путь | Правило |
| --- | --- | --- |
| Веб UI | `app/page.tsx` | Лендинг. `"use client"` только где нужен браузер |
| API | `app/api/` | Валидация входа, без утечки секретов в ответ |
| Общая логика | `lib/` | Не копипастить по страницам |
| Стор FS | `lib/` + `data/` | Вся fs-работа только в сторе (`process.cwd()/data`) |
| Стор DB | `lib/supabase-admin.ts`, `leads-db`, `bot-events-db`, `app-log` | Только service role на сервере |

# Обязательно: логирование

Через `lib/app-log.ts`: **консоль + Supabase (`InvestDemidov_logs`) + алерт `ID_OPS` на error/critical**. Не плодить сырой `console.log` «для отладки».

1. **Сервер:** `logInfo` / `logWarn` / `logError` / `logCritical` (канал + сообщение + контекст). Не логировать успешный happy-path каждого запроса.
2. **Клиент:** не логировать. Ошибки — в UI (`error` / `status`).
3. **Никогда не логировать:** секреты из `.env.local`, полный системный промпт, полный текст переписки, сырой `request.json`, полный телефон/имя в контексте логов (длина телефона / `leadId` — ок; ПДн — только в `InvestDemidov_leads`).
4. Формат: префикс канала + сообщение + объект контекста (`logError("web", "…", { … })`).
5. Пользователю — короткое русское сообщение без стека. Детали только в лог / БД.
6. Пустой `catch` запрещён, кроме отсутствия файла в storage (нет файла).
7. Новый модуль с I/O (HTTP, FS, Supabase) — лог ошибок через app-log. Не тащить pino / winston без отдельной задачи.

# Секреты и env

Только `.env.local` (в gitignore). Опционально `.env.example` без значений.

Имена: `SITE_URL`, `TOKEN_TELEGRAM`, `LEAD_TELEGRAM_CHAT_ID`, `ID_ADMIN` (менеджеры / заявки), `ID_OPS` (разработчик / алерты), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Заявки → `LEAD` + `ID_ADMIN`, не в `ID_OPS`.

Не угадывать ключи. Ни ключа — ни в клиент, ни в git, ни в комментарии. `NEXT_PUBLIC_` для секретов запрещён. Anon/publishable Supabase в клиент не тащим.

# Контракты, которые нельзя молча ломать

- Пути данных только через стор в `lib/` (`process.cwd()/data`). Не писать в `.next/`.
- Без `any`. Типы рядом с использованием.
- Route handlers: 400 на плохой ввод, 502 на сбой бэкенда. Тело ошибки `{ error: string }` по-русски.
- Импорты: в `app/` — `@/lib/...`; внутри `lib/` — относительные.
- UI на русском. Не подключать UI-кит «заодно».
- Server Action: не передавать `FormData` на сервер (приходит `{}`).

# Как менять

- Минимальный diff. Не рефакторить соседние файлы.
- Общая логика — в `lib/`, не копипастить по каналам и страницам.
- Проверка правил: `npm run lint`.
- Не коммитить `.env*`, `.next/`.
- Не коммитить, пока пользователь не попросил.
- На порту 3000 — один `next dev`. Занятый порт не лечить вторым сервером на 3001.

# Скилы

Локальные скилы в `.agents/skills/` (как в Proekt1): `agent-browser`, `beget-deploy`, `finishing-a-development-branch`, `git-workflow-and-versioning`, `resolving-merge-conflicts`, `ui-ux-pro-max`, `vercel-composition-patterns`, `vercel-react-best-practices`, `web-design-guidelines`. Список и хеши — `skills-lock.json`.

Скил `beget-deploy` — деплой **этого** репо на Beget: `/var/www/investdemidov`, порт **3005**, PM2 `investdemidov`, домен `invest.demidovpark.ru`. Не путать с Proekt1 (`:3000`) и demidovpark (`:3004`).
