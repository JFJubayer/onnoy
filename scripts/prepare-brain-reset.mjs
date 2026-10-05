import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PDFDocument } from 'pdf-lib';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const sourcePath = resolve(process.argv[2] ?? join(homedir(), 'Downloads/brain_reset_assets/brain_reset_booklet.html'));
const outputPath = resolve('public/assets/docs/Brain_Reset_Booklet_Publishable.pdf');
const coverPath = resolve('public/assets/images/covers/cover-brain-reset.webp');
const temporaryDir = await mkdtemp(join(tmpdir(), 'onnoy-brain-reset-'));
const chromePath = process.env.CHROME_PATH ?? execFileSync('which', ['google-chrome'], { encoding: 'utf8' }).trim();

const chapters = [
  {
    topic: 'A calmer workspace',
    title: 'Give your phone a place to rest',
    insight: 'A useful experiment, not a universal rule',
    explanation: 'In laboratory experiments, some participants performed better on cognitive tests when their phone was in another room [1]. That does not mean a visible phone lowers everyone\'s ability. Try changing its location and notice whether it helps you.',
    action: 'Make the next step easier',
    steps: ['Choose one short study task. Put your phone in a bag, drawer, or another room if it is safe to do so.', 'If your phone is your study device, open only the material you need and pause non-essential alerts. Keep emergency and accessibility functions available.'],
    note: 'Notice the urge to check your phone. You do not have to judge yourself for having it.',
    prompt: 'After the session, compare how often you checked your phone and how much of the task you completed.',
    reset: 'One task, fewer cues. Start with a session you can realistically complete.',
  },
  {
    topic: 'Time with other people',
    title: 'Make room for the conversation',
    insight: 'Presence is a shared choice',
    explanation: 'A phone within reach makes it easier to interrupt a conversation. Different people have different expectations. Agreeing on phone-free time is a courtesy, not a test of someone\'s character or trustworthiness.',
    action: 'Agree on a small boundary',
    steps: ['At a meal, study group, or meeting, ask whether everyone would like to put their phones aside for a while.', 'If you need a device for communication, care responsibilities, or an urgent call, explain that need. A useful boundary includes exceptions.'],
    note: 'When your mind wanders, return to what the other person is saying. Attention does not need to be perfect.',
    prompt: 'Try asking one follow-up question before looking at a notification.',
    reset: 'Choose a short stretch of undivided time together, with permission and practical exceptions.',
  },
  {
    topic: 'Single-tasking',
    title: 'Finish one useful step at a time',
    insight: 'Switching has a cost',
    explanation: 'Moving between demanding tasks can mean remembering where you left off and rebuilding momentum [2]. Some routine activities can coexist; this chapter is about juggling tasks that both need active attention. There is no fixed time or error penalty for every person.',
    action: 'Define a small finish line',
    steps: ['Write a specific next step: solve two problems, draft one paragraph, or read one section. Keep the tabs and materials needed for that step.', 'Try 10 to 25 minutes, or a shorter interval that suits you. Take a break, then decide whether to continue. The timer is a tool, not a test.'],
    note: 'Write distracting ideas on a nearby note so you can come back to them without opening another app.',
    prompt: 'Batch non-urgent replies when your responsibilities allow. Tell others when you will respond.',
    reset: 'One clear next step, one manageable session, then a deliberate break.',
  },
  {
    topic: 'Attention residue',
    title: 'Leave yourself a way back',
    insight: 'Unfinished tasks can follow you',
    explanation: 'Research on attention residue describes how thoughts about an unfinished task can carry into the next one [3]. Recovery varies with the person, task, and interruption. A precise countdown is not a rule for everybody.',
    action: 'Reduce avoidable interruptions',
    steps: ['Review notifications. Pause alerts that do not need your immediate attention, while keeping important contacts, care reminders, and safety alerts.', 'Before a necessary switch, write: "I stopped here. My next step is..." Use that note when you return.'],
    note: 'An interruption is not a failed session. A restart note can make returning less frustrating.',
    prompt: 'Choose one noisy app and change one setting. You do not have to silence your whole life.',
    reset: 'Pause one unnecessary alert and leave a short restart note before changing tasks.',
  },
  {
    topic: 'Choosing priorities',
    title: 'Protect one thing that matters',
    insight: 'Focus starts with a decision',
    explanation: 'A long to-do list can hide the next useful action. Choose one priority that matters today and make it small enough to begin. Productivity is not a measure of your worth, and different people have different energy patterns.',
    action: 'Work with your actual day',
    steps: ['Identify a time when you tend to have enough energy and fewer interruptions. It does not have to be early morning.', 'Name the result you want and the first action it needs. Leave room for school, family responsibilities, rest, and unexpected changes.'],
    note: 'A realistic plan can be revised. Missing a session does not erase the progress you have made.',
    prompt: 'Ask: "What is one useful step I can take with the time and energy I have?"',
    reset: 'Choose one meaningful priority and schedule a realistic first step.',
  },
  {
    topic: 'Rest and ideas',
    title: 'Let a quiet moment stay quiet',
    insight: 'Space for ideas, without guarantees',
    explanation: 'A quiet break gives you a change of pace and room to notice thoughts. It does not always produce a breakthrough. If unstructured time feels uncomfortable, a short, gentle activity can be another way to pause.',
    action: 'Try a low-pressure pause',
    steps: ['Spend a few minutes looking outside, stretching, doodling, or taking a safe walk that fits your ability.', 'Choose a setting where you feel comfortable. Keep navigation, support, and safety tools when needed. You do not have to avoid all sound or technology.'],
    note: 'An idea may arrive, or it may not. Rest is worthwhile even when it produces nothing.',
    prompt: 'After your break, write down one observation or simply return to the next small task.',
    reset: 'Make one short pause intentional instead of filling it automatically with a feed.',
  },
  {
    topic: 'Practice and progress',
    title: 'Build habits without blaming your brain',
    insight: 'Practice is gradual',
    explanation: 'Learning and repetition can help you develop routines. Watching ten-second videos does not prove that your attention span becomes ten seconds. Sleep, stress, disability, and the task itself also affect concentration. Difficulty focusing is not a character flaw.',
    action: 'Start smaller than you think',
    steps: ['Choose a book, audio resource, or accessible learning format you enjoy. Start with five minutes or another achievable amount.', 'Repeat a manageable session and adjust slowly. Track what helps rather than comparing yourself with someone else\'s pace.'],
    note: 'If a routine repeatedly fails, change the environment or session size before blaming yourself.',
    prompt: 'Record one thing that made starting easier. Keep that support for the next session.',
    reset: 'A repeatable small habit is more useful than an ambitious rule you cannot sustain.',
  },
  {
    topic: 'Everyday well-being',
    title: 'Support the person doing the work',
    insight: 'Basic needs belong in the plan',
    explanation: 'Focus is not only about willpower. Regular meals, rest, movement that suits your ability, and safe drinking water are practical starting points. A varied, balanced diet supports general health [4]. No food or supplement can promise a "brain reset".',
    action: 'Use what is available to you',
    steps: ['Build meals around accessible foods: rice or other grains, dal or beans, vegetables, seasonal fruit, and eggs or fish if they fit your diet.', 'Keep safe water available and follow any medical advice about fluids or food. Choose a workable wind-down routine and ask for help when persistent symptoms interfere with daily life.'],
    note: 'Expensive "brain foods" are not required. Your needs, health, culture, and budget matter.',
    prompt: 'If concentration, mood, memory, or sleep problems persist, speak with a qualified health professional.',
    reset: 'Include a basic need in today\'s plan: a meal, a drink, rest, or a gentle break.',
  },
];

const experiments = [
  ['1', 'One quieter app', 'Pause one non-essential notification. Keep important alerts.'],
  ['2', 'A different phone spot', 'Try one short task with fewer phone cues.'],
  ['3', 'One finish line', 'Complete a small, specific task in a manageable session.'],
  ['4', 'A restart note', 'Write your next step before a necessary interruption.'],
  ['5', 'Time together', 'Agree on a short phone-free conversation with practical exceptions.'],
  ['6', 'An intentional pause', 'Choose a safe, restful break without filling every moment.'],
  ['7', 'Keep what helped', 'Review your notes and choose one habit to continue.'],
];

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const footer = (pageNumber) => `<footer><span>Onnoy / Focus &amp; everyday digital habits</span><span>${String(pageNumber).padStart(2, '0')}</span></footer>`;

const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, colorScheme: 'light' });
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load' });
  const original = await page.evaluate(() => {
    const sourcePages = Array.from(document.querySelectorAll('.page'));
    return {
      cover: document.querySelector('.cover-main-art img')?.src,
      icons: Array.from(document.querySelectorAll('.cover-card-mini img')).map((image) => image.src),
      chapters: sourcePages.slice(1, 9).map((chapter) => ({
        art: chapter.querySelector('.banner-card img')?.src,
        spots: Array.from(chapter.querySelectorAll('.spot-img-box img')).map((image) => image.src),
      })),
    };
  });
  assert.ok(original.cover, 'The original cover artwork is required');
  assert.equal(original.chapters.length, chapters.length, 'All eight original chapters must be present');
  assert.ok(original.chapters.every((chapter) => chapter.art), 'Every chapter needs its original artwork');

  const imageSources = new Set([original.cover, ...original.icons, ...original.chapters.flatMap((chapter) => [chapter.art, ...chapter.spots])]);
  const embeddedImages = new Map();
  for (const imageSource of imageSources) {
    const imageUrl = new URL(imageSource);
    assert.equal(imageUrl.protocol, 'file:', 'Original illustrations must be local assets');
    const imageBytes = await sharp(fileURLToPath(imageUrl)).rotate().resize({ width: 1600, withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    embeddedImages.set(imageSource, `data:image/jpeg;base64,${imageBytes.toString('base64')}`);
  }

  const chapterMarkup = chapters.map((chapter, index) => {
    const artwork = original.chapters[index];
    return `<section class="page lesson" id="chapter-${index + 1}">
      <header><span>THE BRAIN RESET</span><span>${String(index + 1).padStart(2, '0')} / ${escapeHtml(chapter.topic)}</span></header>
      <h2>${escapeHtml(chapter.title)}</h2>
      <figure class="chapter-art"><img src="${embeddedImages.get(artwork.art)}" alt="Original illustration for ${escapeHtml(chapter.topic)}"><figcaption>Original visual metaphor. Read the guidance below for context and limitations.</figcaption></figure>
      <div class="lesson-columns">
        <article><p class="eyebrow">Understand</p><h3>${escapeHtml(chapter.insight)}</h3><p>${escapeHtml(chapter.explanation)}</p><div class="small-note">${artwork.spots[0] ? `<img src="${embeddedImages.get(artwork.spots[0])}" alt="">` : ''}<p>${escapeHtml(chapter.note)}</p></div></article>
        <article><p class="eyebrow">Try it today</p><h3>${escapeHtml(chapter.action)}</h3><ol>${chapter.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><p class="prompt">${escapeHtml(chapter.prompt)}</p></article>
      </div>
      <div class="reset"><strong>SMALL RESET ${String(index + 1).padStart(2, '0')}</strong><p>${escapeHtml(chapter.reset)}</p></div>
      ${footer(index + 2)}
    </section>`;
  }).join('');

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Brain Reset - Onnoy</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; margin: 0; padding: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; letter-spacing: 0; }
      body { font-family: 'Plus Jakarta Sans', sans-serif; color: #18372e; background: #e9edeb; }
      .page { width: 210mm; height: 297mm; padding: 14mm 16mm 20mm; position: relative; background: #fff; break-after: page; }
      .page:last-child { break-after: auto; }
      header, footer { display: flex; justify-content: space-between; gap: 12px; align-items: center; font-size: 8pt; }
      header { padding-bottom: 3mm; border-bottom: 1px solid #cddbd3; margin-bottom: 5mm; font-weight: 700; }
      footer { position: absolute; bottom: 10mm; left: 16mm; right: 16mm; border-top: 1px solid #cddbd3; padding-top: 2mm; color: #53645b; }
      h1, h2, h3 { font-family: 'Outfit', sans-serif; }
      h1 { font-size: 40pt; line-height: 1.05; margin: 4mm 0; }
      h2 { font-size: 23pt; line-height: 1.1; margin-bottom: 4mm; }
      h3 { font-size: 13pt; line-height: 1.25; margin-bottom: 2mm; }
      p, li { font-size: 10pt; line-height: 1.65; }
      a { color: #086a57; text-decoration: underline; overflow-wrap: anywhere; }
      .eyebrow { font-size: 8pt; font-weight: 700; color: #086a57; margin-bottom: 2mm; }
      .cover { background: #f7faf7; }
      .cover-subtitle { font-size: 15pt; max-width: 160mm; line-height: 1.45; color: #53645b; }
      .cover-art { width: 100%; height: 120mm; object-fit: contain; margin: 7mm 0; display: block; }
      .cover-topics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5mm; padding: 5mm 0; border-top: 1px solid #cddbd3; border-bottom: 1px solid #cddbd3; }
      .cover-topics img { width: 11mm; height: 11mm; object-fit: contain; display: block; margin-bottom: 2mm; }
      .cover-topics strong { font-family: 'Outfit', sans-serif; display: block; font-size: 12pt; }
      .cover-topics p { font-size: 9pt; color: #53645b; }
      .cover-start { margin-top: 5mm; font-size: 9.5pt; max-width: 166mm; }
      .chapter-art { height: 93mm; margin-bottom: 5mm; }
      .chapter-art img { width: 100%; height: 87mm; object-fit: contain; display: block; }
      figcaption { text-align: center; font-size: 7pt; color: #53645b; padding-top: 2mm; }
      .lesson-columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 7mm; }
      article + article { border-left: 1px solid #cddbd3; padding-left: 6mm; }
      article p, article li { font-size: 9.5pt; line-height: 1.6; }
      ol { padding-left: 4.5mm; }
      li + li { margin-top: 2mm; }
      .small-note { display: flex; gap: 2.5mm; align-items: center; margin-top: 3mm; padding-top: 3mm; border-top: 1px solid #cddbd3; }
      .small-note img { width: 14mm; height: 14mm; object-fit: contain; flex-shrink: 0; }
      .small-note p, .prompt { font-size: 8.5pt; color: #53645b; }
      .prompt { margin-top: 3mm; }
      .reset { margin-top: 5mm; padding: 3mm 4mm; border-left: 3px solid #0b8468; background: #edf6ef; }
      .reset strong { font-size: 8pt; color: #086a57; }
      .reset p { font-size: 9pt; line-height: 1.5; margin-top: 1mm; }
      .intro { color: #53645b; margin-bottom: 5mm; }
      table { width: 100%; border-collapse: collapse; margin: 4mm 0; table-layout: fixed; }
      th, td { text-align: left; border-bottom: 1px solid #cddbd3; padding: 3mm 2mm; vertical-align: top; font-size: 9pt; line-height: 1.5; }
      th { background: #edf6ef; font-size: 8pt; }
      .day { width: 9%; } .experiment { width: 48%; } .notes { width: 43%; }
      td strong { display: block; margin-bottom: 1mm; }
      .write-line { min-height: 10mm; border-bottom: 1px dotted #869b8c; margin-bottom: 3mm; }
      .reflection { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 6mm; }
      .reflection h3 { font-size: 11pt; }
      .contents { columns: 2; column-gap: 7mm; list-style-position: inside; margin: 4mm 0 6mm; padding-left: 0; }
      .contents li { break-inside: avoid; font-size: 9pt; margin: 0 0 2mm; }
      .references li { font-size: 9pt; margin-top: 3mm; }
      .support-note { padding-top: 4mm; border-top: 1px solid #cddbd3; margin-top: 6mm; }
      .support-note p { font-size: 9.5pt; margin-top: 2mm; }
    </style></head><body>
    <section class="page cover" id="cover"><header><span>ONNOY / LEARNING SERIES</span><span>REVISED EDITION / 2026</span></header><p class="eyebrow">FOCUS &amp; EVERYDAY DIGITAL HABITS</p><h1>The Brain Reset</h1><p class="cover-subtitle">A practical, illustrated guide to calmer attention and small habits that fit real life.</p><img class="cover-art" src="${embeddedImages.get(original.cover)}" alt="The original Brain Reset illustration">
      <div class="cover-topics">${['Less distraction', 'Room to think', 'Steady practice'].map((title, index) => `<div><img src="${embeddedImages.get(original.icons[index])}" alt=""><strong>${title}</strong><p>${['Make your next step easier.', 'Take a low-pressure pause.', 'Start small and adjust.'][index]}</p></div>`).join('')}</div>
      <p class="cover-start"><strong>Start here:</strong> choose one experiment, keep the support tools you need, and notice what helps. Includes eight illustrated lessons, a seven-day worksheet, and evidence notes. This is an educational guide, not a medical treatment.</p>${footer(1)}
    </section>
    ${chapterMarkup}
    <section class="page" id="practice"><header><span>THE BRAIN RESET</span><span>YOUR SEVEN-DAY EXPERIMENT</span></header><h2>A week of small resets</h2><p class="intro">Choose one manageable change each day. These are experiments, not a cure or a seven-day transformation promise. Repeat a day or change the plan when needed.</p>
      <table><thead><tr><th class="day">Day</th><th class="experiment">Try this</th><th class="notes">What helped? What got in the way?</th></tr></thead><tbody>${experiments.map(([day, habit, action]) => `<tr><td>${day}</td><td><strong>${habit}</strong>${action}</td><td><div class="write-line"></div></td></tr>`).join('')}</tbody></table>
      <div class="reflection"><div><h3>One habit I want to keep</h3><div class="write-line"></div><div class="write-line"></div></div><div><h3>One support or adjustment I need</h3><div class="write-line"></div><div class="write-line"></div></div></div><div class="reset"><strong>RESTART, DO NOT PUNISH</strong><p>A missed day is information, not a failure. Make the next step smaller and try again.</p></div>${footer(10)}
    </section>
    <section class="page" id="evidence"><header><span>THE BRAIN RESET</span><span>FIND YOUR WAY / EVIDENCE &amp; SUPPORT</span></header><h2>Keep the advice in perspective</h2><p class="intro">The illustrations use visual metaphors and simplified slogans. Their numerical examples are not universal findings. The guidance here avoids fixed recovery times, guaranteed brain changes, and diagnostic claims.</p>
      <h3>Jump to a lesson</h3><ol class="contents">${chapters.map((chapter, index) => `<li><a href="#chapter-${index + 1}">${escapeHtml(chapter.topic)} / ${String(index + 2).padStart(2, '0')}</a></li>`).join('')}<li><a href="#practice">Seven-day worksheet / 10</a></li></ol>
      <h3>Selected evidence and further reading</h3><ol class="references"><li>Ward et al. (2017). <em>Brain Drain: The Mere Presence of One's Own Smartphone Reduces Available Cognitive Capacity.</em> A laboratory study, not a guarantee for every person or setting. <a href="https://doi.org/10.1086/691462">doi.org/10.1086/691462</a></li><li>American Psychological Association. <em>Multitasking: Switching costs.</em> An overview of research on switching between demanding tasks. <a href="https://www.apa.org/topics/research/multitasking">apa.org/topics/research/multitasking</a></li><li>Leroy (2009). <em>Why is it so hard to do my work? The challenge of attention residue when switching between work tasks.</em> <a href="https://doi.org/10.1016/j.obhdp.2009.04.002">doi.org/10.1016/j.obhdp.2009.04.002</a></li><li>World Health Organization. <em>Healthy diet.</em> General guidance on adequacy, balance, moderation, and variety; not a focus treatment. <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet">who.int / Healthy diet</a></li></ol>
      <div class="support-note"><h3>You are more than your productivity</h3><p>Attention difficulties are not a character flaw. Adapt these ideas for disability, care responsibilities, access, and personal circumstances. Keep emergency contacts, assistive technology, and important reminders available.</p><p>This guide does not diagnose or treat ADHD, anxiety, depression, or memory problems. If concentration, mood, sleep, or memory problems persist or disrupt daily life, seek support from a qualified health professional. Follow individual medical advice about food, fluids, and activity.</p></div>${footer(11)}
    </section></body></html>`;

  const revisedPath = join(temporaryDir, 'Brain_Reset_Revised.html');
  await writeFile(revisedPath, html);
  await page.goto(pathToFileURL(revisedPath).href, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  const layout = await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((image) => image.decode()));
    return {
      pageCount: document.querySelectorAll('.page').length,
      loadedImages: Array.from(document.images).every((image) => image.naturalWidth > 0),
      overflow: Array.from(document.querySelectorAll('.page')).flatMap((section, index) => {
        const footerTop = section.querySelector('footer').getBoundingClientRect().top;
        const overlapping = Array.from(section.children).some((element) => element.tagName !== 'FOOTER' && element.getBoundingClientRect().bottom > footerTop - 8);
        return section.scrollWidth > section.clientWidth || overlapping ? [index + 1] : [];
      }),
    };
  });
  assert.equal(layout.pageCount, 11);
  assert.ok(layout.loadedImages, 'Every original illustration must load');
  assert.deepEqual(layout.overflow, [], 'No page content may overlap a footer or overflow');
  const printed = await page.pdf({ format: 'A4', margin: { top: '0', right: '0', bottom: '0', left: '0' }, printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
  const document = await PDFDocument.load(printed);
  assert.equal(document.getPageCount(), 11, 'The revised booklet must have exactly eleven content pages');
  document.setTitle('The Brain Reset - A Practical Illustrated Guide to Focus');
  document.setAuthor('Onnoy');
  document.setSubject('Focus, everyday digital habits, and a seven-day reflection worksheet');
  document.setKeywords(['Onnoy', 'focus', 'digital habits', 'attention', 'student guide', 'Brain Reset']);
  const revisedBytes = await document.save();
  assert.ok(revisedBytes.length < 6_000_000, 'The web-ready edition should remain under 6 MB');
  await mkdir(dirname(outputPath), { recursive: true });
  await mkdir(dirname(coverPath), { recursive: true });
  await writeFile(outputPath, revisedBytes);
  const coverPrefix = join(temporaryDir, 'cover');
  execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-singlefile', '-scale-to', '1000', '-png', outputPath, coverPrefix]);
  await sharp(`${coverPrefix}.png`).resize({ width: 620 }).webp({ quality: 88 }).toFile(coverPath);
  console.log(`Published ${outputPath}: 11 pages, ${(revisedBytes.length / 1_000_000).toFixed(2)} MB; all illustrations loaded; no page overflow.`);
  console.log(`Cover: ${coverPath}`);
  console.log(`Editable revised HTML and cover preview: ${temporaryDir}`);
} finally {
  await browser.close();
}