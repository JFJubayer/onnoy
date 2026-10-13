import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@lib/supabase';
import { translations } from '@data/translations';
import { FormValidationError, parsePublicForm, publicFormKinds, type PublicFormKind, type ValidationCode } from '../../supabase/functions/_shared/public-forms';

declare global {
  interface Window {
    turnstile?: { reset: (widget?: HTMLElement | string) => void };
  }
}

type FormResult = { ok?: boolean; error?: string; code?: ValidationCode; field?: string };

function text(key: string) {
  return (translations[key] || translations['form-unavailable'])[document.documentElement.lang === 'bn' ? 'bn' : 'en'];
}

function initializeForm(form: HTMLFormElement) {
  const kind = form.dataset.publicForm as PublicFormKind;
  const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const status = form.querySelector<HTMLElement>('.public-form-status');
  if (!publicFormKinds.includes(kind) || !button || !status) return;
  const submitKey = `form-submit-${kind.replace('_', '-')}`;
  let busy = false;
  let requestId = '';
  let fingerprint = '';
  button.dataset.i18n = submitKey;
  button.textContent = text(submitKey);

  const show = (key: string, state: string) => {
    status.dataset.i18n = key;
    status.dataset.state = state;
    status.textContent = text(key);
  };
  const invalid = (code: ValidationCode, field = '') => {
    const message = text(`form-error-${code}`);
    show(`form-error-${code}`, 'error');
    const input = form.elements.namedItem(field);
    if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
      input.setCustomValidity(message);
      input.reportValidity();
    }
  };

  form.addEventListener('input', (event) => {
    const input = event.target;
    if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) input.setCustomValidity('');
    if (!busy) {
      delete status.dataset.state;
      if (window.location.hash === '#request-received') history.replaceState(history.state, '', window.location.pathname + window.location.search);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    if (!supabase) {
      show('form-unavailable', 'error');
      return;
    }
    const values = new FormData(form);
    const fields = Object.fromEntries([...values.entries()].filter(([name]) => !['kind', 'website', 'cf-turnstile-response', 'request_id'].includes(name)));
    const payload = {
      kind, fields, request_id: requestId || crypto.randomUUID(),
      website: values.get('website') || '', captcha_token: values.get('cf-turnstile-response') || '',
    };
    try {
      const parsed = parsePublicForm(payload);
      const nextFingerprint = JSON.stringify([parsed.kind, parsed.name, parsed.email, parsed.phone, parsed.details]);
      if (fingerprint && fingerprint !== nextFingerprint) payload.request_id = crypto.randomUUID();
      requestId = payload.request_id;
      fingerprint = nextFingerprint;
    } catch (error) {
      if (error instanceof FormValidationError) invalid(error.code, error.field);
      else show('form-unavailable', 'error');
      return;
    }

    const controls = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement>('input, select, textarea, button')]
      .map((control) => ({ control, disabled: control.disabled }));
    busy = true;
    controls.forEach(({ control }) => { control.disabled = true; });
    form.setAttribute('aria-busy', 'true');
    button.dataset.i18n = 'form-sending';
    button.textContent = text('form-sending');
    show('form-sending', 'sending');
    let failed: FormResult | null = null;
    let success = false;
    try {
      const { data, error } = await supabase.functions.invoke<FormResult>('public-forms', { body: payload, timeout: 15000 });
      if (error instanceof FunctionsHttpError) failed = await error.context.json().catch(() => null) as FormResult | null;
      else if (error) failed = { error: 'unavailable' };
      else if (data?.ok === true) success = true;
      else failed = data || { error: 'unavailable' };
    } catch {
      failed = { error: 'unavailable' };
    } finally {
      busy = false;
      controls.forEach(({ control, disabled }) => { control.disabled = disabled; });
      form.removeAttribute('aria-busy');
      button.dataset.i18n = submitKey;
      button.textContent = text(submitKey);
      const captcha = form.querySelector<HTMLElement>('.cf-turnstile');
      if (captcha && window.turnstile) window.turnstile.reset(captcha);
    }

    if (success) {
      form.reset();
      requestId = '';
      fingerprint = '';
      show(`form-success-${kind.replace('_', '-')}`, 'success');
      window.onnoyTrack?.('public_form_success', { form_kind: kind });
    } else if (failed?.error === 'validation' && failed.code) {
      invalid(failed.code, failed.field);
    } else {
      show(failed?.error === 'rate_limit' ? 'form-rate-limit' : failed?.error === 'captcha' ? 'form-captcha' : 'form-unavailable', 'error');
    }
  });
}

function initializePublicForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-public-form]').forEach(initializeForm);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePublicForms, { once: true });
else initializePublicForms();