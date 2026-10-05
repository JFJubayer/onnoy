export const publicFormKinds = ['session', 'fact_check', 'support', 'guide'] as const;
export type PublicFormKind = (typeof publicFormKinds)[number];
export type PublicRequestKind = Exclude<PublicFormKind, 'guide'>;
export type ValidationCode = 'invalid' | 'required' | 'too_long' | 'invalid_email' | 'invalid_phone' | 'invalid_date' | 'invalid_option' | 'invalid_url' | 'spam';

export class FormValidationError extends Error {
  code: ValidationCode;
  field: string;

  constructor(code: ValidationCode, field = '') {
    super(code);
    this.name = 'FormValidationError';
    this.code = code;
    this.field = field;
  }
}

export type PublicFormSubmission = {
  kind: PublicFormKind;
  requestId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  details: Record<string, string>;
  captchaToken: string;
};

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new FormValidationError('invalid');
  return value as Record<string, unknown>;
}

function stringField(fields: Record<string, unknown>, field: string, maximum: number, required = false): string {
  const value = fields[field];
  if (value != null && typeof value !== 'string') throw new FormValidationError('invalid', field);
  const result = typeof value === 'string' ? value.trim() : '';
  if (result.includes('\u0000')) throw new FormValidationError('invalid', field);
  if (result.length > maximum) throw new FormValidationError('too_long', field);
  if (required && !result) throw new FormValidationError('required', field);
  return result;
}

function emailField(fields: Record<string, unknown>, field: string): string {
  const value = stringField(fields, field, 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new FormValidationError('invalid_email', field);
  return value;
}

function phoneField(fields: Record<string, unknown>, field: string): string {
  const value = stringField(fields, field, 40, true)
    .replace(/[\u09e6-\u09ef]/g, (digit) => String(digit.charCodeAt(0) - 0x09e6));
  const digits = value.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
    throw new FormValidationError('invalid_phone', field);
  }
  return value.replace(/[\s().-]/g, '');
}

function optionField(fields: Record<string, unknown>, field: string, options: readonly string[]): string {
  const value = stringField(fields, field, 160, true);
  if (!options.includes(value)) throw new FormValidationError('invalid_option', field);
  return value;
}

export function parsePublicForm(input: unknown): PublicFormSubmission {
  const body = record(input);
  const kind = body.kind;
  if (typeof kind !== 'string' || !publicFormKinds.includes(kind as PublicFormKind)) throw new FormValidationError('invalid');
  const requestId = stringField(body, 'request_id', 36, true);
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(requestId)) {
    throw new FormValidationError('invalid', 'request_id');
  }
  if (stringField(body, 'website', 200)) throw new FormValidationError('spam');
  const captchaToken = stringField(body, 'captcha_token', 2048);
  const fields = record(body.fields);
  const name = kind === 'guide' ? null : stringField(fields, 'name', 120, kind === 'session') || null;
  const details: Record<string, string> = {};
  let email: string | null = null;
  let phone: string | null = null;

  if (kind === 'session') {
    email = emailField(fields, 'email');
    phone = phoneField(fields, 'phone');
    details.designation = stringField(fields, 'designation', 120, true);
    details.college = stringField(fields, 'college', 200, true);
    details.district = stringField(fields, 'district', 80, true);
    details.students = optionField(fields, 'students', ['Under 30', '30\u201360', '60\u2013100', '100\u2013150', '150+']);
    details.date = stringField(fields, 'date', 10, true);
    const date = new Date(`${details.date}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(details.date) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== details.date) {
      throw new FormValidationError('invalid_date', 'date');
    }
    details.notes = stringField(fields, 'notes', 6000);
  } else if (kind === 'fact_check') {
    email = emailField(fields, 'email');
    details.source = optionField(fields, 'source', ['WhatsApp', 'Facebook', 'YouTube', 'TikTok', 'Twitter', 'News website', 'Other']);
    details.content = stringField(fields, 'content', 6000, true);
    details.link = stringField(fields, 'link', 2048);
    if (details.link) {
      try {
        const url = new URL(details.link);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
        details.link = url.href;
      } catch {
        throw new FormValidationError('invalid_url', 'link');
      }
      if (details.link.length > 2048) throw new FormValidationError('too_long', 'link');
    }
  } else if (kind === 'support') {
    const contact = stringField(fields, 'contact', 254, true);
    if (contact.includes('@')) email = emailField(fields, 'contact');
    else phone = phoneField(fields, 'contact');
    details.issue = optionField(fields, 'issue', [
      'My photo or video was shared without my permission',
      'I am being harassed online',
      'A rumor is being spread about me',
      'I need advice about something online',
      'Other',
    ]);
    details.content = stringField(fields, 'content', 6000, true);
    details.time = stringField(fields, 'time', 160);
  } else {
    email = emailField(fields, 'email');
  }

  return { kind: kind as PublicFormKind, requestId: requestId.toLowerCase(), name, email, phone, details, captchaToken };
}

export type PublicFormsDependencies = {
  origins: readonly string[];
  consumeRateLimit: (remoteIp: string) => Promise<boolean>;
  save: (submission: PublicFormSubmission) => Promise<{ created: boolean }>;
  verifyCaptcha?: (token: string, remoteIp: string) => Promise<boolean>;
  notify?: (submission: PublicFormSubmission) => Promise<void>;
  schedule?: (task: Promise<void>) => void;
  reportError?: (stage: string, error: unknown) => void;
};

async function readBody(request: Request): Promise<string> {
  const maximum = 48 * 1024;
  if (Number(request.headers.get('content-length')) > maximum) throw new Error('body_limit');
  if (!request.body) throw new FormValidationError('invalid');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximum) {
      await reader.cancel();
      throw new Error('body_limit');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export function createPublicFormsHandler(dependencies: PublicFormsDependencies) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin') || '';
    const contentType = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    const nativeForm = contentType === 'application/x-www-form-urlencoded';
    const headers = new Headers({
      'Cache-Control': 'no-store',
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
      'Access-Control-Expose-Headers': 'Retry-After',
    });
    if (origin && dependencies.origins.includes(origin)) headers.set('Access-Control-Allow-Origin', origin);
    const reply = (status: number, error: string, extra: Record<string, string> = {}) => {
      if (status === 429) headers.set('Retry-After', '900');
      if (nativeForm) {
        headers.set('Content-Type', 'text/plain; charset=utf-8');
        return new Response('Your submission could not be saved. Please go back, check your details, and try again. If the problem continues, contact Onnoy directly.', { status, headers });
      }
      return Response.json({ ok: false, error, ...extra }, { status, headers });
    };
    if (origin && !dependencies.origins.includes(origin)) return reply(403, 'origin');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') {
      headers.set('Allow', 'POST, OPTIONS');
      return reply(405, 'method');
    }
    if (!['application/json', 'application/x-www-form-urlencoded'].includes(contentType)) return reply(415, 'content_type');

    let submission: PublicFormSubmission;
    try {
      const raw = await readBody(request);
      if (nativeForm) {
        const fields = Object.fromEntries(new URLSearchParams(raw));
        submission = parsePublicForm({
          kind: fields.kind,
          request_id: fields.request_id || crypto.randomUUID(),
          website: fields.website,
          captcha_token: fields['cf-turnstile-response'],
          fields,
        });
      } else {
        submission = parsePublicForm(JSON.parse(raw));
      }
    } catch (error) {
      if (error instanceof FormValidationError) return reply(400, 'validation', { code: error.code, field: error.field });
      if (error instanceof Error && error.message === 'body_limit') return reply(413, 'body_limit');
      return reply(400, 'validation', { code: 'invalid' });
    }

    const remoteIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    try {
      if (!await dependencies.consumeRateLimit(remoteIp)) return reply(429, 'rate_limit');
      if (dependencies.verifyCaptcha && !await dependencies.verifyCaptcha(submission.captchaToken, remoteIp)) return reply(400, 'captcha');
      const { created } = await dependencies.save(submission);
      if (created && dependencies.notify) {
        const notification = Promise.resolve().then(() => dependencies.notify!(submission)).catch((error: unknown) => {
          dependencies.reportError?.('notification', error);
        });
        if (dependencies.schedule) dependencies.schedule(notification);
        else await notification;
      }
    } catch (error) {
      dependencies.reportError?.('submission', error);
      return reply(503, 'unavailable');
    }

    if (nativeForm) {
      const paths: Record<PublicFormKind, string> = { session: '/session-request', fact_check: '/fact-check', support: '/support', guide: '/facilitator-guide' };
      const destination = new URL(paths[submission.kind], origin || dependencies.origins[0]);
      destination.hash = 'request-received';
      headers.set('Location', destination.href);
      return new Response(null, { status: 303, headers });
    }
    return Response.json({ ok: true, reference: submission.requestId }, { status: 201, headers });
  };
}