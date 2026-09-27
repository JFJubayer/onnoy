-- ============================================================================
-- Onnoy — migration 005: retire the Flask backend
--   * impact_stats       (public read, admin write)  ← replaces backend/data/impact.json
--   * download_leads     (public insert, admin read) ← replaces backend/data/downloads.json
--   * is_admin() helper + role-escalation guard on profiles
--   * tighten profiles read policy (emails were world-readable)
-- Run in the Supabase SQL editor after the earlier supabase_*.sql files.
-- ============================================================================

-- ---------- helper --------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ---------- profiles hardening --------------------------------------------
-- Users may update their own row, but never promote themselves.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Replace world-readable profiles with: own row, or admin.
drop policy if exists "Allow public read access" on public.profiles;
drop policy if exists "Profiles: read own or admin" on public.profiles;
create policy "Profiles: read own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Public badge verification without exposing emails.
create or replace function public.verify_badge(p_unique_id text)
returns table (unique_id text, full_name text, school_name text, badges text[], status text)
language sql
stable
security definer
set search_path = public
as $$
  select p.unique_id, p.full_name, p.school_name, p.badges, p.status
  from public.profiles p
  where upper(p.unique_id) = upper(trim(p_unique_id))
  limit 1;
$$;
grant execute on function public.verify_badge(text) to anon, authenticated;

-- ---------- impact_stats ----------------------------------------------------
create table if not exists public.impact_stats (
  id            smallint primary key default 1 check (id = 1),
  sessions      integer not null default 0,
  students      integer not null default 0,
  citizens      integer not null default 0,
  guardians     integer not null default 0,
  last_updated  text    not null default to_char(now(), 'FMMonth YYYY'),
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id)
);

insert into public.impact_stats (id, sessions, students, citizens, guardians, last_updated)
values (1, 6, 180, 40, 10, 'June 2026')
on conflict (id) do nothing;

alter table public.impact_stats enable row level security;

drop policy if exists "impact_stats: public read" on public.impact_stats;
create policy "impact_stats: public read"
  on public.impact_stats for select using (true);

drop policy if exists "impact_stats: admin update" on public.impact_stats;
create policy "impact_stats: admin update"
  on public.impact_stats for update
  using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_impact_stats()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end; $$;
drop trigger if exists trg_touch_impact_stats on public.impact_stats;
create trigger trg_touch_impact_stats before update on public.impact_stats
  for each row execute function public.touch_impact_stats();

-- ---------- download_leads --------------------------------------------------
create table if not exists public.download_leads (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(name) between 1 and 120),
  email          text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  age_group      text,
  booklet        text not null,
  booklet_url    text,
  regular_price  text,
  price_charged  text default '৳0',
  source         text default 'web',
  user_id        uuid references auth.users(id),
  created_at     timestamptz not null default now()
);
create index if not exists download_leads_created_idx on public.download_leads (created_at desc);
create index if not exists download_leads_email_idx on public.download_leads (lower(email));

alter table public.download_leads enable row level security;

drop policy if exists "download_leads: anyone can insert" on public.download_leads;
create policy "download_leads: anyone can insert"
  on public.download_leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "download_leads: admin read" on public.download_leads;
create policy "download_leads: admin read"
  on public.download_leads for select using (public.is_admin());

drop policy if exists "download_leads: admin delete" on public.download_leads;
create policy "download_leads: admin delete"
  on public.download_leads for delete using (public.is_admin());

-- Aggregate for the admin dashboard.
create or replace function public.download_stats()
returns table (booklet text, downloads bigint, last_download timestamptz)
language sql stable security definer set search_path = public as $$
  select booklet, count(*) as downloads, max(created_at) as last_download
  from public.download_leads
  where public.is_admin()
  group by booklet order by downloads desc;
$$;
grant execute on function public.download_stats() to authenticated;
