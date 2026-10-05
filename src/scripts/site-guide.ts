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
  const find = document.querySelector<HTMLButtonElement>('#siteGuideFind');
  const back = document.querySelector<HTMLButtonElement>('#siteGuideBack');
  const next = document.querySelector<HTMLButtonElement>('#siteGuideNext');
  const nextText = document.querySelector<HTMLElement>('#siteGuideNextText');
  const auto = document.querySelector<HTMLInputElement>('#siteGuideAuto');
  const settings = document.querySelector<HTMLElement>('#siteGuideSettings');
  const settingsToggle = document.querySelector<HTMLButtonElement>('#siteGuideSettingsToggle');
  if (!widget || !panel || !launcher || !heading || !description || !count || !action || !find || !back || !next || !nextText || !auto || !settings || !settingsToggle) return;

  const text = (key: string) => translations[key]?.[document.documentElement.lang === 'bn' ? 'bn' : 'en'] ?? '';
  const steps: GuideStep[] = Array.from(widget.querySelectorAll<HTMLElement>('[data-guide-title]')).map((element) => ({
    title: element.dataset.guideTitle || '', body: element.dataset.guideBody || '', target: element.dataset.guideTarget,
    href: element.dataset.guideHref, action: element.dataset.guideAction,
  }));
  if (!steps.length) return;
  const route = widget.dataset.guideRoute || '/';
  const seenKey = 'onnoy_guide_seen_v1';
  const progressKey = 'onnoy_guide_progress_v1';
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
  let index = Math.min(progress[route] || 0, steps.length - 1);
  let autoEnabled = read(autoKey, 'localStorage') !== false;
  let autoTimer: number | undefined;
  let highlighted: Element | null = null;

  const clearHighlight = () => { highlighted?.classList.remove('site-guide-highlight'); highlighted = null; };
  const busy = () => document.documentElement.classList.contains('opening-intro-active') || document.body.classList.contains('nav-open') || !!document.querySelector('dialog[open]') || !!document.fullscreenElement;
  const getTarget = () => steps[index].target ? document.querySelector(steps[index].target!) : null;
  const markSeen = () => { seen.add(route); write(seenKey, [...seen], 'sessionStorage'); };
  const saveProgress = () => { progress[route] = index; write(progressKey, progress, 'sessionStorage'); };
  const refreshText = () => {
    widget.querySelectorAll<HTMLElement>('[data-guide-label]').forEach((element) => {
      const label = text(element.dataset.guideLabel || ''); element.setAttribute('aria-label', label); element.title = label;
    });
    heading.textContent = text(steps[index].title);
    description.textContent = text(steps[index].body);
    count.textContent = `${index + 1} / ${steps.length}`;
    back.disabled = index === 0;
    const last = index === steps.length - 1;
    widget.dataset.guideLast = String(last);
    nextText.dataset.i18n = last ? 'guide-done' : 'guide-next';
    nextText.textContent = text(nextText.dataset.i18n);
    action.hidden = !steps[index].href || !steps[index].action;
    if (!action.hidden) { action.href = steps[index].href!; action.textContent = text(steps[index].action!); }
    find.disabled = !getTarget();
    auto.checked = autoEnabled;
  };
  const showTarget = () => {
    clearHighlight();
    const target = getTarget();
    if (!target) return;
    highlighted = target;
    target.classList.add('site-guide-highlight');
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  };
  const close = () => {
    window.clearTimeout(autoTimer); markSeen(); saveProgress(); clearHighlight();
    panel.hidden = true; launcher.hidden = false; launcher.setAttribute('aria-expanded', 'false');
    settings.hidden = true; settingsToggle.setAttribute('aria-expanded', 'false');
    launcher.focus({ preventScroll: true });
  };
  const open = (automatic = false) => {
    if (busy() || document.hidden) return;
    window.clearTimeout(autoTimer); markSeen();
    refreshText(); panel.hidden = false; launcher.hidden = true; launcher.setAttribute('aria-expanded', 'true');
    if (!automatic) heading.focus({ preventScroll: true });
  };
  const scheduleAutomatic = () => {
    window.clearTimeout(autoTimer);
    if (!autoEnabled || seen.has(route) || widget.dataset.guideAuto !== 'true' || document.hidden || busy() || !panel.hidden) return;
    autoTimer = window.setTimeout(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && (active.matches('input, textarea, select, [contenteditable="true"]') || active.closest('form'))) { markSeen(); return; }
      open(true);
    }, 900);
  };
  const updateAvailability = () => {
    const suspended = busy();
    if (widget.classList.contains('is-suspended') !== suspended) widget.classList.toggle('is-suspended', suspended);
    if (suspended) { window.clearTimeout(autoTimer); clearHighlight(); }
    else scheduleAutomatic();
  };

  launcher.addEventListener('click', () => open());
  widget.querySelector('#siteGuideClose')?.addEventListener('click', close);
  widget.querySelector('#siteGuideSkip')?.addEventListener('click', close);
  back.addEventListener('click', () => { if (index === 0) return; index--; saveProgress(); refreshText(); showTarget(); heading.focus({ preventScroll: true }); });
  next.addEventListener('click', () => { if (index === steps.length - 1) { close(); return; } index++; saveProgress(); refreshText(); showTarget(); heading.focus({ preventScroll: true }); });
  find.addEventListener('click', showTarget);
  widget.querySelector('#siteGuideRestart')?.addEventListener('click', () => { index = 0; saveProgress(); clearHighlight(); refreshText(); heading.focus({ preventScroll: true }); });
  settingsToggle.addEventListener('click', () => { settings.hidden = !settings.hidden; settingsToggle.setAttribute('aria-expanded', String(!settings.hidden)); });
  auto.addEventListener('change', () => { autoEnabled = auto.checked; write(autoKey, autoEnabled, 'localStorage'); if (!autoEnabled) window.clearTimeout(autoTimer); });
  widget.querySelector('#siteGuideReset')?.addEventListener('click', () => { seen.clear(); Object.keys(progress).forEach((key) => delete progress[key]); index = 0; markSeen(); saveProgress(); clearHighlight(); refreshText(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden && !busy()) { event.preventDefault(); close(); } });
  document.addEventListener('onnoy:langchange', refreshText);
  document.addEventListener('visibilitychange', updateAvailability);
  document.addEventListener('fullscreenchange', updateAvailability);
  document.addEventListener('focusin', (event) => {
    if (panel.hidden && event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable="true"]')) { window.clearTimeout(autoTimer); markSeen(); }
  });
  window.addEventListener('storage', (event) => { if (event.key === autoKey) { autoEnabled = read(autoKey, 'localStorage') !== false; refreshText(); updateAvailability(); } });
  new MutationObserver(updateAvailability).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['open', 'class'] });
  refreshText(); widget.hidden = false; updateAvailability();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeSiteGuide, { once: true });
else initializeSiteGuide();