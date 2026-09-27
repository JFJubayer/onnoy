/** Home page impact counters: static fallback → live Supabase values → count-up. */
import { supabase } from '@lib/supabase';

const section = document.querySelector<HTMLElement>('[data-impact]');
if (section) {
  const counters = Array.from(section.querySelectorAll<HTMLElement>('.impact-number'));
  const updated = section.querySelector<HTMLElement>('[data-impact-updated]');
  let started = false;

  const animate = (el: HTMLElement, target: number, suffix: string) => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.textContent = target + suffix; return; }
    const duration = 1100;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const startCounting = () => {
    if (started) return;
    started = true;
    counters.forEach((c) => animate(c, Number(c.dataset.target) || 0, c.dataset.suffix || ''));
  };

  const apply = (data: Record<string, unknown>) => {
    counters.forEach((c) => {
      const v = data[c.dataset.key || ''];
      if (typeof v === 'number') {
        c.dataset.target = String(v);
        if (started) c.textContent = v + (c.dataset.suffix || '');
      }
    });
    if (updated && typeof data.last_updated === 'string') updated.textContent = data.last_updated;
  };

  // Cached copy (set by admin portal in another tab, or a previous visit).
  try {
    const cached = localStorage.getItem('onnoy_impact_stats');
    if (cached) apply(JSON.parse(cached));
  } catch {}

  if (supabase) {
    supabase.from('impact_stats').select('sessions, students, citizens, guardians, last_updated').eq('id', 1).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) return;
        apply(data as Record<string, unknown>);
        localStorage.setItem('onnoy_impact_stats', JSON.stringify(data));
      });
  }
  window.addEventListener('storage', (e) => {
    if (e.key === 'onnoy_impact_stats' && e.newValue) { try { apply(JSON.parse(e.newValue)); } catch {} }
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { startCounting(); obs.disconnect(); } });
  }, { threshold: 0.3 });
  io.observe(section);
  window.setTimeout(() => {
    const r = section.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) startCounting();
  }, 1200);
}
