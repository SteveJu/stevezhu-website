create table if not exists public.build_studio_inquiries (
  id uuid primary key,
  name text not null default '',
  contact_methods text not null default '',
  product_format text not null default '',
  platforms text not null default '',
  timeline text not null default '',
  description text not null,
  feature_scope text not null default '',
  audience_size_dau text not null default '',
  audience_size_mau text not null default '',
  monthly_spend text not null default '',
  max_budget text not null default '',
  reference_links text not null default '',
  status text not null default 'new',
  owner_notes text not null default '',
  quoted_price text not null default '',
  estimated_monthly_cost text not null default '',
  estimated_hours text not null default '',
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.build_studio_inquiries add column if not exists contact_methods text not null default '';
alter table public.build_studio_inquiries add column if not exists product_format text not null default '';
alter table public.build_studio_inquiries add column if not exists platforms text not null default '';
alter table public.build_studio_inquiries add column if not exists feature_scope text not null default '';
alter table public.build_studio_inquiries add column if not exists audience_size_dau text not null default '';
alter table public.build_studio_inquiries add column if not exists audience_size_mau text not null default '';
alter table public.build_studio_inquiries add column if not exists monthly_spend text not null default '';
alter table public.build_studio_inquiries add column if not exists max_budget text not null default '';
alter table public.build_studio_inquiries add column if not exists owner_notes text not null default '';
alter table public.build_studio_inquiries add column if not exists quoted_price text not null default '';
alter table public.build_studio_inquiries add column if not exists estimated_monthly_cost text not null default '';
alter table public.build_studio_inquiries add column if not exists estimated_hours text not null default '';
alter table public.build_studio_inquiries add column if not exists priority text not null default 'normal';

drop trigger if exists set_build_studio_inquiries_updated_at on public.build_studio_inquiries;

create trigger set_build_studio_inquiries_updated_at
before update on public.build_studio_inquiries
for each row
execute function public.set_updated_at();

alter table public.build_studio_inquiries enable row level security;
