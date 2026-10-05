begin;

create table if not exists public.public_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('session', 'fact_check', 'support')),
  name text check (name is null or char_length(name) between 1 and 120),
  email text check (email is null or (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  phone text check (phone is null or phone ~ '^\+?[0-9]{7,15}$'),
  details jsonb not null check (jsonb_typeof(details) = 'object' and octet_length(details::text) <= 49152),
  search_text text generated always as (
    coalesce(name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(phone, '') || ' ' ||
    coalesce(details->>'college', '') || ' ' || coalesce(details->>'district', '') || ' ' || coalesce(details->>'content', '')
  ) stored,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'archived')),
  assigned_to uuid references public.profiles(id) on delete set null,
  admin_notes text not null default '' check (char_length(admin_notes) <= 5000),
  notification_status text not null default 'disabled' check (notification_status in ('disabled', 'pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  check (email is not null or phone is not null),
  check (kind <> 'session' or (name is not null and email is not null and phone is not null)),
  check (kind <> 'fact_check' or email is not null)
);

create index if not exists public_requests_queue_idx on public.public_requests (status, created_at desc);
create index if not exists public_requests_kind_idx on public.public_requests (kind, created_at desc);

create table if not exists public.guide_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254 and email = lower(btrim(email)) and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  status text not null default 'subscribed' check (status in ('subscribed', 'notified', 'archived')),
  notification_status text not null default 'disabled' check (notification_status in ('disabled', 'pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists guide_subscribers_created_idx on public.guide_subscribers (created_at desc);

create table if not exists public.public_form_rate_limits (
  fingerprint text primary key check (fingerprint ~ '^[a-f0-9]{64}$'),
  window_started timestamptz not null default now(),
  attempt_count integer not null default 1 check (attempt_count between 1 and 11)
);

create index if not exists public_form_rate_limits_window_idx on public.public_form_rate_limits (window_started);

alter table public.public_requests enable row level security;
alter table public.guide_subscribers enable row level security;
alter table public.public_form_rate_limits enable row level security;

revoke all on public.public_requests, public.guide_subscribers, public.public_form_rate_limits from public, anon, authenticated;
grant all on public.public_requests, public.guide_subscribers, public.public_form_rate_limits to service_role;
grant select on public.public_requests, public.guide_subscribers to authenticated;
grant update (status, assigned_to, admin_notes) on public.public_requests to authenticated;
grant update (status) on public.guide_subscribers to authenticated;

create policy "public_requests: admin read" on public.public_requests
  for select to authenticated using (public.is_admin());
create policy "public_requests: admin update" on public.public_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "guide_subscribers: admin read" on public.guide_subscribers
  for select to authenticated using (public.is_admin());
create policy "guide_subscribers: admin update" on public.guide_subscribers
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_public_form_record()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create trigger trg_touch_public_request before update of status, assigned_to, admin_notes on public.public_requests
  for each row execute function public.touch_public_form_record();
create trigger trg_touch_guide_subscriber before update of status on public.guide_subscribers
  for each row execute function public.touch_public_form_record();

create or replace function public.validate_public_request_assignee()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.assigned_to is not null and not exists (
    select 1 from public.profiles where id = new.assigned_to and role = 'admin'
  ) then
    raise exception 'Assignee must be an administrator' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger trg_validate_public_request_assignee before insert or update of assigned_to on public.public_requests
  for each row execute function public.validate_public_request_assignee();

create or replace function public.consume_public_form_rate_limit(p_fingerprint text)
returns boolean language plpgsql set search_path = '' as $$
declare
  attempts integer;
begin
  delete from public.public_form_rate_limits where window_started < now() - interval '1 day';
  insert into public.public_form_rate_limits as limits (fingerprint, window_started, attempt_count)
  values (p_fingerprint, now(), 1)
  on conflict (fingerprint) do update set
    window_started = case when limits.window_started <= now() - interval '15 minutes' then now() else limits.window_started end,
    attempt_count = case when limits.window_started <= now() - interval '15 minutes' then 1 else least(limits.attempt_count + 1, 11) end
  returning attempt_count into attempts;
  return attempts <= 10;
end;
$$;

revoke all on function public.consume_public_form_rate_limit(text) from public, anon, authenticated;
grant execute on function public.consume_public_form_rate_limit(text) to service_role;

commit;