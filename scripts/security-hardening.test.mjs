import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const migration = readFileSync(new URL('../supabase/migrations/008_private_mission_evidence.sql', import.meta.url), 'utf8');
const uploader = readFileSync(new URL('../public/assets/js/module-course.js', import.meta.url), 'utf8');
const adminPortal = readFileSync(new URL('../src/pages/admin-portal.astro', import.meta.url), 'utf8');
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('mission uploader stores private owner paths and admin uses signed previews', () => {
  assert.match(uploader, /session\.user\.id.*crypto\.randomUUID/s);
  assert.match(uploader, /allowedTypes = new Map/);
  assert.match(uploader, /10 \* 1024 \* 1024/);
  assert.match(uploader, /screenshot_urls: evidencePaths/);
  assert.match(uploader, /storage\.from\('mission-screenshots'\)\.remove/s);
  assert.doesNotMatch(uploader, /getPublicUrl\(/);
  assert.doesNotMatch(uploader, /Falling back to Formspree submit/);
  assert.match(adminPortal, /createSignedUrl\(path, 600\)/);
  assert.match(adminPortal, /missionEvidencePath/);
});

test('deployment headers stage CSP safely and enforce HTTPS return visits', () => {
  const globalHeaders = vercel.headers.find(entry => entry.source === '/(.*)')?.headers ?? [];
  const headers = Object.fromEntries(globalHeaders.map(header => [header.key, header.value]));
  assert.match(headers['Strict-Transport-Security'], /max-age=31536000/);
  assert.match(headers['Content-Security-Policy-Report-Only'], /default-src 'self'/);
  assert.match(headers['Content-Security-Policy-Report-Only'], /object-src 'none'/);
  assert.equal(Object.hasOwn(headers, 'Content-Security-Policy'), false, 'report-only before enforcement');
});

test('migration enforces private owner/admin evidence access and bound submissions', async () => {
  const database = new PGlite();
  const adminId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const userId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const otherId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  try {
    await database.exec(`
      create role anon;
      create role authenticated;
      create schema auth;
      create schema storage;
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;
      create function auth.jwt() returns jsonb language sql stable as $$
        select jsonb_build_object('email', current_setting('request.jwt.claim.email', true));
      $$;
      create function storage.foldername(value text) returns text[] language sql immutable as $$
        select string_to_array(value, '/');
      $$;
      create table public.profiles (id uuid primary key, role text, unique_id text);
      insert into public.profiles values
        ('${adminId}', 'admin', 'ONNOY-ADMIN'),
        ('${userId}', 'user', 'ONNOY-USER'),
        ('${otherId}', 'user', 'ONNOY-OTHER');
      create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
        select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
      $$;
      create table storage.buckets (
        id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]
      );
      insert into storage.buckets values ('mission-screenshots', 'mission-screenshots', true, null, null);
      create table storage.objects (id uuid default gen_random_uuid() primary key, bucket_id text, name text);
      alter table storage.objects enable row level security;
      create policy "Allow public uploads to mission-screenshots" on storage.objects for insert with check (bucket_id = 'mission-screenshots');
      create policy "Allow public access to mission-screenshots" on storage.objects for select using (bucket_id = 'mission-screenshots');
      create table public.submissions (
        id uuid default gen_random_uuid() primary key,
        user_id uuid,
        unique_id text,
        student_email text,
        screenshot_urls text[]
      );
      alter table public.submissions enable row level security;
      create policy "Allow public inserts" on public.submissions for insert with check (true);
      grant usage on schema auth, storage to anon, authenticated;
      grant select on public.profiles to authenticated;
      grant select, insert, delete on storage.objects to anon, authenticated;
      grant select, insert on public.submissions to anon, authenticated;
    `);
    await database.exec(migration);

    const asRole = (role, user, email, sql, parameters = []) => database.transaction(async transaction => {
      await transaction.exec(`set local role ${role}`);
      await transaction.query("select set_config('request.jwt.claim.sub', $1, true)", [user]);
      await transaction.query("select set_config('request.jwt.claim.email', $1, true)", [email]);
      return transaction.query(sql, parameters);
    });

    const bucket = (await database.query("select public, file_size_limit, allowed_mime_types from storage.buckets where id = 'mission-screenshots'")).rows[0];
    assert.equal(bucket.public, false);
    assert.equal(Number(bucket.file_size_limit), 10485760);
    assert.deepEqual(bucket.allowed_mime_types, ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

    await assert.rejects(asRole('anon', '', '', "insert into storage.objects (bucket_id, name) values ('mission-screenshots', 'public/file.png')"), { code: '42501' });
    await asRole('authenticated', userId, 'user@example.com', "insert into storage.objects (bucket_id, name) values ('mission-screenshots', $1)", [`${userId}/evidence.png`]);
    await assert.rejects(asRole('authenticated', userId, 'user@example.com', "insert into storage.objects (bucket_id, name) values ('mission-screenshots', $1)", [`${otherId}/evidence.png`]), { code: '42501' });
    assert.equal((await asRole('authenticated', userId, 'user@example.com', 'select name from storage.objects')).rows.length, 1);
    assert.equal((await asRole('authenticated', otherId, 'other@example.com', 'select name from storage.objects')).rows.length, 0);

    await database.query("insert into storage.objects (bucket_id, name) values ('mission-screenshots', 'ONNOY-LEGACY/old.png')");
    assert.equal((await asRole('authenticated', adminId, 'admin@example.com', 'select name from storage.objects')).rows.length, 2);

    const insert = 'insert into public.submissions (user_id, unique_id, student_email, screenshot_urls) values ($1, $2, $3, $4)';
    await asRole('authenticated', userId, 'user@example.com', insert, [userId, 'ONNOY-USER', 'user@example.com', [`${userId}/evidence.png`]]);
    await assert.rejects(asRole('authenticated', userId, 'user@example.com', insert, [userId, 'ONNOY-OTHER', 'user@example.com', [`${userId}/evidence.png`]]), { code: '42501' });
    await assert.rejects(asRole('authenticated', userId, 'user@example.com', insert, [userId, 'ONNOY-USER', 'wrong@example.com', [`${userId}/evidence.png`]]), { code: '42501' });
    await assert.rejects(asRole('authenticated', userId, 'user@example.com', insert, [userId, 'ONNOY-USER', 'user@example.com', [`${otherId}/evidence.png`]]), { code: '42501' });
  } finally {
    await database.close();
  }
});