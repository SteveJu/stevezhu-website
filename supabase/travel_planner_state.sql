create table if not exists public.travel_planner_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_travel_planner_state_updated_at on public.travel_planner_state;

create trigger set_travel_planner_state_updated_at
before update on public.travel_planner_state
for each row
execute function public.set_updated_at();

alter table public.travel_planner_state enable row level security;
