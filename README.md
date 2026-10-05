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
| Public forms | Supabase Edge Function + private request/subscriber tables |
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
supabase/migrations/         001–007 SQL, run in order in the Supabase SQL editor
supabase/functions/          public-forms intake, validation, optional staff email alerts
scripts/                     one-off migration + tooling helpers (see below)
design-system/onnoy/MASTER.md  design intent; tokens.css is the source of truth
```

## Supabase setup

1. Create a project; copy URL + anon key into `.env`.
2. Run `supabase/migrations/001…007` in order in the SQL editor.
3. Promote an admin: `update public.profiles set role = 'admin' where email = 'you@example.com';`
   (only admins can change roles — enforced by a trigger).
4. Storage buckets `avatars` and `mission-screenshots` are created by migration 003.

Tables: `profiles`, `submissions`, `impact_stats` (home page numbers), `download_leads`
(workbook unlock form), `public_requests`, `guide_subscribers`, and backend-only
`public_form_rate_limits`. Public badge lookup uses the `verify_badge(text)` RPC so
e-mails are never exposed.

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
| `npm run test:forms` | Public-form validation, endpoint behavior, and isolated PostgreSQL permission tests |
| `npm run test:guide` | Whole-site guide coverage, translations, route safety, and character assets |
| `npm run guide:assets` | Regenerate Bindu's original transparent character and blink images |
| `npm run publications:donation` | Append or refresh the donation closing page in the published PDFs |
| `npm run publications:brain-reset` | Rebuild the revised Brain Reset PDF and cover from its original HTML/artwork |
| `SRC=path npm run optimize:images` | Re-encode a folder of source rasters → `public/assets/images` (+ .webp) |
| `scripts/shot.sh /route …` | Desktop + mobile screenshots to `/tmp/onnoy-shots` (needs Chrome) |

### Homepage opening

The homepage uses a silent crop of `Documents/onnoy_animation.mp4`, approximately
1.4-7.7 seconds from the original. The published H.264 clip is 6.33 seconds and
about 447 KB, stored with its poster in `public/assets/videos/`.

`OpeningIntro.astro` and `src/scripts/opening-intro.ts` play it once per tab on `/`.
Visitors can click or tap anywhere, or use Escape/Enter/Space, to skip. It closes
automatically at the end and restores page focus and interaction. Reduced-motion
preferences, rejected playback, and a timeout keep the homepage accessible; deep
links and pages without JavaScript are not blocked. The Documents original is unchanged.

### Bindu page guide

Bindu is a scripted, bilingual character guide, not an AI chat service. Every current
page has an introduction through `src/data/site-guide.ts`, with UI copy in
`src/data/translations.ts`. The shared `SiteGuide.astro` supplies the launcher and
non-modal panel; `src/scripts/site-guide.ts` handles steps, highlighting, skip,
resume, restart, and preferences. Lucide icons provide the control symbols.

Introductions appear once per page per tab, after the opening animation. Visitors
can skip them, reopen the character, restart a page tour, or disable automatic
introductions. Support, account, admin, and course-player pages remain manual-only.
The guide pauses for native dialogs, full-screen media, and an open mobile menu.
Its animation respects reduced-motion preferences and does not block page use.

Only guide preferences and route progress are stored in the visitor's browser.
The guide does not read form answers, contact a model API, or alter account/RLS
permissions. Clearing browser storage resets its preferences. Character assets
are original WebP images generated by `scripts/generate-guide-character.mjs`.

Run `npm run test:guide`, `npm run check`, and `npm run build` after changing guide
content or controls. Browser checks should also cover skip/reopen, next/back,
language changes, small screens, blocked storage, intro timing, and reader dialogs.

### Public forms and admin inbox

Session requests, fact-checks, confidential support messages, and facilitator-guide
signups use `PublicForm.astro` and the `public-forms` Edge Function. No visitor account
is required. The function validates and bounds input, checks a honeypot, rate-limits
accepted attempts to 10 per connection per 15 minutes, and writes with its server-only
Supabase key. IP addresses are stored only as keyed hashes and expired after one day.
Anonymous and ordinary signed-in clients cannot read or insert request rows directly.

Admin Portal -> Requests provides type/status/search filters, 25-row pages, private
details, admin assignment, team notes, and optimistic-concurrency checks when saving.
Admin Portal -> Guide signups is separate from support cases. CSV exports respect the
active filters, exclude private case messages/team notes, and require narrowing filters
above 5,000 records. Support data is available only to authorized administrators; use
individual admin accounts, keep that group small, and handle exports as private data.

Activate the backend **before deploying the frontend**:

1. Run `supabase/migrations/007_public_forms.sql` in the configured project's SQL editor.
2. Authenticate locally with `npx supabase login`, then deploy:

  ```bash
  npx supabase functions deploy public-forms --project-ref YOUR_PROJECT_REF
  ```

3. Set `FORMS_ALLOWED_ORIGINS` in the function's secrets if using another domain or a
  preview deployment. It is a comma-separated allowlist of exact origins. The hosted
  default is `https://onnoy.vercel.app`; local Deno runs also allow ports 4321 and 4322.
  Origin checks are not a substitute for the function's rate limits or CAPTCHA.
4. For CAPTCHA, set `TURNSTILE_SECRET_KEY` as a function secret and the matching
  `PUBLIC_TURNSTILE_SITE_KEY` in the frontend environment, then rebuild. Only allow
  the site's actual hostnames in Turnstile. Without these settings, server-side
  validation, the honeypot, and rate limits still apply.
5. For staff email alerts, set `RESEND_API_KEY`, `FORMS_EMAIL_FROM` (a verified sender),
  and `FORMS_NOTIFY_EMAIL` as function secrets. Alerts contain a receipt and admin
  link, not the confidential submission. Storage succeeds even if an alert fails;
  its delivery state appears in the admin inbox. Email alert settings are optional.

Keep privileged keys and all email/CAPTCHA secrets out of `PUBLIC_*` variables and
Git. `FORMS_RATE_LIMIT_SECRET` can supply a dedicated stable hashing secret; otherwise
the function uses its server-only Supabase key. Changing that secret resets rate buckets.

The portal's Email/Call actions open the administrator's mail/phone application.
Marking a guide signup as notified records a manual action; it does not send a campaign.
Subscriber announcements and automated sender confirmations are not implemented.
Existing Formspree submissions are not copied or deleted by this migration: export/import
historical records separately before retiring the old account.

The forms retain a native POST/redirect path when JavaScript is disabled. JavaScript
adds bilingual success/error feedback, preserves entries on failure, and keeps the same
request receipt when retrying an unchanged submission. A success message is shown only
after the backend confirms storage. SQL tests run in an isolated PGlite database and
never insert test records into the hosted project.

Type-check the Edge Function separately from Astro:

```bash
npx deno check --config supabase/functions/deno.json supabase/functions/public-forms/index.ts
```

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

Pass a catalog PDF path to update only that publication:

```bash
npm run publications:donation -- /assets/docs/Brain_Reset_Booklet_Publishable.pdf
```

### Brain Reset booklet

The revised Brain Reset edition preserves the original illustrations, uses clearer
educational wording, and includes a seven-day worksheet plus evidence/support notes.
It has 11 content pages; the shared sponsorship closing page makes 12 published pages.
The original Downloads PDF and artwork are not modified.

Rebuild with `npm run publications:brain-reset`, then run the single-publication
donation command above. The publisher defaults to the original HTML under
`~/Downloads/brain_reset_assets/brain_reset_booklet.html`; pass another source HTML
path as its first argument when needed. Local illustration URLs in that HTML must
remain available. The publisher embeds compressed illustrations, validates page fit,
and generates the website cover from the finished PDF's first page.

## Deployment

Vercel detects Astro automatically. `vercel.json` adds security headers, long-cache for
`/assets`, and 301s from every old `*.html` URL to its clean-URL equivalent.

## Contributing

Keep the no-dependency philosophy: tokens over hex codes, components over inline styles, RLS
over client-side checks. Run `npm run check` and `npm run build` before opening a PR.
