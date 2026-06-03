-- Jerk Vest analytics.
-- Public clients may INSERT events with the anon key (RLS, insert-only).
-- Reading is done ONLY through the analytics_summary() function below, called
-- server-side by the edge function with the service role — never by the anon
-- key. This keeps raw visitor data private while page hits stay easy to log.

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

-- Insert-only for the public roles. No select/update/delete policies exist, so
-- the anon key cannot read anything back.
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

-- Aggregated summary for the /admin dashboard. SECURITY DEFINER so it can read
-- the table, but execute is granted ONLY to service_role (the edge function).
create or replace function public.analytics_summary()
returns jsonb
language sql
security definer
set search_path = public
as $$
  with ev as (select * from analytics_events),
  totals as (
    select
      (select count(*) from ev)                                         as events,
      (select count(*) from ev where event_type = 'page_view')          as page_views,
      (select count(distinct session_id) from ev)                       as sessions,
      (select count(*) from ev where event_type = 'outbound_click')     as outbound
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
  );
$$;

revoke all on function public.analytics_summary() from public, anon, authenticated;
grant execute on function public.analytics_summary() to service_role;
