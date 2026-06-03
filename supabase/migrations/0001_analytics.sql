-- Jerk Vest analytics.
--
-- Writes:  public clients INSERT events with the anon key (RLS, insert-only).
-- Reads:   the /admin dashboard calls analytics_summary(p_token) with the anon
--          key. The function is SECURITY DEFINER and verifies the token against
--          a value kept in the `private` schema (never exposed over the API).
--          Wrong/empty token -> {"error":"unauthorized"} and no data leaks.
--
-- The admin token itself is NOT in this file (so it is never committed). It is
-- written once after provisioning:
--   insert into private.config(key, value) values ('admin_token', '<token>');

create table if not exists public.analytics_events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  event_type  text not null,
  path        text,
  label       text,
  session_id  text,
  referrer    text,
  user_agent  text,
  platform    text,
  meta        jsonb
);

alter table public.analytics_events enable row level security;

-- Insert-only for the public roles. No select policy exists, so the anon key
-- can never read rows back directly.
drop policy if exists "public can insert events" on public.analytics_events;
create policy "public can insert events"
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_type_idx on public.analytics_events (event_type);
create index if not exists analytics_events_path_idx on public.analytics_events (path);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id);

-- Private config (admin token). Not in the API-exposed `public` schema.
create schema if not exists private;
create table if not exists private.config (
  key   text primary key,
  value text not null
);
revoke all on schema private from anon, authenticated;
revoke all on all tables in schema private from anon, authenticated;

-- Token-gated aggregated summary for /admin.
create or replace function public.analytics_summary(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_token text;
begin
  select value into v_token from private.config where key = 'admin_token';
  if v_token is null or p_token is null or p_token <> v_token then
    return jsonb_build_object('error', 'unauthorized');
  end if;

  return (
    with ev as (select * from analytics_events),
    totals as (
      select
        (select count(*) from ev)                                     as events,
        (select count(*) from ev where event_type = 'page_view')      as page_views,
        (select count(distinct session_id) from ev)                   as sessions,
        (select count(*) from ev where event_type = 'outbound_click') as outbound
    ),
    by_path as (
      select path, count(*) c
      from ev where event_type = 'page_view' and path is not null
      group by path order by c desc limit 20
    ),
    by_event as (
      select event_type, count(*) c
      from ev group by event_type order by c desc limit 20
    ),
    top_tiles as (
      select label, count(*) c
      from ev
      where event_type in ('menu_click', 'outbound_click') and label is not null
      group by label order by c desc limit 20
    ),
    daily as (
      select
        to_char(date_trunc('day', created_at), 'YYYY-MM-DD') d,
        count(*) filter (where event_type = 'page_view')     views,
        count(distinct session_id)                           sessions
      from ev
      where created_at > now() - interval '30 days'
      group by 1 order by 1
    ),
    recent as (
      select
        to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') created_at,
        event_type, path, label
      from ev order by created_at desc limit 50
    )
    select jsonb_build_object(
      'generatedAt', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'totals', (
        select jsonb_build_object(
          'events', events, 'pageViews', page_views,
          'sessions', sessions, 'outboundClicks', outbound
        ) from totals
      ),
      'byPath',   coalesce((select jsonb_agg(jsonb_build_object('path', path, 'views', c)) from by_path), '[]'::jsonb),
      'byEvent',  coalesce((select jsonb_agg(jsonb_build_object('event_type', event_type, 'count', c)) from by_event), '[]'::jsonb),
      'topTiles', coalesce((select jsonb_agg(jsonb_build_object('label', label, 'count', c)) from top_tiles), '[]'::jsonb),
      'daily',    coalesce((select jsonb_agg(jsonb_build_object('day', d, 'views', views, 'sessions', sessions)) from daily), '[]'::jsonb),
      'recent',   coalesce((select jsonb_agg(jsonb_build_object('created_at', created_at, 'event_type', event_type, 'path', path, 'label', label)) from recent), '[]'::jsonb)
    )
  );
end;
$$;

revoke all on function public.analytics_summary(text) from public;
grant execute on function public.analytics_summary(text) to anon, authenticated, service_role;
