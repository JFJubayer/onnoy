begin;

alter table public.download_leads
  add column if not exists school text check (school is null or char_length(btrim(school)) between 1 and 160),
  add column if not exists age integer check (age is null or age between 1 and 120),
  add column if not exists district text check (district is null or char_length(btrim(district)) between 1 and 80),
  add column if not exists access_mode text not null default 'download' check (access_mode in ('read', 'download'));

alter table public.download_leads alter column email drop not null;
alter table public.download_leads enable row level security;

drop policy if exists "download_leads: anyone can insert" on public.download_leads;
create policy "download_leads: anyone can insert"
  on public.download_leads for insert
  to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 120
    and char_length(btrim(school)) between 1 and 160
    and age between 1 and 120
    and char_length(btrim(district)) between 1 and 80
    and access_mode in ('read', 'download')
  );

commit;