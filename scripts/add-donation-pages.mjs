import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFArray, PDFBool, PDFDict, PDFDocument, PDFHexString, PDFName, PDFString } from 'pdf-lib';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import jsQR from 'jsqr';

const publications = JSON.parse(await readFile(new URL('../src/data/publications.json', import.meta.url), 'utf8'));
const baseUrl = process.env.BASE ?? 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_PATH ?? execFileSync('which', ['google-chrome'], { encoding: 'utf8' }).trim();
const marker = PDFName.of('OnnoyDonationPage');
const temporaryDir = await mkdtemp(join(tmpdir(), 'onnoy-donation-pdfs-'));
const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
const updates = [];

async function decodeQr(image) {
  const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height, { inversionAttempts: 'dontInvert' })?.data;
}

function donationLinks(document, page) {
  const annotations = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray);
  if (!annotations) return [];
  return annotations.asArray().flatMap((reference) => {
    const annotation = document.context.lookup(reference, PDFDict);
    const action = annotation.lookupMaybe(PDFName.of('A'), PDFDict);
    if (!action) return [];
    const uri = document.context.lookup(action.get(PDFName.of('URI')));
    return uri instanceof PDFString || uri instanceof PDFHexString ? [uri.decodeText()] : [];
  });
}

try {
  const page = await browser.newPage({ colorScheme: 'light' });
  await page.goto(new URL('/donate', baseUrl).href, { waitUntil: 'load' });
  const donationUrl = await page.locator('#donation-link').getAttribute('href');
  assert.equal(donationUrl, 'https://www.chabondhu.com/onnoy', 'Donation destination must be the approved ChaBondhu account');
  const qrSource = await page.locator('#donation-print-qr').getAttribute('src');
  assert.ok(qrSource?.startsWith('data:image/png;base64,'), 'The printable QR must be embedded');
  assert.equal(await decodeQr(Buffer.from(qrSource.split(',')[1], 'base64')), donationUrl, 'The QR must resolve to the donation link');
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });

  for (const publication of publications) {
    const sourcePath = fileURLToPath(new URL(`../public${publication.pdf}`, import.meta.url));
    const originalBytes = await readFile(sourcePath);
    const document = await PDFDocument.load(originalBytes, { updateMetadata: false });
    const markedPages = document.getPages().flatMap((pdfPage, index) => pdfPage.node.get(marker) === PDFBool.True ? [index] : []);
    assert.ok(markedPages.length <= 1, `${publication.title}: duplicate donation pages`);
    if (markedPages.length) {
      assert.equal(markedPages[0], document.getPageCount() - 1, 'Only the final page may be replaced');
      document.removePage(markedPages[0]);
    }

    const originalCount = document.getPageCount();
    const originalSizes = document.getPages().map((pdfPage) => pdfPage.getSize());
    const { width, height } = document.getPage(originalCount - 1).getSize();
    const format = Math.min(width, height) < 300 ? 'compact' : 'standard';
    await page.setViewportSize({ width: Math.ceil(width * 4 / 3), height: Math.ceil(height * 4 / 3) });
    await page.evaluate(async (pdfFormat) => {
      document.documentElement.dataset.pdfFormat = pdfFormat;
      document.documentElement.setAttribute('data-theme', 'light');
      await document.fonts.ready;
      await Promise.all(Array.from(document.querySelectorAll('.donation-print img')).map((image) => image.decode()));
    }, format);

    const closingBytes = await page.pdf({
      width: `${width / 72}in`,
      height: `${height / 72}in`,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground: true,
      preferCSSPageSize: false,
      tagged: true,
    });
    const closingDocument = await PDFDocument.load(closingBytes, { updateMetadata: false });
    assert.equal(closingDocument.getPageCount(), 1, `${publication.title}: closing page must fit on one page`);
    const [closingPage] = await document.copyPages(closingDocument, [0]);
    closingPage.setSize(width, height);
    closingPage.node.set(marker, PDFBool.True);
    document.addPage(closingPage);

    const updatedBytes = await document.save();
    const verified = await PDFDocument.load(updatedBytes, { updateMetadata: false });
    const finalPage = verified.getPage(verified.getPageCount() - 1);
    assert.equal(verified.getPageCount(), originalCount + 1);
    assert.deepEqual(verified.getPages().slice(0, originalCount).map((pdfPage) => pdfPage.getSize()), originalSizes);
    assert.deepEqual(finalPage.getSize(), { width, height });
    assert.ok(donationLinks(verified, finalPage).includes(donationUrl), `${publication.title}: missing clickable donation link`);

    const fileName = basename(sourcePath);
    const stagedPath = join(temporaryDir, fileName);
    const previewPrefix = join(temporaryDir, `${fileName}-last-page`);
    await writeFile(stagedPath, updatedBytes);
    await writeFile(join(temporaryDir, `${fileName}.original.pdf`), originalBytes);
    execFileSync('pdftoppm', ['-f', String(verified.getPageCount()), '-l', String(verified.getPageCount()), '-singlefile', '-scale-to', '1800', '-png', stagedPath, previewPrefix]);
    assert.equal(await decodeQr(`${previewPrefix}.png`), donationUrl, `${publication.title}: embedded final-page QR must scan correctly`);
    updates.push({ sourcePath, stagedPath, fileName, originalCount, totalCount: verified.getPageCount() });
  }

  for (const update of updates) {
    await copyFile(update.stagedPath, update.sourcePath);
    console.log(`${update.fileName}: ${update.originalCount} -> ${update.totalCount} pages; original sizes, clickable link, and embedded QR verified.`);
  }
  console.log(`Originals and final-page previews: ${temporaryDir}`);
} finally {
  await browser.close();
}