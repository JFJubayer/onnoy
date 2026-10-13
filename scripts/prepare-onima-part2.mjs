import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const sourcePath = resolve(process.argv[2] ?? join(homedir(), 'Downloads/OnimaPart2.pdf'));
const referencePath = resolve(process.argv[3] ?? join(homedir(), 'Downloads/OnimaPart1.pdf'));
const outputPath = resolve(process.argv[4] ?? 'Documents/OnimaPart2_Publishable.pdf');
assert.match(outputPath, /\.pdf$/i, 'The output must be a PDF');
assert.notEqual(outputPath, sourcePath, 'Never overwrite the original Part Two');
assert.notEqual(outputPath, referencePath, 'Never overwrite the approved Part One');
const htmlPath = outputPath.replace(/\.pdf$/i, '.html');
const temporaryDir = await mkdtemp(join(tmpdir(), 'onnoy-onima-part2-'));
const chromePath = process.env.CHROME_PATH ?? execFileSync('which', ['google-chrome'], { encoding: 'utf8' }).trim();
const fontDirectory = process.env.BENGALI_FONT_DIR ?? '/usr/share/fonts/truetype/noto';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const originalBytes = await readFile(sourcePath);
const referenceBytes = await readFile(referencePath);
const originalHash = hash(originalBytes);
const referenceHash = hash(referenceBytes);
assert.equal((await PDFDocument.load(originalBytes)).getPageCount(), 8, 'Expected the supplied eight-page Part Two');
const reference = await PDFDocument.load(referenceBytes);
const referenceSize = reference.getPage(0).getSize();
assert.ok(Math.abs(referenceSize.width - 595) < 1 && Math.abs(referenceSize.height - 595) < 1, 'Part One must use the approved square format');

const scenes = [
  {
    title: 'নীরবতার ভেতরে',
    image: 'quiet',
    paragraphs: [
      'দলগত কাজের দিন অনিমার চুপ করে থাকা শিক্ষকের চোখ এড়ায়নি। পেন্সিলের ঘটনাটিও তিনি লক্ষ করেছিলেন। তাই পরের কয়েক দিন তিনি অনিমার সঙ্গে একটু বেশি সময় নিয়ে কথা বললেন।',
      'শুধু চুপচাপ থাকলেই কোনো শিশু কষ্টে আছে—এমন নয়। কিন্তু অনিমা নিজের পছন্দ জানাতে ইতস্তত করছিল। নতুন কাজে যোগ দেওয়ার কথা উঠলে সে পিছিয়ে যাচ্ছিল।',
      'শিক্ষক বুঝলেন, ওকে তাড়া দেওয়া নয়; আগে জানতে হবে, মনের কথা বলতে কোথায় ওর অস্বস্তি হচ্ছে।',
    ],
  },
  {
    title: 'মা-বাবার সঙ্গে কথা',
    image: 'meeting',
    paragraphs: [
      'স্কুলের অভিভাবক সভায় অনিমার মা-বাবা নিশ্চিন্ত মনে এলেন। তাঁদের ধারণা, মেয়ে শান্ত আছে, কোনো অভিযোগ নেই।',
      'শ্রেণিশিক্ষক তাঁদের স্বাগত জানিয়ে বললেন, “অনিমার অনেক সুন্দর ভাবনা আছে। কিন্তু ক্লাসে নিজের কথা বলার সময় ও প্রায়ই থেমে যায়। আমি আপনাদের সঙ্গে বিষয়টি নিয়ে কথা বলতে চাই।”',
      'মা একটু অবাক হয়ে বললেন, “কিন্তু বাসায় তো ও কোনো জেদ করে না!”',
      'শিক্ষক শান্তভাবে বললেন, “জেদ না করা আর স্বচ্ছন্দে মনের কথা বলতে পারা এক নয়। ও ভালো আছে কি না, সেটা জানতে ওর কথাও শুনতে হবে।”',
    ],
  },
  {
    title: 'নিজের ওপর ভরসা',
    image: 'flowers',
    paragraphs: [
      'শিক্ষক বললেন, “মাঝে মাঝে মনে হয়, অনিমা কিছু বলার আগে ভেবে নিচ্ছে—কেউ রাগ করবে না তো? ভুল হবে না তো? কাউকে কষ্ট দেব না তো?”',
      'বাবা জিজ্ঞেস করলেন, “তাহলে আমরা কী করতে পারি?”',
      '“ওর হয়ে সব সিদ্ধান্ত নিয়ে ফেলা নয়,” শিক্ষক বললেন। “বয়স অনুযায়ী ছোট ছোট সিদ্ধান্ত নেওয়ার সুযোগ দিতে পারি। ভুল হলে ধৈর্য ধরতে পারি। আর ও যখন কিছু বলে, তখন বোঝাতে পারি—ওর কথার মূল্য আছে।”',
      'মা-বাবা মন দিয়ে শুনলেন। তাঁদেরও মনে হলো, অনিমার নীরবতার ভেতরের কথাগুলো জানা দরকার।',
    ],
  },
  {
    title: 'একসঙ্গে শুরু করা',
    image: 'thoughts',
    paragraphs: [
      '“এ কথা শুনে আপনাদের মন খারাপ হতে পারে,” শিক্ষক বললেন। “কিন্তু কাউকে দোষ দেওয়া আমাদের উদ্দেশ্য নয়। অনিমার পাশে আমরা একসঙ্গে দাঁড়াতে পারি।”',
      'তিনি প্রস্তাব দিলেন, বাড়িতে ওকে কথা বলার সময় দিতে হবে; ক্লাসেও তার জন্য ছোট, স্বচ্ছন্দ সুযোগ রাখা হবে। চাইলে আগে একটি ছবি এঁকে বা শিক্ষকের সঙ্গে আলাদা করে কথা বলে ও নিজের ভাবনা জানাতে পারবে।',
      '“একদিনেই সব বদলাবে না,” শিক্ষক বললেন। “তাই উত্তর দিতে ওকে তাড়া দেবেন না। আমরা ধীরে ধীরে দেখব, কোন উপায়ে ও বেশি স্বস্তি পায়।”',
    ],
  },
  {
    title: 'ছোট সিদ্ধান্ত, বড় ভরসা',
    image: 'choices',
    paragraphs: [
      'শিক্ষক কয়েকটি সহজ উদাহরণ দিলেন।',
      '“আজ কোন জামাটা পরবে, অবসরে কী আঁকবে, কিংবা কোন গল্পটা পড়বে—এমন ছোট বিষয়ে অনিমাকে পছন্দ করতে দিন। সবকিছু তার ইচ্ছেমতো হবে না, কিন্তু তার মতামত শোনা যেতে পারে।”',
      '“ভুল হলে বলুন, ‘চলো দেখি, পরের বার কীভাবে করা যায়।’ ওর হয়ে সঙ্গে সঙ্গে কাজটি করে না দিয়ে দরকারমতো সাহায্য করুন।”',
      '“আর ও কোনো কথা বললে আগে শুনুন। একমত না হলেও শান্তভাবে কারণ বলুন। ও যেন বুঝতে পারে—মত আলাদা হলে আপনাদের ভালোবাসা কমে যায় না।”',
    ],
  },
  {
    title: 'বাড়ি ফেরার পর',
    image: 'home',
    secondImage: 'sunshine',
    paragraphs: [
      'সেদিন বাড়ি ফিরে মা ফোনটা পাশে সরিয়ে অনিমার কাছে বসলেন। নরম গলায় বললেন, “আজ স্কুলে কী করেছ, মা?”',
      'অনিমা একটু অবাক হলো। মা এবার তার দিকে তাকিয়ে অপেক্ষা করছেন। সে ধীরে ধীরে বলল, “আজ না, আমরা ছবি এঁকেছি…”',
      'মা হাসলেন। “কী এঁকেছ? চাইলে আমাকে দেখাবে?”',
      'বাবাও পাশে এসে তার পছন্দের খেলার কথা জানতে চাইলেন। অনিমা একটু ভেবে নিজের পছন্দ জানাল। মা-বাবা মাঝখানে থামিয়ে দিলেন না।',
      'সেদিন কোনো জাদুকরি পরিবর্তন হলো না। তবে অনিমার মনে হলো, তার কথাগুলো শোনার মতো সময় আজ মা-বাবার আছে।',
    ],
  },
  {
    title: 'শুধু অনিমার গল্প নয়',
    image: 'reflection',
    paragraphs: [
      'অনিমার গল্প আমাদের অনেক পরিচিত মুহূর্তের কথা মনে করিয়ে দেয়। একটি শিশু আনন্দ ভাগ করতে আসে, কষ্টের কথা বলতে চায়, কিংবা নিজের মতো কিছু করতে চায়।',
      'বারবার থামিয়ে দেওয়া হলে কেউ কেউ মনের কথা বলতে ইতস্তত করতে পারে। তবে সব শিশুর অভিজ্ঞতা ও প্রতিক্রিয়া এক নয়। শান্ত স্বভাব, কথা বলতে অসুবিধা বা কোনো নির্দিষ্ট আচরণ দেখে তার জীবনের পুরো গল্প বলা যায় না।',
      'আমরা যা করতে পারি, তা হলো কৌতূহল নিয়ে শোনা, অনুভূতিকে গুরুত্ব দেওয়া এবং নিরাপদভাবে নিজের কথা বলার সুযোগ তৈরি করা।',
      'অনিমার জন্য সেই শুরুটা হয়েছিল একটি ছোট প্রশ্নে—“তুমি কী বলতে চাও?”',
    ],
  },
];

const questions = [
  'সন্তান কথা বলতে এলে আমি কি একটু সময় নিয়ে মন দিয়ে শুনি?',
  'তার দুঃখ বা অস্বস্তিকে কি “সামান্য ব্যাপার” বলে উড়িয়ে দিই?',
  'ভুলের পরে কি আগে জানতে চাই, কী ঘটেছিল?',
  'বয়স অনুযায়ী ছোট সিদ্ধান্তে কি তার মতামত নিই?',
  'সে কথা বলতে না চাইলে কি চাপ না দিয়ে পরে কথা বলার সুযোগ রাখি?',
];
const conversations = [
  ['কাঁদছে বা মন খারাপ', '“তোমার খারাপ লাগছে বুঝতে পারছি। বলতে চাইলে আমি শুনব।”'],
  ['কোনো ভুল করেছে', '“কী হয়েছে বলবে? চলো, এবার কীভাবে ঠিক করা যায় দেখি।”'],
  ['ছোট একটি পছন্দ করতে চায়', '“এই দুটির মধ্যে তুমি কোনটি চাও?”'],
  ['অনিরাপদ কিছু করতে চায়', '“তুমি করতে চাইছ বুঝতে পারছি। কিন্তু এটি নিরাপদ নয়। আমরা অন্য একটি উপায় খুঁজি।”'],
];
const bengaliNumber = (number) => String(number).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const paragraphs = (items) => items.map((text) => `<p>${escapeHtml(text)}</p>`).join('');
const header = (label) => `<header><span>${label}</span><span>অনিমা · দ্বিতীয় পর্ব</span></header>`;
const footer = (number) => `<footer><span>অনুভূতি · আস্থা · নিজের কথা</span><span>${bengaliNumber(number)}</span><span>Team ONNOY</span></footer>`;
const allParagraphs = scenes.flatMap((scene) => scene.paragraphs);
assert.equal(new Set(allParagraphs).size, allParagraphs.length, 'The revised story must not repeat paragraphs');

const artworkPrefix = join(temporaryDir, 'artwork');
execFileSync('pdfimages', ['-j', sourcePath, artworkPrefix]);
const artworkIndices = { quiet: 0, meeting: 5, flowers: 6, thoughts: 11, choices: 12, home: 17, sunshine: 18, reflection: 23, parent: 24 };
const artwork = {};
for (const [name, index] of Object.entries(artworkIndices)) {
  const imageBytes = await readFile(`${artworkPrefix}-${String(index).padStart(3, '0')}.jpg`);
  const metadata = await sharp(imageBytes).metadata();
  assert.ok(metadata.width >= 400 && metadata.height >= 400, `Missing or undersized original artwork: ${name}`);
  artwork[name] = `data:image/jpeg;base64,${imageBytes.toString('base64')}`;
}
const regularFont = (await readFile(join(fontDirectory, 'NotoSerifBengali-Regular.ttf'))).toString('base64');
const boldFont = (await readFile(join(fontDirectory, 'NotoSerifBengali-Bold.ttf'))).toString('base64');
const picture = (name, description, className = '') => `<img class="${className}" src="${artwork[name]}" alt="${escapeHtml(description)}">`;
const sceneMarkup = scenes.map((scene, index) => `<section class="page story" id="scene-${index + 1}">
  ${header(`গল্প ${bengaliNumber(index + 1)}`)}<h2>${scene.title}</h2>
  <div class="spread"><figure>${picture(scene.image, `মূল পাণ্ডুলিপির চিত্র: ${scene.title}`)}${scene.secondImage ? picture(scene.secondImage, 'আশা ও আনন্দের প্রতীকী চিত্র', 'second-art') : ''}</figure><article>${paragraphs(scene.paragraphs)}</article></div>
  ${footer(index + 2)}</section>`).join('');

const html = `<!doctype html><html lang="bn-BD"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>অনিমা · দ্বিতীয় পর্ব — ফিরে পাওয়া কণ্ঠস্বর</title><style>
  @font-face { font-family: 'Onima Bengali'; src: url(data:font/ttf;base64,${regularFont}) format('truetype'); font-weight: 400; font-style: normal; }
  @font-face { font-family: 'Onima Bengali'; src: url(data:font/ttf;base64,${boldFont}) format('truetype'); font-weight: 700; font-style: normal; }
  @page { size: 210mm 210mm; margin: 0; }
  :root { --ink: #25364a; --blue: #163f64; --muted: #5c7187; --rule: #d5dfe7; --paper: #fff; }
  * { box-sizing: border-box; margin: 0; padding: 0; letter-spacing: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  body { font-family: 'Onima Bengali', serif; color: var(--ink); background: #e9edf0; }
  .page { width: 210mm; height: 210mm; padding: 13mm 15mm 22mm; position: relative; background: var(--paper); break-after: page; }
  .page::before { content: ''; position: absolute; inset: 5mm; border: 0.3mm solid var(--rule); border-radius: 4mm; pointer-events: none; }
  .page:last-child { break-after: auto; }
  header { display: flex; justify-content: space-between; gap: 5mm; font-size: 9pt; line-height: 1.6; color: var(--muted); border-bottom: 0.2mm solid var(--rule); padding-bottom: 2.5mm; margin-bottom: 5mm; }
  h1 { font-size: 52pt; line-height: 1.35; color: var(--blue); }
  h2 { font-size: 23pt; line-height: 1.5; color: var(--blue); margin-bottom: 5mm; }
  p, li { font-size: 12pt; line-height: 1.85; }
  p + p { margin-top: 3mm; }
  footer { position: absolute; bottom: 11mm; left: 15mm; right: 15mm; display: grid; grid-template-columns: 1fr 12mm 1fr; align-items: center; font-size: 8pt; line-height: 1.5; color: var(--muted); border-top: 0.2mm solid var(--rule); padding-top: 2mm; }
  footer span:nth-child(2) { text-align: center; font-size: 10pt; }
  footer span:last-child { text-align: right; }
  .spread { display: grid; grid-template-columns: 63mm minmax(0, 1fr); gap: 8mm; align-items: start; }
  figure { display: flex; flex-direction: column; align-items: center; gap: 5mm; padding-top: 2mm; }
  figure img { display: block; width: 100%; max-height: 126mm; object-fit: contain; }
  figure:has(.second-art) img:first-child { max-height: 76mm; }
  figure .second-art { max-height: 45mm; }
  .cover { text-align: center; background: #eef4f9; padding: 13mm 17mm 18mm; }
  .series { font-size: 10pt; color: var(--blue); margin-top: 1mm; }
  .subtitle { font-size: 15pt; color: var(--muted); margin-top: 1mm; }
  .part { font-size: 13pt; font-weight: 700; color: var(--blue); margin-top: 3mm; }
  .cover-art { width: 100%; height: 82mm; object-fit: contain; display: block; margin: 4mm auto 3mm; }
  .byline { font-size: 9pt; color: var(--muted); }
  .author { font-size: 17pt; font-weight: 700; margin-top: 1mm; }
  .cover footer { border: 0; padding-top: 0; }
  .questions li { padding-left: 1mm; margin-left: 5mm; font-size: 11.5pt; line-height: 1.8; }
  .questions li + li { margin-top: 2mm; }
  .questions { margin: 4mm 0; }
  .small { font-size: 10.5pt; line-height: 1.85; color: var(--muted); }
  .guide-intro { font-size: 12pt; margin-bottom: 5mm; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { text-align: left; vertical-align: top; padding: 3.5mm 3mm; border-bottom: 0.2mm solid var(--rule); font-size: 11.5pt; line-height: 1.85; }
  th { color: var(--blue); background: #eef4f9; font-weight: 700; }
  th:first-child { width: 30%; }
  .guide-note { padding-top: 5mm; }
  .closing-art { width: 44mm; height: 37mm; object-fit: contain; display: block; margin-bottom: 4mm; }
  .closing p { font-size: 11.5pt; line-height: 1.85; }
  .credit { margin-top: 6mm; border-top: 0.2mm solid var(--rule); padding-top: 3mm; }
  .credit p { font-size: 9.5pt; color: var(--muted); }
  @media screen { .page { margin: 8mm auto; box-shadow: 0 1mm 5mm #25364a18; } }
  @media print { body { background: #fff; } }
</style></head><body>
  <section class="page cover" id="cover"><p class="series">সচিত্র শিশু-কিশোর গল্পগ্রন্থ</p><h1>অনিমা</h1><p class="subtitle">একটি অনুভূতি ও আত্মবিশ্বাসের গল্প</p><p class="part">দ্বিতীয় পর্ব · ফিরে পাওয়া কণ্ঠস্বর</p>${picture('flowers', 'ফুলের মাঝে হাত মেলে দাঁড়ানো একটি শিশু', 'cover-art')}<p class="byline">রচনা ও ভাবনা</p><p class="author">আলফী শাহরীন</p>${footer(1)}</section>
  ${sceneMarkup}
  <section class="page" id="parents">${header('অভিভাবকদের জন্য ভাবনা')}<h2>একটু থেমে ভাবি</h2><div class="spread"><figure>${picture('parent', 'মূল পাণ্ডুলিপির একজন নারীর চিত্র')}</figure><article><p>Team ONNOY-এর পক্ষ থেকে আমরা কোনো মা-বাবাকে কাঠগড়ায় দাঁড় করাতে চাই না। ভালোবাসার সঙ্গে কয়েকটি প্রশ্ন রাখতে চাই।</p><ul class="questions">${questions.map((question) => `<li>${escapeHtml(question)}</li>`).join('')}</ul><p class="small">সবসময় নিখুঁতভাবে পারব না। ভুল বুঝতে পারলে ক্ষমা চাওয়া এবং আবার চেষ্টা করাও শিশুর জন্য মূল্যবান উদাহরণ।</p></article></div>${footer(9)}</section>
  <section class="page" id="conversation">${header('অভিভাবকদের জন্য অনুশীলন')}<h2>কথার মধ্যে নিরাপদ আশ্রয়</h2><p class="guide-intro">অনুভূতিকে স্বীকার করা মানে সব আবদার মেনে নেওয়া নয়। কোমল ভাষায় স্পষ্ট সীমাও রাখা যায়।</p><table><thead><tr><th scope="col">যখন…</th><th scope="col">এভাবে বলা যেতে পারে</th></tr></thead><tbody>${conversations.map(([situation, response]) => `<tr><td>${escapeHtml(situation)}</td><td>${escapeHtml(response)}</td></tr>`).join('')}</tbody></table><p class="guide-note small">শিশু সঙ্গে সঙ্গে কথা না বললেও পাশে থাকুন। জোর করে চোখে চোখ রাখতে বা কথা বলতে বলবেন না। আঁকা, খেলা বা পরে আলাদা করে কথা বলার সুযোগও রাখতে পারেন।</p>${footer(10)}</section>
  <section class="page closing" id="closing">${header('শেষ কথা')}<h2>তোমার কথার মূল্য আছে</h2>${picture('sunshine', 'আশা ও উষ্ণতার প্রতীকী চিত্র', 'closing-art')}${paragraphs([
    'শিশুরা শুধু উপদেশ শুনে শেখে না; আমাদের আচরণ দেখেও শেখে। তাই মন দিয়ে শোনা, নিজের ভুল স্বীকার করা এবং ধৈর্য ধরে সীমা বোঝানো—এই ছোট কাজগুলোও গুরুত্বপূর্ণ।',
    'ভয়, কষ্ট বা কোনো সমস্যার কথা বলার জন্য শিশুর পাশে বিশ্বস্ত বড় মানুষ থাকা দরকার। পরিবারে নিরাপদে বলতে না পারলে শিক্ষক বা অন্য বিশ্বস্ত বড় মানুষের কাছেও সাহায্য চাইতে পারে।',
    'শিশুর কথা বলার ভয়, উদ্বেগ বা আচরণের পরিবর্তন দীর্ঘদিন থাকলে, বা স্কুল ও দৈনন্দিন জীবনে বাধা তৈরি করলে, শিক্ষক এবং উপযুক্ত শিশুস্বাস্থ্য বা মানসিক স্বাস্থ্য পেশাজীবীর সহায়তা নিন। গল্প পড়ে কোনো শিশুর রোগনির্ণয় করা যায় না।',
  ])}<div class="credit"><p>লেখা ও ভাবনা: আলফী শাহরীন · Team ONNOY</p><p>এই পর্ব প্রথম পর্বের গল্পের ধারাবাহিকতা। অভিভাবকদের অংশটি সাধারণ শিক্ষামূলক আলোচনা; ব্যক্তিগত মূল্যায়ন বা চিকিৎসার বিকল্প নয়।</p></div>${footer(11)}</section>
</body></html>`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(htmlPath, html);
const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 }, colorScheme: 'light' });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  const layout = await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((image) => image.decode()));
    await document.fonts.load('12px "Onima Bengali"', 'অনিমা');
    await document.fonts.load('700 12px "Onima Bengali"', 'অনিমা');
    const overflow = [];
    const sections = Array.from(document.querySelectorAll('.page'));
    for (const [index, section] of sections.entries()) {
      const bounds = section.getBoundingClientRect();
      const footerTop = section.querySelector('footer').getBoundingClientRect().top;
      const overflowing = Array.from(section.querySelectorAll('h1, h2, p, li, img, table, th, td, article')).filter((element) => {
        const rectangle = element.getBoundingClientRect();
        return rectangle.bottom > footerTop - 8 || rectangle.left < bounds.left + 15 || rectangle.right > bounds.right - 15 || element.scrollWidth > element.clientWidth + 1;
      }).map((element) => ({ tag: element.tagName, text: element.textContent.slice(0, 70), bottom: Math.round(element.getBoundingClientRect().bottom - bounds.top), footer: Math.round(footerTop - bounds.top) }));
      if (overflowing.length || section.scrollHeight > section.clientHeight + 1) overflow.push({ page: index + 1, elements: overflowing });
    }
    return { pages: sections.length, images: document.images.length, imagesLoaded: Array.from(document.images).every((image) => image.naturalWidth > 0), fontsLoaded: document.fonts.check('12px "Onima Bengali"', 'অনিমা') && document.fonts.check('700 12px "Onima Bengali"', 'অনিমা'), overflow };
  });
  assert.equal(layout.pages, 11);
  assert.ok(layout.imagesLoaded, 'All original illustrations must load');
  assert.ok(layout.fontsLoaded, 'Both Bengali fonts must load without network access');
  assert.deepEqual(layout.overflow, [], 'Text and artwork must fit without clipping or overlapping footers');
  const printed = await page.pdf({ width: '210mm', height: '210mm', margin: { top: '0', right: '0', bottom: '0', left: '0' }, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  const finished = await PDFDocument.load(printed);
  assert.equal(finished.getPageCount(), 11, 'No blank or accidental extra pages');
  for (const sheet of finished.getPages()) {
    const size = sheet.getSize();
    assert.ok(Math.abs(size.width - referenceSize.width) < 1 && Math.abs(size.height - referenceSize.height) < 1, 'Every page must match Part One');
  }
  finished.setTitle('অনিমা · দ্বিতীয় পর্ব — ফিরে পাওয়া কণ্ঠস্বর');
  finished.setAuthor('আলফী শাহরীন');
  finished.setSubject('একটি অনুভূতি ও আত্মবিশ্বাসের গল্প; অভিভাবকদের জন্য ভাবনা ও অনুশীলন');
  finished.setKeywords(['অনিমা', 'Onima', 'Part Two', 'ONNOY', 'Bengali', 'parenting', 'confidence']);
  finished.catalog.set(PDFName.of('Lang'), PDFString.of('bn-BD'));
  const finishedBytes = await finished.save();
  assert.ok(finishedBytes.length < 5_000_000, 'The reading edition should remain under 5 MB');
  await writeFile(outputPath, finishedBytes);
  const extracted = execFileSync('pdftotext', ['-enc', 'UTF-8', outputPath, '-'], { encoding: 'utf8' });
  assert.equal(extracted.includes('\uFFFD'), false, 'No replacement characters in extracted Bengali text');
  const normalizedText = extracted.replace(/\s+/gu, '').normalize('NFC');
  for (const required of ['অনিমা', 'আলফী শাহরীন', 'ফিরে পাওয়া কণ্ঠস্বর', ...scenes.map((scene) => scene.title), 'তোমার কথার মূল্য আছে']) {
    assert.ok(normalizedText.includes(required.replace(/\s+/gu, '').normalize('NFC')), `Missing searchable Bengali text: ${required}`);
  }
  assert.equal(extracted.split('\f').filter((sheet) => sheet.trim()).length, 11, 'All eleven pages must contain extractable text');
  const fonts = execFileSync('pdffonts', [outputPath], { encoding: 'utf8' });
  assert.match(fonts, /NotoSerifBengali/, 'The PDF must embed the approved Bengali font');
  const fontRows = fonts.trim().split('\n').slice(2);
  assert.ok(fontRows.every((row) => /\s+yes\s+yes\s+yes\s+\d+\s+\d+\s*$/.test(row)), 'Every PDF font must be embedded and have a Unicode map');
  assert.equal(hash(await readFile(sourcePath)), originalHash, 'Original Part Two must remain unchanged');
  assert.equal(hash(await readFile(referencePath)), referenceHash, 'Approved Part One must remain unchanged');
  execFileSync('pdftoppm', ['-scale-to', '1100', '-png', outputPath, join(temporaryDir, 'page')]);
  const thumbnails = [];
  for (let index = 0; index < 11; index += 1) {
    const image = await sharp(join(temporaryDir, `page-${String(index + 1).padStart(2, '0')}.png`)).resize(450, 450).png().toBuffer();
    thumbnails.push({ input: image, left: (index % 3) * 466 + 8, top: Math.floor(index / 3) * 466 + 8 });
  }
  const previewPath = join(temporaryDir, 'contact-sheet.png');
  await sharp({ create: { width: 1398, height: 1864, channels: 3, background: '#e9edf0' } }).composite(thumbnails).png().toFile(previewPath);
  await writeFile(join(temporaryDir, 'validation.json'), JSON.stringify({ sourcePath, referencePath, originalHash, referenceHash, outputPath, htmlPath, pageCount: 11, bytes: finishedBytes.length, layout, fonts, previewPath }, null, 2));
  console.log(`Created ${outputPath}: 11 square pages, ${(finishedBytes.length / 1_000_000).toFixed(2)} MB.`);
  console.log('PASS: page fit, original artwork, embedded Bengali fonts, searchable text, author credit, unchanged originals.');
  console.log(`Editable self-contained HTML: ${htmlPath}`);
  console.log(`PDF page previews and validation report: ${temporaryDir}`);
} finally {
  await browser.close();
}