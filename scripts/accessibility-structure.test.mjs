import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

async function collectAstro(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectAstro(path));
    else if (entry.name.endsWith('.astro')) files.push(path);
  }
  return files;
}

const pages = await collectAstro(fileURLToPath(new URL('../src/pages/', import.meta.url)));

test('every page exposes exactly one source-level main ownership strategy', async () => {
  for (const path of pages) {
    const source = await readFile(path, 'utf8');
    const ownsMain = /<main\b/.test(source) || /role="main"/.test(source);
    const wrapsMain = /<BaseLayout\b[^>]*\bwrapMain\b/.test(source);
    assert.ok(ownsMain || wrapsMain, `${path}: missing main landmark`);
    assert.equal(ownsMain && wrapsMain, false, `${path}: nested main ownership`);
    if (wrapsMain) assert.doesNotMatch(source, /id="main"/, `${path}: duplicate skip target`);
  }
});

test('authentication and guide signup fields have explicit labels', async () => {
  const [login, register, guide] = await Promise.all([
    readFile(new URL('../src/pages/login.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/register.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/facilitator-guide.astro', import.meta.url), 'utf8'),
  ]);
  for (const source of [login, register]) {
    assert.match(source, /<label for="email"/);
    assert.match(source, /<label for="password"/);
  }
  assert.match(guide, /<label for="guide-email"/);
  assert.match(guide, /id="guide-email"/);
});

test('shared actions and resource pathways use semantic canonical controls', async () => {
  const [auth, home, library] = await Promise.all([
    readFile(new URL('../src/scripts/auth-nav.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/resources-library.astro', import.meta.url), 'utf8'),
  ]);
  assert.match(auth, /<button type="button" id="navSignOutBtn"/);
  assert.doesNotMatch(auth, /<a href="#" id="navSignOutBtn"/);
  assert.doesNotMatch(home, /<a[^>]+class="stat-item"/);
  assert.match(library, /class="resource-workbooks-gateway"/);
  assert.doesNotMatch(library, /\/assets\/docs\/Onima_Complete|\/assets\/docs\/Onnoy-/);
});

test('support fallback copy describes limited access without absolute promises', async () => {
  const support = await readFile(new URL('../src/pages/support.astro', import.meta.url), 'utf8');
  assert.match(support, /<BaseLayout\b[^>]*\bhideFloating\b/);
  assert.match(support, /limited to authorized Onnoy administrators/);
  assert.doesNotMatch(support, /everything you share stays between us/i);
});

test('donation choices expose analytics for hosted and manual support', async () => {
  const [page, controller] = await Promise.all([
    readFile(new URL('../src/pages/donate.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/direct-donation.ts', import.meta.url), 'utf8'),
  ]);
  assert.match(page, /data-donation-option="chabondhu"/);
  assert.match(controller, /donation_option_select/);
  assert.match(controller, /trackOption\('manual'\)/);
});

test('login and registration share allowlisted Google and Facebook OAuth', async () => {
  const [login, register, component, controller, experience, interaction, styles] = await Promise.all([
    readFile(new URL('../src/pages/login.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/register.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/OAuthButtons.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/oauth-auth.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/AuthExperience.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/auth-experience.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/components/auth-experience.css', import.meta.url), 'utf8'),
  ]);
  assert.match(login, /<OAuthButtons\s*\/?>/);
  assert.match(register, /<OAuthButtons\s*\/?>/);
  assert.match(login, /<AuthExperience mode="login"/);
  assert.match(register, /<AuthExperience mode="register"/);
  assert.match(login, /<BaseLayout\b[^>]*\bhideFloating\b/);
  assert.match(register, /<BaseLayout\b[^>]*\bhideFloating\b/);
  assert.match(component, /data-oauth-root hidden/);
  assert.match(component, /data-oauth-provider="google"/);
  assert.match(component, /data-oauth-provider="facebook"/);
  assert.doesNotMatch(component, /client.?secret|access.?token/i);
  assert.match(controller, /new Set\(\['google', 'facebook'\]\)/);
  assert.match(controller, /\/auth\/v1\/settings/);
  assert.match(controller, /button\.hidden = !enabledProviders\.has\(provider\)/);
  assert.match(controller, /signInWithOAuth/);
  assert.match(controller, /redirectTo: `\$\{window\.location\.origin\}\/login`/);
  assert.match(experience, /data-auth-mascot/);
  assert.match(experience, /onima-open\.webp/);
  assert.match(experience, /onima-blink\.webp/);
  assert.match(experience, /data-auth-switch/);
  assert.match(interaction, /data-auth-expression/);
  assert.match(interaction, /'private'/);
  assert.match(interaction, /sessionStorage\.setItem\('onnoy_auth_transition'/);
  assert.match(styles, /auth-experience--register/);
  assert.match(styles, /prefers-reduced-motion/);
});

test('resource library supports search and category filtering without hiding source content', async () => {
  const [page, controls, controller] = await Promise.all([
    readFile(new URL('../src/pages/resources-library.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/ResourceLibraryControls.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/resource-library.ts', import.meta.url), 'utf8'),
  ]);
  assert.match(page, /<ResourceLibraryControls\s*\/?>/);
  assert.equal((page.match(/data-resource-section=/g) || []).length, 4);
  assert.match(controls, /id="resourceSearch"/);
  assert.match(controls, /id="resourceResultsStatus"[^>]*role="status"/);
  assert.equal((controls.match(/data-resource-filter=/g) || []).length, 5);
  assert.match(controller, /\[data-resource-section\]/);
  assert.match(controller, /card\.hidden =/);
  assert.match(controller, /section\.hidden =/);
});

test('focused workflows use compact chrome and support stays comfortably readable', async () => {
  const [layout, footer, login, register, assessment, support, supportStyles] = await Promise.all([
    readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/Footer.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/login.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/register.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/quiz.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/support.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/pages/support.css', import.meta.url), 'utf8'),
  ]);
  assert.match(layout, /compactFooter\?: boolean/);
  assert.match(layout, /<Footer compact=\{compactFooter\}/);
  assert.match(footer, /site-footer--compact/);
  for (const page of [login, register, assessment]) assert.match(page, /<BaseLayout\b[^>]*\bcompactFooter\b/);
  assert.match(support, /class="container section-gap support-content"/);
  assert.match(supportStyles, /\.support-content\s*\{[^}]*max-width:\s*760px/s);
});

test('repeated public UI is owned by shared design-system components', async () => {
  const [workbooks, badges, login, register] = await Promise.all([
    readFile(new URL('../src/pages/workbooks.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/badges.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/login.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/register.astro', import.meta.url), 'utf8'),
  ]);
  assert.match(workbooks, /import PublicationCard from '@components\/PublicationCard\.astro'/);
  assert.match(workbooks, /publications\.map\(\(publication\) => <PublicationCard/);
  assert.doesNotMatch(workbooks, /class="workbook-card"/);
  assert.doesNotMatch(workbooks, /style="/);
  assert.match(badges, /import BadgeCriteriaCard from '@components\/BadgeCriteriaCard\.astro'/);
  assert.match(badges, /badgeTiers\.map\(\(badge\) => <BadgeCriteriaCard/);
  assert.doesNotMatch(badges, /class="badge-sample-card"/);
  assert.doesNotMatch(badges, /style="/);
  for (const page of [login, register]) {
    assert.match(page, /<AuthExperience/);
    assert.match(page, /<StatusMessage/);
    assert.doesNotMatch(page, /style="/);
  }
  assert.match(badges, /<StatusMessage/);
});