create table if not exists public.photography_state (
  id text primary key,
  payload jsonb not null default '{"albums":[],"photos":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_photography_state_updated_at on public.photography_state;

create trigger set_photography_state_updated_at
before update on public.photography_state
for each row
execute function public.set_updated_at();

alter table public.photography_state enable row level security;
