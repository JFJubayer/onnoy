/**
 * Site-wide behaviour: theme, language, navbar, reveal animations.
 * Loaded once from BaseLayout. Theme is pre-applied by an inline head script
 * to avoid a flash; this module only wires up interaction.
 */
import { translations, type Lang } from '@data/translations';

const LS_THEME = 'onnoy_theme';
const LS_LANG = 'onnoy_lang';
const MOBILE_BP = 960;

export function currentLang(): Lang {
  return (document.documentElement.getAttribute('lang') as Lang) || 'en';
}

export function t(key: string, fallback = ''): string {
  const entry = translations[key];
  return entry?.[currentLang()] ?? fallback;
}

export function applyLanguage(lang: Lang) {
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!;
    const value = translations[key]?.[lang];
    if (value !== undefined) { el.textContent = value; if (el.dataset.splitWords !== undefined) el.dataset.split = ''; }
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((el) => {
    const value = translations[el.dataset.i18nPlaceholder!]?.[lang];
    if (value !== undefined) (el as HTMLInputElement).placeholder = value;
  });
  document.querySelectorAll<HTMLElement>('.lang-toggle').forEach((b) => {
    b.textContent = lang === 'en' ? 'BN' : 'EN';
    b.setAttribute('aria-label', lang === 'en' ? 'Switch to Bangla' : 'Switch to English');
  });
  document.dispatchEvent(new CustomEvent('onnoy:langchange', { detail: { lang } }));
}

function initTheme() {
  const root = document.documentElement;
  document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(LS_THEME, next);
      document.dispatchEvent(new CustomEvent('onnoy:themechange', { detail: { theme: next } }));
    });
  });
}

function initLanguage() {
  const stored = (localStorage.getItem(LS_LANG) as Lang | null) ?? 'en';
  applyLanguage(stored);
  document.querySelectorAll<HTMLButtonElement>('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next: Lang = currentLang() === 'en' ? 'bn' : 'en';
      localStorage.setItem(LS_LANG, next);
      applyLanguage(next);
    });
  });
}

function initNavbar() {
  const navbar = document.querySelector<HTMLElement>('.navbar');
  const hamburger = document.querySelector<HTMLButtonElement>('.hamburger');
  const navLinks = document.querySelector<HTMLElement>('.nav-links');
  if (!navbar) return;

  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (hamburger && navLinks) {
    const setOpen = (open: boolean) => {
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
      if (!open) closeAllDropdowns();
    };
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!navLinks.classList.contains('open'));
    });
    navLinks.addEventListener('click', (e) => {
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.classList.contains('dropdown-toggle')) return;
      if (window.innerWidth <= MOBILE_BP) setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (window.innerWidth > MOBILE_BP) return;
      if (navbar.contains(e.target as Node)) return;
      setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { setOpen(false); closeAllDropdowns(); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > MOBILE_BP) setOpen(false); });
  }

  const closeAllDropdowns = () => {
    document.querySelectorAll<HTMLElement>('.dropdown[aria-expanded="true"]').forEach((d) => {
      d.setAttribute('aria-expanded', 'false');
      d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll<HTMLElement>('.dropdown').forEach((dd) => {
    const toggle = dd.querySelector<HTMLAnchorElement>('.dropdown-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', (e) => {
      // Mobile: first tap opens the accordion, second tap follows the link.
      if (window.innerWidth > MOBILE_BP) return;
      const open = dd.getAttribute('aria-expanded') === 'true';
      if (open) return;
      e.preventDefault();
      closeAllDropdowns();
      dd.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-expanded', 'true');
    });
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        dd.querySelector<HTMLAnchorElement>('.dropdown-menu a')?.focus();
      }
    });
  });

  // Active link
  const path = window.location.pathname.replace(/\/index$|\.html$/, '') || '/';
  document.querySelectorAll<HTMLAnchorElement>('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('http')) return;
    const clean = href.replace(/\.html$/, '') || '/';
    if (clean === path) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
      a.closest('.dropdown')?.classList.add('has-active');
    }
  });
}

function initSmoothAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    });
  });
}

function initReveal() {
  const selector = [
    '.fade-in', '[data-reveal]', '.card', '.impact-card', '.resource-card', '.scenario-card', '.story-card',
    '.feature-card', '.question-card', '.about-teaser', '.form-section', '.step', '.law-card',
    '.law-concern-card', '.law-provision', '.module-shell', '.module-content-card', '.module-check',
    '.module-form-card', '.module-level-gate', '.mission-card',
  ].join(',');
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  els.forEach((el, i) => {
    if (!el.hasAttribute('data-reveal')) el.classList.add('fade-in');
    if (!el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', `${Math.min((i % 6) * 40, 200)}ms`);
    }
  });
  // Parent-driven stagger overrides the default delay.
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((parent) => {
    const step = Number(parent.dataset.revealStagger) || 90;
    Array.from(parent.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--reveal-delay', `${i * step}ms`);
    });
  });
  // Cascade + word indexes.
  document.querySelectorAll<HTMLElement>('.cascade').forEach((p) => {
    Array.from(p.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i)));
  });
  const splitWords = () => document.querySelectorAll<HTMLElement>('[data-split-words]').forEach((el) => {
    if (el.dataset.split === 'done') return;
    const words = (el.textContent || '').trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const wrap = document.createElement('span'); wrap.className = 'w';
      const inner = document.createElement('span'); inner.textContent = w; inner.style.setProperty('--i', String(i));
      wrap.appendChild(inner); el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.dataset.split = 'done';
  });
  splitWords();
  document.addEventListener('onnoy:langchange', splitWords);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  els.forEach((el) => io.observe(el));

  // Safety net: nothing should stay hidden if the observer never fires.
  window.setTimeout(() => els.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  }), 1500);
  // Dynamically injected content (legacy course scripts) should also be visible.
  const mo = new MutationObserver(() => {
    document.querySelectorAll<HTMLElement>('.fade-in:not(.visible), [data-reveal]:not(.visible)').forEach((el) => {
      if (!els.includes(el)) el.classList.add('visible');
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

export function toast(message: string, kind: 'ok' | 'err' | 'info' = 'info', ms = 3200) {
  let region = document.querySelector<HTMLElement>('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }
  const el = document.createElement('div');
  el.className = `toast${kind === 'info' ? '' : ` toast--${kind}`}`;
  el.textContent = message;
  region.appendChild(el);
  window.setTimeout(() => el.remove(), ms);
}

function boot() {
  document.documentElement.classList.add('js-ready');
  initTheme();
  initLanguage();
  initNavbar();
  initSmoothAnchors();
  initReveal();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

// Expose a tiny API for legacy scripts.
(window as any).Onnoy = { t, toast, applyLanguage, currentLang };
