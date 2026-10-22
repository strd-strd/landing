-- Invest Demidov: логи, заявки, бот/mini движения.
-- Префикс InvestDemidov_ — можно в том же проекте Supabase, что и DemidovPark_*.
-- Выполнить в SQL Editor (Dashboard → SQL → New query → Run).
-- После: в .env.local / на Beget — SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
-- Без wizard Next.js (ssr / middleware / NEXT_PUBLIC_ publishable).

-- ---------------------------------------------------------------------------
-- Логи сайта / будущего бота (console + DB; error/critical → алерт ID_OPS)
-- ---------------------------------------------------------------------------
create table if not exists "InvestDemidov_logs" (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  level text not null check (level in ('info', 'warn', 'error', 'critical')),
  channel text not null,
  message text not null,
  context jsonb not null default '{}'::jsonb,
  notified_ops boolean not null default false
);

create index if not exists investdemidov_logs_created_idx
  on "InvestDemidov_logs" (created_at desc);

create index if not exists investdemidov_logs_level_idx
  on "InvestDemidov_logs" (level);

create index if not exists investdemidov_logs_errors_idx
  on "InvestDemidov_logs" (created_at desc)
  where level in ('error', 'critical');

alter table "InvestDemidov_logs" enable row level security;

-- ---------------------------------------------------------------------------
-- Пользователи бота / Mini App
-- ---------------------------------------------------------------------------
create table if not exists "InvestDemidov_bot_users" (
  id uuid primary key default gen_random_uuid(),
  telegram_id text not null unique,
  username text,
  first_name text,
  last_name text,
  consented_at timestamptz,
  status text not null default 'active',
  broadcast_opt_out_at timestamptz,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists investdemidov_bot_users_status_idx
  on "InvestDemidov_bot_users" (status);

alter table "InvestDemidov_bot_users" enable row level security;

-- ---------------------------------------------------------------------------
-- Сегменты (один пользователь — несколько списков)
-- ---------------------------------------------------------------------------
create table if not exists "InvestDemidov_bot_user_segments" (
  telegram_id text not null
    references "InvestDemidov_bot_users" (telegram_id) on delete cascade,
  segment text not null,
  first_at timestamptz not null default now(),
  last_at timestamptz not null default now(),
  primary key (telegram_id, segment)
);

create index if not exists investdemidov_bot_user_segments_segment_idx
  on "InvestDemidov_bot_user_segments" (segment);

alter table "InvestDemidov_bot_user_segments" enable row level security;

-- ---------------------------------------------------------------------------
-- Журнал движений: /start, mini open, вопрос, заявка и т.п.
-- ---------------------------------------------------------------------------
create table if not exists "InvestDemidov_bot_events" (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  telegram_id text,
  meta jsonb not null default '{}'::jsonb
);

create index if not exists investdemidov_bot_events_created_idx
  on "InvestDemidov_bot_events" (created_at desc);

create index if not exists investdemidov_bot_events_type_idx
  on "InvestDemidov_bot_events" (event_type, created_at desc);

create index if not exists investdemidov_bot_events_tg_idx
  on "InvestDemidov_bot_events" (telegram_id, created_at desc);

alter table "InvestDemidov_bot_events" enable row level security;

-- ---------------------------------------------------------------------------
-- Заявки инвесторов + статус доставки в Telegram
-- ---------------------------------------------------------------------------
create table if not exists "InvestDemidov_leads" (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  telegram_id text,
  name text,
  phone text,
  title text,
  car text,
  year text,
  context text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  message_text text,
  deliver_status text not null default 'pending',
  delivered_at timestamptz,
  last_error text,
  retry_count integer not null default 0,
  created_at timestamptz not null default now(),
  constraint investdemidov_leads_deliver_status_check
    check (deliver_status in ('pending', 'delivered', 'failed'))
);

create index if not exists investdemidov_leads_created_idx
  on "InvestDemidov_leads" (created_at desc);

create index if not exists investdemidov_leads_deliver_status_idx
  on "InvestDemidov_leads" (deliver_status, created_at desc);

alter table "InvestDemidov_leads" enable row level security;

-- Доступ только через service role на сервере Next / будущего бота.
