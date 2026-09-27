# Agent notes for Onnoy

Read `README.md` first. Key rules for automated edits:

- **One layout.** Every page is `src/pages/*.astro` wrapping content in `<BaseLayout title= description=>`.
  Never add `<head>`, navbar, footer or `<script src="…main.js">` to a page.
- **Clean URLs.** Link to `/about`, never `about.html`. `trailingSlash: 'never'`.
- **Styling.** Use tokens from `src/styles/tokens.css`; add component rules to
  `src/styles/components/*.css`, page-only rules to `src/styles/pages/<page>.css` imported by that page.
  No new inline `style=""` in Astro templates unless it's a per-item CSS variable (e.g. `--card-accent`).
- **Supabase.** Import `{ supabase }` from `@lib/supabase` in TS; legacy inline scripts use
  `window.supabaseClient` (already set). Admin gating is `profiles.role === 'admin'` via RLS —
  never a hardcoded e-mail list. New tables need a migration in `supabase/migrations/NNN_*.sql`
  with RLS enabled and policies.
- **Legacy JS** in `public/assets/js/` is loaded with `<script is:inline src>` and relies on globals
  (`ONNOY_COURSES`, `renderBadgesDisplay`, …). Keep it working; migrate incrementally.
- **i18n.** UI strings live in `src/data/translations.ts` and are applied to `[data-i18n]` elements.
- **Verify** with `npm run check` and `npm run build`; visually with `scripts/shot.sh /route`.
- Do not commit `.env`, `dist/`, or push to remote without the maintainer's explicit go-ahead.
