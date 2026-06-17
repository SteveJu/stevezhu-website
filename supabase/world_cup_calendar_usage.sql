create table if not exists public.world_cup_calendar_usage (
  subscriber_hash text primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  request_count integer not null default 1,
  user_agent_family text not null default '',
  last_path text not null default ''
);

create index if not exists world_cup_calendar_usage_last_seen_at_idx
on public.world_cup_calendar_usage (last_seen_at desc);

create or replace function public.record_world_cup_calendar_usage(
  p_subscriber_hash text,
  p_user_agent_family text default '',
  p_path text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_subscriber_hash is null or length(p_subscriber_hash) = 0 then
    return;
  end if;

  insert into public.world_cup_calendar_usage (
    subscriber_hash,
    user_agent_family,
    last_path
  )
  values (
    p_subscriber_hash,
    coalesce(p_user_agent_family, ''),
    coalesce(p_path, '')
  )
  on conflict (subscriber_hash) do update
  set
    last_seen_at = now(),
    request_count = public.world_cup_calendar_usage.request_count + 1,
    user_agent_family = excluded.user_agent_family,
    last_path = excluded.last_path;
end;
$$;

alter table public.world_cup_calendar_usage enable row level security;
