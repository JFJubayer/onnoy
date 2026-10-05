import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';
import sharp from 'sharp';

async function loadSource(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}

async function collectRoutes(directory, prefix = '') {
  const routes = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) routes.push(...await collectRoutes(join(directory, entry.name), `${prefix}/${entry.name}`));
    else if (entry.name.endsWith('.astro')) routes.push(entry.name === 'index.astro' ? prefix || '/' : `${prefix}/${entry.name.slice(0, -6)}`);
  }
  return routes;
}

const { getPageGuide } = await loadSource('../src/data/site-guide.ts');
const { translations } = await loadSource('../src/data/translations.ts');
const routes = await collectRoutes(fileURLToPath(new URL('../src/pages/', import.meta.url)));

test('every current page has a contextual introduction', () => {
  assert.ok(routes.length > 0);
  for (const route of routes) {
    const guide = getPageGuide(route);
    assert.ok(guide.steps.length >= 2, route);
    assert.notEqual(guide.steps[0].title, 'guide-page-title', route);
  }
});

test('all guide content is available in English and Bangla', () => {
  for (const route of routes) {
    for (const step of getPageGuide(route).steps) {
      for (const key of [step.title, step.body, step.action].filter(Boolean)) {
        assert.ok(translations[key]?.en.trim(), `${route}: English ${key}`);
        assert.ok(translations[key]?.bn.trim(), `${route}: Bangla ${key}`);
      }
    }
  }
});

test('guide actions stay on existing local routes', () => {
  for (const route of routes) {
    for (const step of getPageGuide(route).steps) {
      if (!step.href) continue;
      assert.ok(step.href.startsWith('/') && !step.href.startsWith('//'), route);
      const destination = new URL(step.href, 'https://onnoy.example');
      assert.equal(destination.origin, 'https://onnoy.example');
      assert.ok(routes.includes(destination.pathname), `${route}: ${destination.pathname}`);
      assert.ok(step.action);
    }
  }
});

test('sensitive and focused pages are manual-only', () => {
  for (const route of ['/support', '/login', '/register', '/profile', '/admin-portal', ...routes.filter((route) => route.startsWith('/courses/'))]) {
    assert.equal(getPageGuide(route).auto, false, route);
  }
  assert.equal(getPageGuide('/workbooks').auto, true);
});

test('clean URLs and legacy HTML URLs share guide content', () => {
  for (const route of routes.filter((route) => route !== '/')) {
    assert.deepEqual(getPageGuide(`${route}.html`), getPageGuide(route));
    assert.deepEqual(getPageGuide(`${route}/`), getPageGuide(route));
  }
});

test('new routes still receive a usable fallback', () => {
  const guide = getPageGuide('/a-future-page');
  assert.equal(guide.steps.length, 2);
  assert.ok(guide.steps.every((step) => translations[step.title] && translations[step.body]));
});

test('tutorial presentation preserves accessible non-modal tour controls', async () => {
  const markup = await readFile(new URL('../src/components/SiteGuide.astro', import.meta.url), 'utf8');
  assert.match(markup, /role="dialog" aria-modal="false"/);
  assert.match(markup, /class="site-guide__stage" aria-hidden="true"/);
  assert.match(markup, /class="site-guide__bubble"/);
  assert.match(markup, /id="siteGuidePointer"[^>]*aria-hidden="true" hidden/);
  for (const control of ['Launcher', 'Back', 'Next', 'Skip', 'Close', 'Restart', 'SettingsToggle', 'Auto']) {
    assert.ok(markup.includes(`id="siteGuide${control}"`), control);
  }
});

test('both character expressions are web-ready transparent images', async () => {
  const expressions = [];
  for (const expression of ['open', 'blink']) {
    const path = new URL(`../public/assets/images/guide/bindu-${expression}.webp`, import.meta.url);
    const bitmap = await readFile(path);
    expressions.push(bitmap);
    const image = await sharp(bitmap).metadata();
    assert.equal(image.format, 'webp');
    assert.equal(image.width, 512);
    assert.equal(image.height, 512);
    assert.equal(image.hasAlpha, true);
    const { channels } = await sharp(bitmap).stats();
    assert.equal(channels[3].min, 0);
    assert.equal(channels[3].max, 255);
  }
  assert.equal(expressions[0].equals(expressions[1]), false);
});