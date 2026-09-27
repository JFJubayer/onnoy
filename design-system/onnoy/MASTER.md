# Onnoy Design System

The implementation is the source of truth: **[src/styles/tokens.css](../../src/styles/tokens.css)**.
This document explains the intent behind those tokens. If the two disagree, fix the CSS and update this file.

## Brand direction

Trustworthy, warm, and youth-friendly. Deep greens (growth, calm) carry the brand; amber is
reserved for calls-to-action and the ChaBondhu community layer. Nothing "web3" — this is a
public-education initiative for Bangladeshi students, parents and teachers.

## Colour

| Role | Light | Dark | Token |
|---|---|---|---|
| Brand | `#059669` | `#34D399` | `--green` |
| Brand (deep) | `#064E3B` | `#022C22` | `--green-deep` |
| Brand tint | `#ECFDF5` | `#052E22` | `--green-pale` |
| Accent / CTA | `#F59E0B` | `#FBBF24` | `--amber` |
| Info | `#0284C7` | `#38BDF8` | `--sky` |
| Text | `#0F172A` | `#F1F5F9` | `--ink` |
| Muted text | `#475569` | `#CBD5E1` | `--ink-mid` |
| Page | `#F8FAFC` | `#060B14` | `--paper` |
| Surface | `#FFFFFF` | `#0F172A` | `--surface` |
| Border | `#E2E8F0` | `#1E293B` | `--border` |

Status colours (`--success`, `--caution`, `--warning`, `--danger`, `--info`) each have `-bg`
and `-fg` variants that stay readable in both themes. **Never hard-code hex values in
components** — use tokens so dark mode works for free.

## Typography

- **Headings:** Plus Jakarta Sans 600–800, tight tracking (`-0.02em`), `text-wrap: balance`.
- **Body:** Inter 400–700, `line-height: 1.65`.
- **Bangla:** Noto Sans Bengali is appended to both stacks; `:lang(bn)` bumps line-height to 1.8
  and removes negative tracking.
- Fluid sizes: `--fs-hero`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lead`.

Fonts are self-hosted via Astro's Fonts API (config in `astro.config.mjs`) — no Google Fonts
request at runtime.

## Spacing & layout

4-px scale `--s-1 … --s-12` (4 → 96 px). Sections use `--section-y` (clamp 56–96 px).
Containers: `--container` 1120 px (default), `--container-narrow` 760 px (long-form text),
`--container-wide` 1280 px (navbar). Gutter is `--gutter` (clamp 16–32 px).

## Shape & elevation

Radii: `--radius-sm` 8, `--radius` 14, `--radius-lg` 22, `--radius-xl` 32, `--radius-pill`.
Shadows: `--shadow-xs` (resting cards), `--shadow-soft`, `--shadow` (hover), `--shadow-lg`
(modals), `--shadow-brand` (primary buttons).

## Components

Defined in `src/styles/components/`:

| File | Provides |
|---|---|
| `navbar.css` | `.navbar`, `.nav-links`, `.dropdown`, `.nav-cta`, `.nav-auth-link`, mobile drawer ≤ 960 px |
| `buttons.css` | `.btn` + `.btn-green/.btn-amber/.btn-secondary/.btn-ghost/.btn-outline`, sizes `.btn-sm/.btn-lg`, `.btn-chabondhu` |
| `hero.css` | `.hero`, `.hero--page`, `.home-hero`, `.hero-split`, `.stat-bar` |
| `cards.css` | `.card`, `.card--accent`, `.badge`, `.impact-*`, `.chabondhu-card`, `.process-steps`, `.alert` |
| `forms.css` | `.form-control`, `.form-grid`, `.form-section`, `.auth-card` |
| `footer.css` | `.site-footer`, `.whatsapp-float`, `.toast` |

Page-specific CSS lives in `src/styles/pages/*.css` and is imported only by that page.

## Motion

`--dur-fast` 150 ms, `--dur` 240 ms, `--dur-slow` 480 ms with `--ease-out`. Reveal-on-scroll
uses `.fade-in` + `.visible`; content is visible without JS and under
`prefers-reduced-motion`.

## Accessibility baseline

- Visible focus ring on every interactive element (`:focus-visible`).
- Skip link, `aria-current="page"` on active nav, `aria-expanded` on toggles.
- Colour contrast ≥ 4.5:1 for body text in both themes.
- Icons are `aria-hidden`; link text is always present (visually hidden if needed).
