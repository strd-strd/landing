-- Paste NOW в SQL Editor (уже созданные InvestDemidov_* таблицы).
-- Не пересоздаёт таблицы. Безопасно запускать повторно.
--
-- Это НЕ чинит ошибку RLS, если в .env стоит anon/publishable вместо service_role:
-- service_role обходит RLS; publishable — нет → «violates row-level security policy».
-- Сначала: Dashboard → Project Settings → API → скопировать service_role (secret)
-- в SUPABASE_SERVICE_ROLE_KEY на Beget, затем pm2 restart investdemidov.
--
-- GRANT ниже — как в Proekt1: явные права service_role + закрыть anon/authenticated.

alter table if exists "InvestDemidov_logs" enable row level security;
alter table if exists "InvestDemidov_bot_users" enable row level security;
alter table if exists "InvestDemidov_bot_user_segments" enable row level security;
alter table if exists "InvestDemidov_bot_events" enable row level security;
alter table if exists "InvestDemidov_leads" enable row level security;

revoke all on table "InvestDemidov_logs" from anon, authenticated;
revoke all on table "InvestDemidov_bot_users" from anon, authenticated;
revoke all on table "InvestDemidov_bot_user_segments" from anon, authenticated;
revoke all on table "InvestDemidov_bot_events" from anon, authenticated;
revoke all on table "InvestDemidov_leads" from anon, authenticated;

grant all on table "InvestDemidov_logs" to service_role;
grant all on table "InvestDemidov_bot_users" to service_role;
grant all on table "InvestDemidov_bot_user_segments" to service_role;
grant all on table "InvestDemidov_bot_events" to service_role;
grant all on table "InvestDemidov_leads" to service_role;
