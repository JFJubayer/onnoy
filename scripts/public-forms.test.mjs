import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { PGlite } from '@electric-sql/pglite';

const source = readFileSync(new URL('../supabase/functions/_shared/public-forms.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { FormValidationError, parsePublicForm, createPublicFormsHandler } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const requestId = '11111111-1111-4111-8111-111111111111';
const session = {
  name: ' Test Teacher ', designation: 'Teacher', phone: '+880 1700-000000',
  email: 'TEACHER@example.com', college: 'Test College', district: 'Mymensingh',
  students: '30\u201360', date: '2026-11-01', notes: 'A classroom session',
};
const factCheck = { email: 'reader@example.com', source: 'WhatsApp', content: 'Please check this claim.', link: 'https://example.com/post' };
const support = { contact: '01700000000', issue: 'Other', content: 'Please contact me.' };

function submit(kind, fields, extras = {}) {
  return parsePublicForm({ kind, fields, request_id: requestId, website: '', ...extras });
}

function rejects(kind, fields, code, field) {
  assert.throws(() => submit(kind, fields), (error) => error instanceof FormValidationError && error.code === code && error.field === field);
}

test('session preserves all required fields and normalizes contact details', () => {
  const result = submit('session', session);
  assert.equal(result.name, 'Test Teacher');
  assert.equal(result.email, 'teacher@example.com');
  assert.equal(result.phone, '+8801700000000');
  assert.deepEqual(result.details, { designation: 'Teacher', college: 'Test College', district: 'Mymensingh', students: '30\u201360', date: '2026-11-01', notes: 'A classroom session' });
});

test('fact-check name and source link remain optional', () => {
  const result = submit('fact_check', { ...factCheck, link: '' });
  assert.equal(result.name, null);
  assert.equal(result.phone, null);
  assert.equal(result.details.link, '');
});

test('support accepts an unnamed sender and either phone or email', () => {
  const phone = submit('support', support);
  const email = submit('support', { ...support, contact: 'Sender@Example.com' });
  assert.equal(phone.name, null);
  assert.equal(phone.phone, '01700000000');
  assert.equal(phone.email, null);
  assert.equal(email.email, 'sender@example.com');
  assert.equal(email.phone, null);
});

test('support accepts Bangla phone digits', () => {
  const result = submit('support', { ...support, contact: '\u09e6\u09e7\u09ed\u09e6\u09e6\u09e6\u09e6\u09e6\u09e6\u09e6\u09e6' });
  assert.equal(result.phone, '01700000000');
});

test('guide signups only store the normalized email', () => {
  const result = submit('guide', { email: ' Reader@Example.com ', name: 'ignored', status: 'notified' });
  assert.equal(result.kind, 'guide');
  assert.equal(result.email, 'reader@example.com');
  assert.equal(result.name, null);
  assert.deepEqual(result.details, {});
});

test('server-owned fields cannot be supplied by public forms', () => {
  const result = submit('support', { ...support, status: 'resolved', admin_notes: 'overwrite', assigned_to: requestId }, { status: 'resolved' });
  assert.equal(Object.hasOwn(result, 'status'), false);
  assert.equal(Object.hasOwn(result.details, 'admin_notes'), false);
  assert.equal(Object.hasOwn(result.details, 'assigned_to'), false);
});

test('required fields are validated after trimming', () => {
  rejects('session', { ...session, name: '   ' }, 'required', 'name');
  rejects('fact_check', { ...factCheck, content: '\n ' }, 'required', 'content');
  rejects('support', { ...support, contact: '' }, 'required', 'contact');
});

test('contacts and enum values are validated on the server', () => {
  rejects('guide', { email: 'not-an-email' }, 'invalid_email', 'email');
  rejects('support', { ...support, contact: 'call me' }, 'invalid_phone', 'contact');
  rejects('fact_check', { ...factCheck, source: 'unknown' }, 'invalid_option', 'source');
  rejects('session', { ...session, students: '10000' }, 'invalid_option', 'students');
});

test('impossible dates are rejected but valid leap days work', () => {
  rejects('session', { ...session, date: '2025-02-29' }, 'invalid_date', 'date');
  rejects('session', { ...session, date: '2026-13-01' }, 'invalid_date', 'date');
  assert.equal(submit('session', { ...session, date: '2028-02-29' }).details.date, '2028-02-29');
});

test('source URLs only accept HTTP and HTTPS', () => {
  rejects('fact_check', { ...factCheck, link: 'javascript:alert(1)' }, 'invalid_url', 'link');
  rejects('fact_check', { ...factCheck, link: 'file:///tmp/private' }, 'invalid_url', 'link');
});

test('length limits, non-string fields, and honeypots are enforced', () => {
  rejects('support', { ...support, content: 'x'.repeat(6001) }, 'too_long', 'content');
  rejects('guide', { email: ['reader@example.com'] }, 'invalid', 'email');
  assert.throws(() => submit('guide', { email: 'reader@example.com' }, { website: 'spam' }), { code: 'spam' });
});

test('invalid kinds and idempotency keys are rejected', () => {
  assert.throws(() => submit('admin', {}), { code: 'invalid' });
  assert.throws(() => submit('guide', { email: 'reader@example.com' }, { request_id: 'not-a-uuid' }), { code: 'invalid', field: 'request_id' });
  assert.throws(() => parsePublicForm(null), { code: 'invalid' });
});

function endpoint(overrides = {}) {
  const saved = [];
  const errors = [];
  const handler = createPublicFormsHandler({
    origins: ['https://onnoy.test'],
    consumeRateLimit: async () => true,
    save: async (submission) => { saved.push(submission); return { created: true }; },
    reportError: (stage) => errors.push(stage),
    ...overrides,
  });
  return { handler, saved, errors };
}

function request(kind = 'support', fields = support, extras = {}) {
  return new Request('https://functions.test/public-forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://onnoy.test' },
    body: JSON.stringify({ kind, fields, request_id: requestId, ...extras }),
  });
}

test('endpoint saves valid submissions and returns only a receipt', async () => {
  const { handler, saved } = endpoint();
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://onnoy.test');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { ok: true, reference: requestId });
  assert.equal(saved.length, 1);
});

test('rejected origins and unsupported methods cannot write records', async () => {
  const { handler, saved } = endpoint();
  const invalidOrigin = new Request(request(), { headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.test' } });
  assert.equal((await handler(invalidOrigin)).status, 403);
  assert.equal((await handler(new Request('https://functions.test/public-forms'))).status, 405);
  assert.equal(saved.length, 0);
});

test('preflight works without reading or storing a request', async () => {
  const { handler, saved } = endpoint();
  const response = await handler(new Request('https://functions.test/public-forms', { method: 'OPTIONS', headers: { Origin: 'https://onnoy.test' } }));
  assert.equal(response.status, 204);
  assert.equal(saved.length, 0);
});

test('server validation rejects invalid input before storage', async () => {
  const { handler, saved } = endpoint();
  const response = await handler(request('guide', { email: 'invalid' }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: 'validation', code: 'invalid_email', field: 'email' });
  assert.equal(saved.length, 0);
});

test('rate limiting and failed CAPTCHA checks prevent storage', async () => {
  const limited = endpoint({ consumeRateLimit: async () => false });
  const response = await limited.handler(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '900');
  assert.equal(limited.saved.length, 0);
  const captcha = endpoint({ verifyCaptcha: async () => false });
  assert.equal((await captcha.handler(request())).status, 400);
  assert.equal(captcha.saved.length, 0);
});

test('storage failures never return success or expose internal errors', async () => {
  const { handler, errors } = endpoint({ save: async () => { throw new Error('private database details'); } });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: 'unavailable' });
  assert.deepEqual(errors, ['submission']);
});

test('email failures do not lose or reject a saved request', async () => {
  const { handler, saved, errors } = endpoint({ notify: async () => { throw new Error('email unavailable'); } });
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal(saved.length, 1);
  assert.deepEqual(errors, ['notification']);
});

test('idempotent retries do not send duplicate alerts', async () => {
  let alerts = 0;
  const { handler } = endpoint({ save: async () => ({ created: false }), notify: async () => { alerts += 1; } });
  assert.equal((await handler(request())).status, 201);
  assert.equal(alerts, 0);
});

test('native forms work without JavaScript and redirect to an allowed site', async () => {
  const { handler, saved } = endpoint();
  const response = await handler(new Request('https://functions.test/public-forms', {
    method: 'POST', headers: { Origin: 'https://onnoy.test' },
    body: new URLSearchParams({ kind: 'guide', email: 'reader@example.com', website: '' }),
  }));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), 'https://onnoy.test/facilitator-guide#request-received');
  assert.equal(saved[0].kind, 'guide');
});

test('oversized and malformed requests are rejected without storage', async () => {
  const { handler, saved } = endpoint();
  const body = new Request('https://functions.test/public-forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'x'.repeat(50000) });
  assert.equal((await handler(body)).status, 413);
  assert.equal((await handler(new Request('https://functions.test/public-forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal(saved.length, 0);
});

test('migration enforces private reads, bounded admin updates, deduplication, and rate limits', async () => {
  const database = new PGlite();
  const adminId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const userId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  try {
    await database.exec(`
      create role anon;
      create role authenticated;
      create role service_role bypassrls;
      create schema auth;
      create table auth.users (id uuid primary key);
      create table public.profiles (id uuid primary key, role text);
      insert into auth.users values ('${adminId}'), ('${userId}');
      insert into public.profiles values ('${adminId}', 'admin'), ('${userId}', 'user');
      grant usage on schema auth to anon, authenticated, service_role;
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;
      create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
        select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
      $$;
    `);
    await database.exec(readFileSync(new URL('../supabase/migrations/007_public_forms.sql', import.meta.url), 'utf8'));

    const asRole = (role, user, sql, parameters = []) => database.transaction(async (transaction) => {
      await transaction.exec(`set local role ${role}`);
      await transaction.query("select set_config('request.jwt.claim.sub', $1, true)", [user]);
      return transaction.query(sql, parameters);
    });
    const insertRequest = "insert into public.public_requests (id, kind, email, details) values ($1, 'support', 'private@example.com', '{\"issue\":\"Other\",\"content\":\"Private test\"}')";
    await asRole('service_role', '', insertRequest, [requestId]);
    await asRole('service_role', '', "insert into public.guide_subscribers (email) values ('subscriber@example.com')");

    await assert.rejects(asRole('anon', '', 'select * from public.public_requests'), { code: '42501' });
    await assert.rejects(asRole('anon', '', 'select * from public.guide_subscribers'), { code: '42501' });
    await assert.rejects(asRole('anon', '', insertRequest, [crypto.randomUUID()]), { code: '42501' });
    await assert.rejects(asRole('authenticated', userId, insertRequest, [crypto.randomUUID()]), { code: '42501' });
    assert.equal((await asRole('authenticated', userId, 'select * from public.public_requests')).rows.length, 0);
    assert.equal((await asRole('authenticated', userId, 'select * from public.guide_subscribers')).rows.length, 0);
    assert.equal((await asRole('authenticated', adminId, 'select * from public.public_requests')).rows.length, 1);
    assert.equal((await asRole('authenticated', adminId, 'select * from public.guide_subscribers')).rows.length, 1);
    assert.equal((await asRole('authenticated', adminId, "select id from public.public_requests where search_text ilike '%PRIVATE%'")).rows.length, 1);

    const updated = await asRole('authenticated', adminId,
      "update public.public_requests set status = 'in_progress', admin_notes = 'Reviewed' where id = $1 returning status, updated_by", [requestId]);
    assert.deepEqual(updated.rows[0], { status: 'in_progress', updated_by: adminId });
    assert.equal((await asRole('authenticated', userId,
      "update public.public_requests set status = 'resolved' where id = $1 returning id", [requestId])).rows.length, 0);
    assert.equal((await asRole('service_role', '', 'select status from public.public_requests where id = $1', [requestId])).rows[0].status, 'in_progress');
    assert.equal((await asRole('authenticated', adminId, 'update public.public_requests set assigned_to = $1 where id = $2 returning assigned_to', [adminId, requestId])).rows[0].assigned_to, adminId);
    await assert.rejects(asRole('authenticated', adminId, 'update public.public_requests set assigned_to = $1 where id = $2', [userId, requestId]), { code: '23514' });
    await assert.rejects(asRole('authenticated', adminId, "update public.public_requests set email = 'overwrite@example.com' where id = $1", [requestId]), { code: '42501' });
    await assert.rejects(asRole('authenticated', adminId, "update public.public_requests set notification_status = 'sent' where id = $1", [requestId]), { code: '42501' });
    await assert.rejects(asRole('authenticated', adminId, 'delete from public.public_requests where id = $1', [requestId]), { code: '42501' });

    const duplicate = await asRole('service_role', '', `${insertRequest} on conflict (id) do nothing returning id`, [requestId]);
    assert.equal(duplicate.rows.length, 0);
    assert.equal((await asRole('service_role', '', 'select status from public.public_requests where id = $1', [requestId])).rows[0].status, 'in_progress');
    assert.equal((await asRole('service_role', '', "insert into public.guide_subscribers (email) values ('subscriber@example.com') on conflict (email) do nothing returning id")).rows.length, 0);
    const notified = await asRole('authenticated', adminId, "update public.guide_subscribers set status = 'notified' returning updated_by");
    assert.equal(notified.rows[0].updated_by, adminId);

    const fingerprint = 'a'.repeat(64);
    const rateQuery = 'select public.consume_public_form_rate_limit($1) as allowed';
    for (let attempt = 0; attempt < 10; attempt += 1) {
      assert.equal((await asRole('service_role', '', rateQuery, [fingerprint])).rows[0].allowed, true);
    }
    assert.equal((await asRole('service_role', '', rateQuery, [fingerprint])).rows[0].allowed, false);
    await assert.rejects(asRole('anon', '', rateQuery, [fingerprint]), { code: '42501' });
    await assert.rejects(asRole('authenticated', adminId, rateQuery, [fingerprint]), { code: '42501' });
    await assert.rejects(asRole('authenticated', adminId, 'select * from public.public_form_rate_limits'), { code: '42501' });
    await asRole('service_role', '', "update public.public_form_rate_limits set window_started = now() - interval '16 minutes'");
    assert.equal((await asRole('service_role', '', rateQuery, [fingerprint])).rows[0].allowed, true);
  } finally {
    await database.close();
  }
});