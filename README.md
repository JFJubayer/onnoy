# Onnoy-অন্বয়

**Empowering Independent Thinkers** — a bilingual (English/Bangla) digital-responsibility
education platform for Bangladesh's students, parents and teachers. Youth-led, volunteer-run,
based in Mymensingh.

Live: https://onnoy.vercel.app

## Stack

| Layer | Tech |
|---|---|
| Site | [Astro 7](https://astro.build) (static output), vanilla TypeScript, hand-written CSS with design tokens |
| Auth + data | [Supabase](https://supabase.com) (Postgres + Auth + Storage, RLS-enforced) |
| Public forms | Formspree (contact, session request, fact-check) |
| Hosting | Vercel |

No frameworks, no Tailwind, no Flask. One layout, one stylesheet entry, one Supabase client.

## Quick start

```bash
npm install
cp .env.example .env        # fill in PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY
npm run dev                 # http://localhost:4321
npm run build && npm run preview
```

Node ≥ 22.12 is required (see `engines` in `package.json`).

## Project layout

```
astro.config.mjs        site URL, fonts, sitemap
src/
  layouts/BaseLayout.astro   <head> (SEO/OG/JSON-LD), theme pre-paint, Navbar, Footer, scripts
  components/                Navbar, Footer, PageHero, WhatsAppFloat
  pages/                     one .astro per route (clean URLs, no .html)
  scripts/                   site.ts (theme/lang/nav/reveal), auth-nav.ts, impact.ts
  lib/supabase.ts            the single Supabase client + isAdminUser()
  data/site.ts               nav + footer + constants;  data/translations.ts  EN/BN strings
  styles/                    tokens.css → base.css → components/*.css ; pages/*.css per page
  assets/images/             images processed by <Image /> at build time
public/
  assets/docs/               workbook PDFs
  assets/images/             optimized rasters referenced by legacy scripts/CSS
  assets/js/                 legacy course engine (course-data, course-player, module-course, …)
supabase/migrations/         001–006 SQL, run in order in the Supabase SQL editor
scripts/                     one-off migration + tooling helpers (see below)
design-system/onnoy/MASTER.md  design intent; tokens.css is the source of truth
```

## Supabase setup

1. Create a project; copy URL + anon key into `.env`.
2. Run `supabase/migrations/001…006` in order in the SQL editor.
3. Promote an admin: `update public.profiles set role = 'admin' where email = 'you@example.com';`
   (only admins can change roles — enforced by a trigger).
4. Storage buckets `avatars` and `mission-screenshots` are created by migration 003.

Tables: `profiles`, `submissions`, `impact_stats` (home page numbers), `download_leads`
(workbook unlock form). Public badge lookup uses the `verify_badge(text)` RPC so e-mails are
never exposed.

## Content editing

- **Nav / footer links:** `src/data/site.ts`
- **EN/BN UI strings:** `src/data/translations.ts` (mark elements with `data-i18n="key"`)
- **Course + quiz content:** `public/assets/js/course-data.js`, `public/assets/js/module-course.js`
- **Impact numbers:** Admin portal → Impact tab (writes `impact_stats`)
- **Images:** drop originals in `src/assets/images/` and use `<Image />`; anything referenced by
  legacy JS goes in `public/assets/images/`

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `preview` | Astro |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run publications:donation` | Append or refresh the donation closing page in the four downloadable PDFs |
| `SRC=path npm run optimize:images` | Re-encode a folder of source rasters → `public/assets/images` (+ .webp) |
| `scripts/shot.sh /route …` | Desktop + mobile screenshots to `/tmp/onnoy-shots` (needs Chrome) |

### Publication donation pages

Workbook covers, Read Online, and Download actions require the shared reader form with
full name, school/institution, exact age, and district. Downloads then continue to `/donate`;
giving through ChaBondhu is optional. Direct donation-page PDF actions require the same
details, with completed access remembered for that PDF and action in the current session.
Apply migration `006_reader_access_details.sql` before deploying this form to save its
new fields in Supabase. Admin reader records and CSV exports include these fields.
The public PDFs remain static assets; the form gates the website workflow, not shared
direct file URLs. A private server-side file endpoint is needed for tamper-proof access.
PDF links include a content hash so updated publications bypass older cached copies.
The page also supplies a bilingual, print-only closing page with a clickable donation link
and QR code for the published PDFs listed in `src/data/publications.json`.

With the dev server running, use `npm run publications:donation` to update the actual
files in `public/assets/docs/`. The script preserves the original pages and page sizes,
replaces an existing generated closing page rather than adding duplicates, and verifies
the donation annotation and QR decoded from every finished PDF's last page. Originals
and preview images are retained in a temporary directory. Requires Google Chrome and
Poppler's `pdftoppm`; set `BASE` or `CHROME_PATH` when using a non-default server or browser.

## Deployment

Vercel detects Astro automatically. `vercel.json` adds security headers, long-cache for
`/assets`, and 301s from every old `*.html` URL to its clean-URL equivalent.

## Contributing

Keep the no-dependency philosophy: tokens over hex codes, components over inline styles, RLS
over client-side checks. Run `npm run check` and `npm run build` before opening a PR.
