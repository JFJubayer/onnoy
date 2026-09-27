/**
 * Auth-aware navbar: renders Log In / user menu and syncs local progress with
 * the user's Supabase profile. Admin UI is gated by profiles.role (RLS-enforced),
 * not by a hardcoded email list.
 */
import type { Session } from '@supabase/supabase-js';
import { supabase, isAdminUser } from '@lib/supabase';
import { translations } from '@data/translations';

const PROGRESS_KEYS = [
  'onnoy_lesson_overview', 'onnoy_lesson_attention', 'onnoy_lesson_misinformation',
  'onnoy_lesson_scams', 'onnoy_lesson_ai', 'onnoy_mission_spot_lie', 'onnoy_mission_scam_alert',
  'onnoy_mission_ai_integrity', 'onnoy_mission_guardian', 'onnoy_badge_informed_shown',
  'onnoy_badge_aware_shown', 'onnoy_badge_guardian_shown',
];

const lang = () => (document.documentElement.getAttribute('lang') || 'en') as 'en' | 'bn';
const t = (key: string, def: string) => translations[key]?.[lang()] ?? def;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export function clearLocalProgress() {
  PROGRESS_KEYS.forEach((k) => localStorage.removeItem(k));
  localStorage.setItem('onnoy_progress_owner', 'anonymous');
}

function container(): HTMLElement | null {
  return document.getElementById('nav-auth-container');
}

function renderLoggedOut(el: HTMLElement) {
  el.innerHTML = `<a href="/login" class="nav-auth-link" aria-label="${t('nav-login', 'Log In')}">
    <svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span class="label">${t('nav-login', 'Log In')}</span></a>`;
}

async function renderLoggedIn(el: HTMLElement, session: Session) {
  const user = session.user;
  const email = user.email ?? '';
  const isAdmin = await isAdminUser(user.id);

  el.innerHTML = `
    <div class="dropdown auth-dropdown">
      <button class="nav-auth-link auth-user-btn" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu">
        <img class="avatar" id="nav-profile-avatar" alt="" src="/assets/images/default-avatar.svg">
        <span class="label" id="nav-profile-id-val">${t('nav-loading', 'Loading…')}</span>
        <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="dropdown-menu auth-dropdown-menu" role="menu" style="right:0;left:auto;min-width:230px">
        <div class="auth-menu-head">
          <strong>${esc(email)}</strong>
          <span>${t('nav-profile-id', 'Profile ID')}: <b id="nav-profile-id-copy">—</b></span>
        </div>
        <div class="divider"></div>
        <a href="/profile" role="menuitem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${lang() === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}
        </a>
        ${isAdmin ? `<a href="/admin-portal" role="menuitem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          Admin Dashboard</a>` : ''}
        <div class="divider"></div>
        <a href="#" id="navSignOutBtn" role="menuitem" class="danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          ${t('nav-signout', 'Sign Out')}
        </a>
      </div>
    </div>`;

  const dd = el.querySelector<HTMLElement>('.auth-dropdown')!;
  const btn = el.querySelector<HTMLButtonElement>('.auth-user-btn')!;
  const menu = el.querySelector<HTMLElement>('.auth-dropdown-menu')!;
  const setOpen = (open: boolean) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    dd.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!menu.classList.contains('open')); });
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  el.querySelector('#navSignOutBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    clearLocalProgress();
    await supabase!.auth.signOut();
    window.location.href = '/';
  });

  syncLocalBadgesToDatabase(session).catch((err) => console.error('[onnoy] sync failed', err));

  // Profile ID + avatar
  const idEl = el.querySelector<HTMLElement>('#nav-profile-id-val')!;
  const idCopy = el.querySelector<HTMLElement>('#nav-profile-id-copy')!;
  const avatar = el.querySelector<HTMLImageElement>('#nav-profile-avatar')!;
  if (isAdmin) {
    idEl.textContent = lang() === 'bn' ? 'অ্যাডমিন' : 'Admin';
  }
  const { data, error } = await supabase!.from('profiles').select('unique_id, avatar_url').eq('id', user.id).maybeSingle();
  if (error) {
    idEl.textContent = isAdmin ? idEl.textContent : (lang() === 'bn' ? 'অপ্রমাণিত' : 'Pending');
  } else if (data) {
    if (!isAdmin) idEl.textContent = data.unique_id || (lang() === 'bn' ? 'অপ্রমাণিত' : 'Pending');
    idCopy.textContent = data.unique_id || '—';
    if (data.avatar_url) avatar.src = data.avatar_url;
  } else if (!isAdmin) {
    idEl.textContent = lang() === 'bn' ? 'অপ্রমাণিত' : 'Pending';
  }
}

async function render(session: Session | null) {
  const el = container();
  if (!el) return;
  if (!session) renderLoggedOut(el);
  else await renderLoggedIn(el, session);
}

/** Merge localStorage progress with the profile row (both directions). */
async function syncLocalBadgesToDatabase(session: Session) {
  if (!supabase) return;
  const email = session.user.email ?? '';
  const owner = localStorage.getItem('onnoy_progress_owner');
  if (owner && owner !== 'anonymous' && owner !== email) clearLocalProgress();
  localStorage.setItem('onnoy_progress_owner', email);

  const { data: profile, error } = await supabase
    .from('profiles').select('badges, status, ongoing_modules, completed_modules')
    .eq('id', session.user.id).maybeSingle();
  if (error || !profile) return;

  let localChanged = false;
  const dbBadges: string[] = Array.isArray(profile.badges) ? profile.badges : [];
  for (const b of dbBadges) {
    const k = `onnoy_badge_${b}_shown`;
    if (localStorage.getItem(k) !== 'true') { localStorage.setItem(k, 'true'); localChanged = true; }
  }

  const statusOrder = ['Approved', 'Mission2Unlocked', 'Mission3Unlocked', 'Mission4Unlocked'];
  const idx = statusOrder.indexOf(profile.status);
  if (idx >= 0) {
    for (const l of ['overview', 'attention', 'misinformation', 'scams', 'ai']) {
      const k = `onnoy_lesson_${l}`;
      if (localStorage.getItem(k) !== 'complete') { localStorage.setItem(k, 'complete'); localChanged = true; }
    }
  }
  const missionKeys = ['onnoy_mission_spot_lie', 'onnoy_mission_scam_alert', 'onnoy_mission_ai_integrity'];
  missionKeys.forEach((k, i) => {
    const shouldBeComplete = idx >= i + 1;
    const is = localStorage.getItem(k) === 'complete';
    if (shouldBeComplete && !is) { localStorage.setItem(k, 'complete'); localChanged = true; }
    if (!shouldBeComplete && is) { localStorage.removeItem(k); localChanged = true; }
  });

  if (localChanged) {
    const w = window as any;
    if (typeof w.renderBadgesDisplay === 'function') w.renderBadgesDisplay();
    if (typeof w.renderHubProgress === 'function') w.renderHubProgress();
  }

  // Push local achievements up.
  const updates: Record<string, unknown> = {};
  const finalBadges = [...dbBadges];
  let badgesUpdated = false;
  for (const b of ['informed', 'aware', 'guardian']) {
    if (localStorage.getItem(`onnoy_badge_${b}_shown`) === 'true' && !finalBadges.includes(b)) {
      finalBadges.push(b); badgesUpdated = true;
    }
  }
  if (profile.status === 'pending' && localStorage.getItem('onnoy_lesson_overview') === 'complete') {
    updates.status = 'Approved';
  }
  const level1Done = ['overview', 'attention', 'misinformation', 'scams', 'ai']
    .every((l) => localStorage.getItem(`onnoy_lesson_${l}`) === 'complete');
  if (level1Done && !finalBadges.includes('informed')) {
    finalBadges.push('informed'); badgesUpdated = true;
    localStorage.setItem('onnoy_badge_informed_shown', 'true');
  }
  if (badgesUpdated) updates.badges = finalBadges;

  // Module tracking data is only present on course pages; skip elsewhere so we never clobber the profile.
  const trackable: { key: string; title: string }[] = (window as any).ONNOY_TRACKABLE_MODULES ?? [];
  if (trackable.length) {
    const completed: string[] = [...(profile.completed_modules ?? [])];
    const ongoing: string[] = [];
    let modulesUpdated = false;
    let foundOngoing = false;
    for (const item of trackable) {
      if (localStorage.getItem(item.key) === 'complete') {
        if (!completed.includes(item.title)) { completed.push(item.title); modulesUpdated = true; }
      } else if (!foundOngoing && !completed.includes(item.title)) {
        ongoing.push(item.title); foundOngoing = true;
      }
    }
    if (modulesUpdated) updates.completed_modules = completed;
    if (JSON.stringify(ongoing) !== JSON.stringify(profile.ongoing_modules ?? [])) updates.ongoing_modules = ongoing;
  }

  if (Object.keys(updates).length) {
    const { error: upErr } = await supabase.from('profiles').update(updates).eq('id', session.user.id);
    if (upErr) console.error('[onnoy] profile sync error:', upErr.message);
  }
}

function init() {
  if (!supabase) { const el = container(); if (el) renderLoggedOut(el); return; }
  supabase.auth.getSession().then(({ data }) => render(data.session)).catch(() => render(null));
  supabase.auth.onAuthStateChange((_e, session) => { render(session); });
  document.addEventListener('onnoy:langchange', () => {
    supabase!.auth.getSession().then(({ data }) => render(data.session));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
