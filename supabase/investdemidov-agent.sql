-- ИИ-агент Invest Demidov: настройки + история чатов
-- Выполнить в SQL Editor (после investdemidov.sql). Префикс InvestDemidov_.

create table if not exists "InvestDemidov_agent_settings" (
  id integer primary key check (id = 1),
  system_prompt text not null,
  model text not null,
  memory_limit integer not null default 20,
  updated_at timestamptz not null default now()
);

create table if not exists "InvestDemidov_chat_messages" (
  id uuid primary key default gen_random_uuid(),
  chat_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists investdemidov_chat_messages_chat_created_idx
  on "InvestDemidov_chat_messages" (chat_id, created_at);

alter table "InvestDemidov_agent_settings" enable row level security;
alter table "InvestDemidov_chat_messages" enable row level security;

revoke all on table "InvestDemidov_agent_settings" from anon, authenticated;
revoke all on table "InvestDemidov_chat_messages" from anon, authenticated;

grant all on table "InvestDemidov_agent_settings" to service_role;
grant all on table "InvestDemidov_chat_messages" to service_role;
