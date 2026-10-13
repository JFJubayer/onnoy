import { translations } from '@data/translations';
import type { GuideStep } from '@data/site-guide';

function initializeSiteGuide() {
  const widget = document.querySelector<HTMLElement>('#siteGuide');
  const panel = document.querySelector<HTMLElement>('#siteGuidePanel');
  const launcher = document.querySelector<HTMLButtonElement>('#siteGuideLauncher');
  const heading = document.querySelector<HTMLElement>('#siteGuideTitle');
  const description = document.querySelector<HTMLElement>('#siteGuideBody');
  const count = document.querySelector<HTMLElement>('#siteGuideCount');
  const action = document.querySelector<HTMLAnchorElement>('#siteGuideAction');
  const about = document.querySelector<HTMLButtonElement>('#siteGuideAbout');
  const find = document.querySelector<HTMLButtonElement>('#siteGuideFind');
  const back = document.querySelector<HTMLButtonElement>('#siteGuideBack');
  const next = document.querySelector<HTMLButtonElement>('#siteGuideNext');
  const nextText = document.querySelector<HTMLElement>('#siteGuideNextText');
  const auto = document.querySelector<HTMLInputElement>('#siteGuideAuto');
  const settings = document.querySelector<HTMLElement>('#siteGuideSettings');
  const settingsToggle = document.querySelector<HTMLButtonElement>('#siteGuideSettingsToggle');
  const pointer = document.querySelector<HTMLElement>('#siteGuidePointer');
  const copy = document.querySelector<HTMLElement>('.site-guide__copy');
  if (!widget || !panel || !launcher || !heading || !description || !count || !action || !about || !find || !back || !next || !nextText || !auto || !settings || !settingsToggle || !pointer || !copy) return;

  const text = (key: string) => translations[key]?.[document.documentElement.lang === 'bn' ? 'bn' : 'en'] ?? '';
  const steps: GuideStep[] = Array.from(widget.querySelectorAll<HTMLElement>('[data-guide-title]')).map((element) => ({
    title: element.dataset.guideTitle || '', body: element.dataset.guideBody || '', target: element.dataset.guideTarget,
    href: element.dataset.guideHref, action: element.dataset.guideAction,
  }));
  if (!steps.length) return;
  const route = widget.dataset.guideRoute || '/';
  const seenKey = 'onnoy_guide_seen_v2';
  const progressKey = 'onnoy_guide_progress_v2';
  const autoKey = 'onnoy_guide_auto_v1';
  const read = (key: string, storage: 'localStorage' | 'sessionStorage'): unknown => {
    try { return JSON.parse(window[storage].getItem(key) || 'null'); } catch { return null; }
  };
  const write = (key: string, value: unknown, storage: 'localStorage' | 'sessionStorage') => {
    try { window[storage].setItem(key, JSON.stringify(value)); } catch {}
  };
  const savedSeen = read(seenKey, 'sessionStorage');
  const seen = new Set<string>(Array.isArray(savedSeen) ? savedSeen.filter((value): value is string => typeof value === 'string') : []);
  const savedProgress = read(progressKey, 'sessionStorage');
  const progress: Record<string, number> = savedProgress && typeof savedProgress === 'object' && !Array.isArray(savedProgress)
    ? Object.fromEntries(Object.entries(savedProgress).filter(([, value]) => typeof value === 'number' && Number.isInteger(value) && value >= 0)) : {};
  const requestedStory = new URLSearchParams(window.location.search).get('story') === 'onima';
  const storyIndex = steps.findIndex((step) => step.title === 'guide-onima-story-title');
  let storyPending = requestedStory && storyIndex >= 0;
  let index = storyPending ? storyIndex : Math.min(progress[route] || 0, steps.length - 1);
  let aboutMode = false;
  let autoEnabled = read(autoKey, 'localStorage') !== false;
  let autoTimer: number | undefined;
  let closeTimer: number | undefined;
  let pointerFrame = 0;
  let highlighted: Element | null = null;

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clearHighlight = () => { highlighted?.classList.remove('site-guide-highlight'); highlighted = null; pointer.hidden = true; };
  const busy = () => document.documentElement.classList.contains('opening-intro-active') || document.body.classList.contains('nav-open') || document.body.classList.contains('assessment-active') || !!document.querySelector('dialog[open]') || !!document.fullscreenElement;
  const getTarget = () => steps[index].target ? document.querySelector(steps[index].target!) : null;
  const markSeen = () => { seen.add(route); write(seenKey, [...seen], 'sessionStorage'); };
  const saveProgress = () => { progress[route] = index; write(progressKey, progress, 'sessionStorage'); };
  const updatePointer = () => {
    pointer.hidden = true;
    if (!highlighted || panel.hidden || panel.inert || busy()) return;
    const target = highlighted.getBoundingClientRect();
    if (!target.width || !target.height || target.bottom <= 0 || target.top >= window.innerHeight) return;
    const size = 44;
    const above = target.top >= size + 12;
    if (!above && target.bottom > window.innerHeight - size - 12) return;
    const left = Math.max(12, Math.min(target.left + target.width / 2 - size / 2, window.innerWidth - size - 12));
    const top = above ? target.top - size - 8 : target.bottom + 8;
    const host = panel.getBoundingClientRect();
    if (left < host.right && left + size > host.left && top < host.bottom && top + size > host.top) return;
    pointer.style.left = `${left}px`;
    pointer.style.top = `${top}px`;
    pointer.dataset.direction = above ? 'down' : 'up';
    pointer.hidden = false;
  };
  const schedulePointer = () => {
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => { pointerFrame = 0; updatePointer(); });
  };
  const refreshText = () => {
    widget.querySelectorAll<HTMLElement>('[data-guide-label]').forEach((element) => {
      const label = text(element.dataset.guideLabel || ''); element.setAttribute('aria-label', label); element.title = label;
    });
    heading.textContent = text(aboutMode ? 'guide-about-onima-title' : steps[index].title);
    description.textContent = text(aboutMode ? 'guide-about-onima-body' : steps[index].body);
    count.textContent = aboutMode ? text('guide-about-onima-label') : `${index + 1} / ${steps.length}`;
    back.disabled = aboutMode || index === 0;
    const last = index === steps.length - 1;
    widget.dataset.guideLast = String(!aboutMode && last);
    widget.dataset.guideAbout = String(aboutMode);
    nextText.dataset.i18n = last ? 'guide-done' : 'guide-next';
    nextText.textContent = text(nextText.dataset.i18n);
    const actionHref = aboutMode ? '/workbooks?story=onima' : steps[index].href;
    const actionKey = aboutMode ? 'guide-open-onima-story' : steps[index].action;
    action.hidden = !actionHref || !actionKey;
    if (!action.hidden) { action.href = actionHref!; action.textContent = text(actionKey!); }
    about.dataset.i18n = aboutMode ? 'guide-back-to-guide' : 'guide-who-onima';
    about.textContent = text(about.dataset.i18n);
    about.setAttribute('aria-pressed', String(aboutMode));
    find.disabled = aboutMode || !getTarget();
    auto.checked = autoEnabled;
    copy.scrollTop = 0;
    if (!panel.hidden && !reducedMotion()) copy.animate([{ opacity: .2, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180, easing: 'ease-out' });
    schedulePointer();
  };
  const highlightTarget = () => {
    clearHighlight();
    const target = getTarget();
    if (target) { highlighted = target; target.classList.add('site-guide-highlight'); }
    schedulePointer();
    return target;
  };
  const showTarget = () => {
    const target = highlightTarget();
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    const navigation = document.querySelector('nav[aria-label="Primary"]')?.getBoundingClientRect();
    const safeTop = Math.max(16, navigation?.bottom || 0);
    const safeBottom = Math.max(safeTop + 72, panel.getBoundingClientRect().top - 16);
    const targetTop = safeTop + Math.max(52, (safeBottom - safeTop - bounds.height) / 2);
    window.scrollTo({ top: Math.max(0, window.scrollY + bounds.top - targetTop), behavior: reducedMotion() ? 'instant' : 'smooth' });
  };
  const finishClose = () => {
    panel.hidden = true; panel.inert = false; panel.classList.remove('is-leaving');
    document.documentElement.classList.remove('site-guide-panel-open');
    launcher.hidden = false;
    if (!busy()) launcher.focus({ preventScroll: true });
  };
  const close = () => {
    if (panel.hidden || panel.inert) return;
    window.clearTimeout(autoTimer); markSeen(); saveProgress(); clearHighlight();
    launcher.setAttribute('aria-expanded', 'false');
    settings.hidden = true; settingsToggle.setAttribute('aria-expanded', 'false');
    if (reducedMotion()) finishClose();
    else { panel.inert = true; panel.classList.add('is-leaving'); closeTimer = window.setTimeout(finishClose, 220); }
  };
  const open = (automatic = false) => {
    if (busy() || document.hidden) return;
    window.clearTimeout(autoTimer); window.clearTimeout(closeTimer); markSeen();
    aboutMode = false;
    panel.inert = false; panel.classList.remove('is-leaving');
    refreshText(); panel.hidden = false; launcher.hidden = true; launcher.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('site-guide-panel-open');
    highlightTarget();
    if (!automatic) heading.focus({ preventScroll: true });
  };
  const scheduleAutomatic = () => {
    window.clearTimeout(autoTimer);
    if ((!autoEnabled && !storyPending) || (!storyPending && seen.has(route)) || widget.dataset.guideAuto !== 'true' || document.hidden || busy() || !panel.hidden) return;
    autoTimer = window.setTimeout(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && (active.matches('input, textarea, select, [contenteditable="true"]') || active.closest('form'))) { markSeen(); return; }
      storyPending = false;
      open(true);
    }, 900);
  };
  const updateAvailability = () => {
    const suspended = busy();
    if (widget.classList.contains('is-suspended') !== suspended) widget.classList.toggle('is-suspended', suspended);
    if (suspended) { window.clearTimeout(autoTimer); clearHighlight(); }
    else { if (!panel.hidden && !highlighted && !panel.inert) highlightTarget(); scheduleAutomatic(); }
  };

  launcher.addEventListener('click', () => open());
  about.addEventListener('click', () => {
    aboutMode = !aboutMode;
    if (aboutMode) clearHighlight();
    refreshText();
    if (!aboutMode) highlightTarget();
    heading.focus({ preventScroll: true });
  });
  widget.querySelector('#siteGuideClose')?.addEventListener('click', close);
  widget.querySelector('#siteGuideSkip')?.addEventListener('click', close);
  back.addEventListener('click', () => { if (aboutMode || index === 0) return; index--; saveProgress(); refreshText(); showTarget(); heading.focus({ preventScroll: true }); });
  next.addEventListener('click', () => { if (aboutMode) return; if (index === steps.length - 1) { close(); return; } index++; saveProgress(); refreshText(); showTarget(); heading.focus({ preventScroll: true }); });
  find.addEventListener('click', showTarget);
  widget.querySelector('#siteGuideRestart')?.addEventListener('click', () => { aboutMode = false; index = 0; saveProgress(); refreshText(); highlightTarget(); heading.focus({ preventScroll: true }); });
  settingsToggle.addEventListener('click', () => { settings.hidden = !settings.hidden; settingsToggle.setAttribute('aria-expanded', String(!settings.hidden)); });
  auto.addEventListener('change', () => { autoEnabled = auto.checked; write(autoKey, autoEnabled, 'localStorage'); if (!autoEnabled) window.clearTimeout(autoTimer); });
  widget.querySelector('#siteGuideReset')?.addEventListener('click', () => { seen.clear(); Object.keys(progress).forEach((key) => delete progress[key]); index = 0; markSeen(); saveProgress(); refreshText(); highlightTarget(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden && !busy()) { event.preventDefault(); close(); } });
  document.addEventListener('onnoy:langchange', refreshText);
  document.addEventListener('visibilitychange', updateAvailability);
  document.addEventListener('fullscreenchange', updateAvailability);
  window.addEventListener('scroll', schedulePointer, { passive: true });
  window.addEventListener('resize', schedulePointer);
  document.addEventListener('focusin', (event) => {
    if (panel.hidden && event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable="true"]')) { window.clearTimeout(autoTimer); markSeen(); }
  });
  window.addEventListener('storage', (event) => { if (event.key === autoKey) { autoEnabled = read(autoKey, 'localStorage') !== false; refreshText(); updateAvailability(); } });
  if (typeof ResizeObserver === 'function') new ResizeObserver(schedulePointer).observe(panel);
  new MutationObserver(updateAvailability).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['open', 'class'] });
  refreshText(); widget.hidden = false; updateAvailability();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeSiteGuide, { once: true });
else initializeSiteGuide();