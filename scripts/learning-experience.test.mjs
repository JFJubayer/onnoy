import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

async function loadSource(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}

async function loadLegacyLessons() {
  const source = await readFile(new URL('../public/assets/js/module-course.js', import.meta.url), 'utf8');
  const start = source.indexOf('const courseLessons =');
  const end = source.indexOf('\n\nconst missions =');
  assert.ok(start >= 0 && end > start, 'courseLessons declaration');
  const context = {};
  vm.runInNewContext(source.slice(start, end).replace('const courseLessons =', 'globalThis.courseLessons ='), context);
  return { lessons: context.courseLessons, source };
}

const { assessmentDomains, assessmentQuestions } = await loadSource('../src/data/self-assessment.ts');
const { missionFallbacks } = await loadSource('../src/data/mission-fallbacks.ts');

test('all five lessons teach through objectives, decisions, and explanations', async () => {
  const { lessons, source } = await loadLegacyLessons();
  assert.deepEqual(Object.keys(lessons), ['overview', 'attention', 'misinformation', 'scams', 'ai']);
  for (const [key, lesson] of Object.entries(lessons)) {
    assert.equal(lesson.objectives.length, 3, `${key}: objectives`);
    for (const objective of lesson.objectives) {
      assert.ok(objective.en.trim() && objective.bn.trim(), `${key}: bilingual objective`);
    }
    assert.equal(lesson.scenario.options.length, 3, `${key}: scenario options`);
    assert.deepEqual(new Set(lesson.scenario.options.map((option) => option.impact)), new Set(['strong', 'partial', 'risky']), `${key}: scenario consequences`);
    for (const option of lesson.scenario.options) {
      assert.ok(option.text.trim() && option.textBn.trim(), `${key}: bilingual scenario option`);
      assert.ok(option.feedback.length > 40 && option.feedbackBn.length > 30, `${key}: meaningful scenario feedback`);
    }
    assert.ok(lesson.checks.length >= 2, `${key}: checks`);
    for (const check of lesson.checks) {
      assert.equal(check.options.filter(([, correct]) => correct).length, 1, `${key}: one supported answer`);
      assert.ok(check.hint.trim() && check.hintBn.trim(), `${key}: retry hint`);
      assert.ok(check.explanation.length > 40 && check.explanationBn.length > 30, `${key}: answer explanation`);
    }
  }
  assert.match(source, /module-presentation/);
  assert.match(source, /module-scenario/);
  assert.match(source, /module-reflection/);
  assert.match(source, /shuffledLessonOptions/);
});

test('self-assessment balances ten learning scenarios across five domains', () => {
  assert.equal(assessmentQuestions.length, 10);
  assert.equal(new Set(assessmentQuestions.map((question) => question.id)).size, 10);
  const domainCounts = Object.fromEntries(Object.keys(assessmentDomains).map((key) => [key, 0]));
  const strongestPositions = new Set();
  for (const question of assessmentQuestions) {
    domainCounts[question.domain]++;
    assert.ok(question.scenario.en.trim() && question.scenario.bn.trim(), `${question.id}: bilingual scenario`);
    assert.equal(question.options.length, 4, `${question.id}: options`);
    strongestPositions.add(question.options.findIndex((option) => option.score === 3));
    assert.deepEqual(new Set(question.options.map((option) => option.score)), new Set([0, 1, 2, 3]), `${question.id}: graduated choices`);
    for (const option of question.options) {
      assert.ok(option.text.en.trim() && option.text.bn.trim(), `${question.id}: bilingual option`);
      assert.ok(option.feedback.en.length > 40 && option.feedback.bn.length > 30, `${question.id}: teaching feedback`);
    }
  }
  assert.ok(Object.values(domainCounts).every((count) => count === 2), domainCounts);
  assert.ok(strongestPositions.size >= 3, 'strongest answer position varies');
});

test('assessment page uses the reusable controller and local-only result summary', async () => {
  const [page, controller, styles] = await Promise.all([
    readFile(new URL('../src/pages/quiz.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/self-assessment.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/pages/quiz.css', import.meta.url), 'utf8'),
  ]);
  for (const id of ['assessmentIntro', 'assessmentQuiz', 'assessmentOptions', 'assessmentFeedback', 'assessmentResults', 'assessmentDomainResults', 'assessmentReview']) {
    assert.match(page, new RegExp(`id="${id}"`), id);
  }
  assert.match(page, /import '@scripts\/self-assessment'/);
  assert.doesNotMatch(page, /onclick=|const questions\s*=/);
  assert.match(controller, /onnoy_self_assessment_v2/);
  assert.match(controller, /assessment-active/);
  assert.doesNotMatch(controller, /supabase|fetch\(/i);
  assert.match(styles, /@media \(max-width: 420px\)/);
  assert.match(styles, /prefers-reduced-motion/);
});

test('lesson hub keeps progress on the five canonical lesson cards', async () => {
  const [page, controller] = await Promise.all([
    readFile(new URL('../src/pages/modules.astro', import.meta.url), 'utf8'),
    readFile(new URL('../public/assets/js/module-course.js', import.meta.url), 'utf8'),
  ]);
  assert.equal((page.match(/data-lesson-card=/g) || []).length, 5);
  assert.equal((page.match(/data-lesson-status/g) || []).length, 5);
  assert.doesNotMatch(page, /id="courseProgress"/);
  assert.match(page, /id="courseProgressAnchor"/);
  assert.match(controller, /querySelectorAll\('\[data-lesson-card\]'\)/);
  assert.match(controller, /is-complete/);
  assert.match(controller, /courseProgressAnchor/);
});

test('all four missions provide meaningful server-rendered fallbacks', async () => {
  assert.deepEqual(Object.keys(missionFallbacks), ['spotLie', 'scamAlert', 'aiIntegrity', 'guardian']);
  for (const [key, mission] of Object.entries(missionFallbacks)) {
    assert.ok(mission.summary.length > 60, `${key}: summary`);
    assert.ok(mission.steps.length >= 3, `${key}: steps`);
    assert.ok(mission.privacy.length > 40, `${key}: privacy`);
  }
  const component = await readFile(new URL('../src/components/MissionFallback.astro', import.meta.url), 'utf8');
  assert.match(component, /data-mission-fallback/);
  assert.match(component, /<noscript>/);
  for (const route of ['spot-the-lie', 'scam-alert', 'ai-integrity', 'digital-guardian']) {
    const page = await readFile(new URL(`../src/pages/mission-${route}.astro`, import.meta.url), 'utf8');
    assert.match(page, /<MissionFallback mission=\{mission\}/, route);
    assert.match(page, /data-mission=/, route);
  }
});