function initializeOpeningIntro() {
  const intro = document.querySelector<HTMLElement>('#openingIntro');
  const video = document.querySelector<HTMLVideoElement>('#openingIntroVideo');
  const skip = document.querySelector<HTMLButtonElement>('#openingIntroSkip');
  if (!intro || !video || !skip) return;

  const storageKey = 'onnoy_opening_seen_v1';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;
  try {
    if (sessionStorage.getItem(storageKey) === '1') return;
  } catch {}

  if (document.hidden) {
    const onVisible = () => {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', onVisible);
      initializeOpeningIntro();
    };
    document.addEventListener('visibilitychange', onVisible);
    return;
  }

  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const background = Array.from(document.body.children)
    .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== intro && !element.contains(intro) && !['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName))
    .map((element) => ({ element, inert: element.inert }));
  let safetyTimer: number;

  const dismiss = () => {
    if (intro.hidden) return;
    window.clearTimeout(safetyTimer);
    skip.removeEventListener('click', onSkip);
    video.removeEventListener('ended', dismiss);
    video.removeEventListener('error', dismiss);
    document.removeEventListener('keydown', onKeyDown);
    reducedMotion.removeEventListener('change', onMotionChange);
    intro.hidden = true;
    video.pause();
    video.removeAttribute('src');
    video.removeAttribute('poster');
    video.load();
    document.documentElement.classList.remove('opening-intro-active');
    background.forEach(({ element, inert }) => { element.inert = inert; });
    const focusTarget = previousFocus && previousFocus !== document.body && previousFocus.isConnected
      ? previousFocus
      : document.getElementById('main');
    focusTarget?.focus({ preventScroll: true });
  };

  const onSkip = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dismiss();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    dismiss();
  };
  const onMotionChange = (event: MediaQueryListEvent) => {
    if (event.matches) dismiss();
  };

  try {
    sessionStorage.setItem(storageKey, '1');
  } catch {}
  background.forEach(({ element }) => { element.inert = true; });
  document.documentElement.classList.add('opening-intro-active');
  intro.hidden = false;
  skip.addEventListener('click', onSkip);
  video.addEventListener('ended', dismiss, { once: true });
  video.addEventListener('error', dismiss, { once: true });
  document.addEventListener('keydown', onKeyDown);
  reducedMotion.addEventListener('change', onMotionChange);
  safetyTimer = window.setTimeout(dismiss, 8500);
  video.muted = true;
  video.poster = video.dataset.poster || '';
  video.src = video.dataset.src || '';
  skip.focus({ preventScroll: true });
  void video.play().catch(dismiss);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeOpeningIntro, { once: true });
else initializeOpeningIntro();