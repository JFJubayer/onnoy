function initializeOpeningIntro() {
  const intro = document.querySelector<HTMLElement>('#openingIntro');
  const video = document.querySelector<HTMLVideoElement>('#openingIntroVideo');
  const skip = document.querySelector<HTMLButtonElement>('#openingIntroSkip');
  if (!intro || !video || !skip) return;

  const storageKey = 'onnoy_opening_seen_v2';
  const seenDuration = 7 * 24 * 60 * 60 * 1000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;
  try {
    const seenAt = Number(localStorage.getItem(storageKey));
    if (seenAt > 0 && Date.now() - seenAt < seenDuration) return;
    if (sessionStorage.getItem('onnoy_opening_seen_v1') === '1') return;
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
    localStorage.setItem(storageKey, String(Date.now()));
  } catch {}
  background.forEach(({ element }) => { element.inert = true; });
  document.documentElement.classList.add('opening-intro-active');
  intro.hidden = false;
  skip.addEventListener('click', onSkip);
  video.addEventListener('ended', dismiss, { once: true });
  video.addEventListener('error', dismiss, { once: true });
  document.addEventListener('keydown', onKeyDown);
  reducedMotion.addEventListener('change', onMotionChange);
  safetyTimer = window.setTimeout(dismiss, 5000);
  video.muted = true;
  video.defaultPlaybackRate = 1.8;
  video.playbackRate = 1.8;
  video.poster = video.dataset.poster || '';
  video.src = video.dataset.src || '';
  skip.focus({ preventScroll: true });
  void video.play().catch(dismiss);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeOpeningIntro, { once: true });
else initializeOpeningIntro();