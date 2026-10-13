-- Mission evidence may contain student names, chats, or abuse/scam screenshots.
-- Keep objects private and authorize access through storage RLS + signed URLs.

update storage.buckets
set public = false,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
where id = 'mission-screenshots';

drop policy if exists "Allow public uploads to mission-screenshots" on storage.objects;
drop policy if exists "Allow public access to mission-screenshots" on storage.objects;
drop policy if exists "mission evidence: authenticated upload" on storage.objects;
drop policy if exists "mission evidence: owner or admin read" on storage.objects;
drop policy if exists "mission evidence: owner or admin delete" on storage.objects;

create policy "mission evidence: authenticated upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'mission-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "mission evidence: owner or admin read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'mission-screenshots'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "mission evidence: owner or admin delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'mission-screenshots'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

drop policy if exists "Allow public inserts" on public.submissions;
drop policy if exists "submissions: authenticated insert own evidence" on public.submissions;

create policy "submissions: authenticated insert own evidence"
  on public.submissions for insert to authenticated
  with check (
    auth.uid() = user_id
    and lower(student_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and unique_id = (
      select profiles.unique_id
      from public.profiles
      where profiles.id = auth.uid()
    )
    and cardinality(screenshot_urls) between 1 and 10
    and not exists (
      select 1
      from unnest(screenshot_urls) as evidence_path
      where split_part(evidence_path, '/', 1) <> auth.uid()::text
    )
  );

comment on column public.submissions.screenshot_urls is
  'Private mission-screenshots object paths. Resolve to short-lived signed URLs only after owner/admin authorization.';