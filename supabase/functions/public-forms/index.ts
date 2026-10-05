import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { createPublicFormsHandler, type PublicFormSubmission } from '../_shared/public-forms.ts';

declare const EdgeRuntime: { waitUntil: (task: Promise<void>) => void };

const url = Deno.env.get('SUPABASE_URL');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default;
const client = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
const localOrigins = Deno.env.get('DENO_DEPLOYMENT_ID') ? [] : ['http://localhost:4321', 'http://127.0.0.1:4321', 'http://localhost:4322', 'http://127.0.0.1:4322'];
const origins = (Deno.env.get('FORMS_ALLOWED_ORIGINS') || ['https://onnoy.vercel.app', ...localOrigins].join(','))
  .split(',').map((origin) => new URL(origin.trim()).origin);
const captchaSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
const emailKey = Deno.env.get('RESEND_API_KEY');
const emailFrom = Deno.env.get('FORMS_EMAIL_FROM');
const notifyEmail = Deno.env.get('FORMS_NOTIFY_EMAIL');
const emailEnabled = Boolean(emailKey && emailFrom && notifyEmail);

async function fingerprint(remoteIp: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(Deno.env.get('FORMS_RATE_LIMIT_SECRET') || serviceKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(remoteIp)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function consumeRateLimit(remoteIp: string): Promise<boolean> {
  if (!client) throw new Error('configuration');
  const { data, error } = await client.rpc('consume_public_form_rate_limit', { p_fingerprint: await fingerprint(remoteIp) });
  if (error || typeof data !== 'boolean') throw new Error('rate_limit_storage');
  return data;
}

async function save(submission: PublicFormSubmission): Promise<{ created: boolean }> {
  if (!client) throw new Error('configuration');
  const notificationStatus = emailEnabled ? 'pending' : 'disabled';
  const common = { id: submission.requestId, email: submission.email, notification_status: notificationStatus };
  const { data, error } = submission.kind === 'guide'
    ? await client.from('guide_subscribers').upsert(common, { onConflict: 'email', ignoreDuplicates: true }).select('id')
    : await client.from('public_requests').upsert({
      ...common, kind: submission.kind, name: submission.name, phone: submission.phone, details: submission.details,
    }, { onConflict: 'id', ignoreDuplicates: true }).select('id');
  if (error) throw new Error('request_storage');
  return { created: Boolean(data?.length) };
}

async function verifyCaptcha(token: string, remoteIp: string): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({ secret: captchaSecret!, response: token });
  if (remoteIp !== 'unknown') body.set('remoteip', remoteIp);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body, signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean; hostname?: string };
  return result.success === true && origins.some((origin) => new URL(origin).hostname === result.hostname);
}

async function notify(submission: PublicFormSubmission): Promise<void> {
  const labels = { session: 'Session request', fact_check: 'Fact-check request', support: 'Confidential support request', guide: 'Guide notification signup' };
  const inbox = new URL('/admin-portal', origins[0]);
  inbox.searchParams.set('tab', submission.kind === 'guide' ? 'subscribers' : 'requests');
  let status = 'failed';
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${emailKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `public-form/${submission.requestId}` },
      body: JSON.stringify({
        from: emailFrom, to: [notifyEmail], subject: `Onnoy: ${labels[submission.kind]}`,
        text: `A new ${labels[submission.kind].toLowerCase()} has been saved.\n\nReference: ${submission.requestId}\nOpen the secure inbox: ${inbox.href}\n\nPersonal details are available only in the admin portal.`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) status = 'sent';
  } finally {
    const table = submission.kind === 'guide' ? 'guide_subscribers' : 'public_requests';
    const { error } = await client!.from(table).update({ notification_status: status }).eq('id', submission.requestId);
    if (error || status === 'failed') throw new Error('notification_delivery');
  }
}

Deno.serve(createPublicFormsHandler({
  origins,
  consumeRateLimit,
  save,
  verifyCaptcha: captchaSecret ? verifyCaptcha : undefined,
  notify: emailEnabled ? notify : undefined,
  schedule: typeof EdgeRuntime !== 'undefined' ? (task) => EdgeRuntime.waitUntil(task) : undefined,
  reportError: (stage) => console.error(`[public-forms] ${stage} failed`),
}));