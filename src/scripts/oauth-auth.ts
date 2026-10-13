import { supabase } from '@lib/supabase';
import { translations, type Lang } from '@data/translations';

type OAuthProvider = 'google' | 'facebook';

const allowedProviders = new Set(['google', 'facebook']);
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

function currentLang(): Lang {
  return document.documentElement.lang === 'bn' ? 'bn' : 'en';
}

function text(key: string, fallback: string): string {
  return translations[key]?.[currentLang()] ?? fallback;
}

function isOAuthProvider(value: string | undefined): value is OAuthProvider {
  return !!value && allowedProviders.has(value);
}

function showError(message: string) {
  const alertBox = document.querySelector<HTMLElement>('#authAlert');
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.style.backgroundColor = 'var(--danger-bg)';
  alertBox.style.color = 'var(--danger-fg)';
  alertBox.style.borderColor = 'var(--danger-fg)';
  alertBox.style.display = 'block';
  alertBox.focus({ preventScroll: true });
}

function providerLabel(provider: OAuthProvider): string {
  return provider === 'google'
    ? text('auth-google', 'Google')
    : text('auth-facebook', 'Facebook');
}

function updateButtons(buttons: HTMLButtonElement[], busyProvider?: OAuthProvider) {
  buttons.forEach((button) => {
    const provider = button.dataset.oauthProvider;
    if (!isOAuthProvider(provider)) return;
    button.disabled = !!busyProvider;
    const label = button.querySelector<HTMLElement>('[data-oauth-label]');
    if (!label) return;
    label.textContent = busyProvider === provider
      ? (currentLang() === 'bn' ? `${providerLabel(provider)} খোলা হচ্ছে...` : `Opening ${providerLabel(provider)}...`)
      : providerLabel(provider);
  });
}

function callbackError(): string {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return search.get('error_description') || hash.get('error_description') || '';
}

async function enabledOAuthProviders(): Promise<Set<string>> {
  if (!supabaseUrl || !supabaseAnonKey) return new Set();
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/settings`, {
    headers: { apikey: supabaseAnonKey },
  });
  if (!response.ok) throw new Error(`Auth settings returned ${response.status}`);
  const settings = await response.json() as { external?: Record<string, boolean> };
  return new Set([...allowedProviders].filter((provider) => settings.external?.[provider]));
}

async function initializeOAuthAuth() {
  const root = document.querySelector<HTMLElement>('[data-oauth-root]');
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-oauth-provider]'));
  if (!root || buttons.length === 0) return;

  if (callbackError()) {
    showError(text('auth-oauth-cancelled', 'Social sign-in was cancelled or could not be completed. Please try again.'));
    window.history.replaceState({}, '', window.location.pathname);
  }

  let enabledProviders: Set<string>;
  try {
    enabledProviders = await enabledOAuthProviders();
  } catch (error) {
    console.error('[onnoy] Could not read OAuth provider settings', error);
    return;
  }

  buttons.forEach((button) => {
    const provider = button.dataset.oauthProvider;
    if (!isOAuthProvider(provider)) {
      button.hidden = true;
      return;
    }
    button.hidden = !enabledProviders.has(provider);
  });
  const enabledButtons = buttons.filter((button) => !button.hidden);
  if (enabledButtons.length === 0) return;
  root.hidden = false;

  enabledButtons.forEach((button) => button.addEventListener('click', async () => {
    const provider = button.dataset.oauthProvider;
    if (!isOAuthProvider(provider)) return;

    const alertBox = document.querySelector<HTMLElement>('#authAlert');
    if (alertBox) alertBox.style.display = 'none';
    if (!supabase) {
      showError(text('auth-oauth-unavailable', 'Social sign-in is not configured right now. Please use email and password.'));
      return;
    }

    updateButtons(enabledButtons, provider);
    window.onnoyTrack?.('auth_oauth_start', { provider });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/login` },
      });
      if (error) throw error;
    } catch (error) {
      console.error(`[onnoy] ${provider} OAuth failed`, error);
      showError(text('auth-oauth-unavailable', 'Social sign-in is not configured right now. Please use email and password.'));
      updateButtons(enabledButtons);
    }
  }));

  document.addEventListener('onnoy:langchange', () => updateButtons(enabledButtons));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeOAuthAuth, { once: true });
else initializeOAuthAuth();