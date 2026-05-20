create table if not exists public.build_studio_inquiries (
  id uuid primary key,
  name text not null,
  email text not null,
  project_type text not null default '',
  budget_range text not null default '',
  timeline text not null default '',
  needs_deployment boolean not null default false,
  description text not null,
  reference_links text not null default '',
  status text not null default 'new' check (status in ('new', 'estimating', 'accepted', 'declined', 'shipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_build_studio_inquiries_updated_at on public.build_studio_inquiries;

create trigger set_build_studio_inquiries_updated_at
before update on public.build_studio_inquiries
for each row
execute function public.set_updated_at();

alter table public.build_studio_inquiries enable row level security;
