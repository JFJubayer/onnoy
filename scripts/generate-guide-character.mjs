import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const directory = resolve('public/assets/images/guide');
await mkdir(directory, { recursive: true });

for (const expression of ['open', 'blink']) {
  const eyes = expression === 'open'
    ? '<rect x="191" y="167" width="23" height="34" rx="11" fill="#8ef0c2"/><rect x="278" y="167" width="23" height="34" rx="11" fill="#8ef0c2"/><circle cx="198" cy="173" r="4" fill="#fff"/><circle cx="285" cy="173" r="4" fill="#fff"/>'
    : '<path d="M192 187h21m66 0h21" stroke="#8ef0c2" stroke-width="9" stroke-linecap="round"/>';
  const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#d9eee3"/></linearGradient>
      <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#16a57b"/><stop offset="1" stop-color="#07533f"/></linearGradient>
      <radialGradient id="footshadow"><stop stop-color="#063d2e" stop-opacity=".2"/><stop offset="1" stop-color="#063d2e" stop-opacity="0"/></radialGradient>
      <filter id="shadow" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#052e23" flood-opacity=".16"/></filter>
    </defs>
    <ellipse cx="252" cy="463" rx="143" ry="21" fill="url(#footshadow)"/>
    <g stroke="#0b4937" stroke-width="6" stroke-linejoin="round" filter="url(#shadow)">
      <path d="M206 394v36m91-36v36" stroke-width="24" stroke-linecap="round"/>
      <rect x="174" y="424" width="70" height="29" rx="14" fill="url(#green)"/>
      <rect x="267" y="424" width="70" height="29" rx="14" fill="url(#green)"/>
      <path d="M171 284l-40-41-18-57" fill="none" stroke="url(#green)" stroke-width="27" stroke-linecap="round"/>
      <circle cx="132" cy="245" r="17" fill="#e8b044"/>
      <path d="M114 188l-11-18m10 12-2-26m8 25 8-22m-4 30 17-15" fill="none" stroke="#0b4937" stroke-width="14" stroke-linecap="round"/>
      <path d="M337 289l35 42-9 31" fill="none" stroke="url(#green)" stroke-width="27" stroke-linecap="round"/>
      <circle cx="372" cy="334" r="15" fill="#e8b044"/>
      <circle cx="361" cy="371" r="17" fill="url(#shell)"/>
      <path d="M250 224v31" stroke-width="30" stroke-linecap="round"/>
      <path d="M194 255h114c23 0 40 18 40 41v61c0 24-16 44-40 46l-111-1c-23-2-40-21-40-45v-62c0-22 15-40 37-40z" fill="url(#shell)"/>
      <path d="M183 350h137v14c0 15-12 27-27 27h-82c-16 0-28-12-28-27z" fill="url(#green)" stroke="none"/>
      <circle cx="250" cy="307" r="29" fill="#edf8f1" stroke-width="3"/>
      <path d="M250 283l22 13v24l-22 13-22-13v-24z" fill="none" stroke-width="3"/>
      <path d="M250 307l-22-11m22 11 22-11m-22 11v26" stroke="#dca934" stroke-width="3"/>
      <g fill="#087659" stroke="none"><circle cx="250" cy="283" r="5"/><circle cx="272" cy="296" r="5"/><circle cx="272" cy="320" r="5"/><circle cx="250" cy="333" r="5"/><circle cx="228" cy="320" r="5"/><circle cx="228" cy="296" r="5"/></g>
      <circle cx="250" cy="307" r="5" fill="#e8b044" stroke="none"/>
      <path d="M245 88V63" stroke-width="9" stroke-linecap="round"/>
      <circle cx="245" cy="49" r="15" fill="#e8b044"/>
      <rect x="119" y="143" width="24" height="54" rx="11" fill="#0c8060"/>
      <rect x="349" y="143" width="24" height="54" rx="11" fill="#0c8060"/>
      <rect x="136" y="90" width="221" height="146" rx="55" fill="url(#shell)"/>
      <path d="M159 128c5-16 26-27 46-27" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round"/>
      <rect x="158" y="139" width="176" height="79" rx="31" fill="#103e32" stroke-width="3"/>
      ${eyes}
      <path d="M231 199q15 10 30 0" fill="none" stroke="#edf8f1" stroke-width="4" stroke-linecap="round"/>
      <circle cx="168" cy="122" r="4" fill="#79b49b" stroke="none"/><circle cx="325" cy="122" r="4" fill="#79b49b" stroke="none"/>
    </g>
  </svg>`;
  const output = resolve(directory, `bindu-${expression}.webp`);
  await sharp(Buffer.from(artwork)).resize(512, 512).webp({ quality: 92, alphaQuality: 100 }).toFile(output);
  const image = await sharp(output).metadata();
  assert.equal(image.width, 512);
  assert.equal(image.height, 512);
  assert.equal(image.hasAlpha, true);
  console.log(`${output}: original transparent character, 512 x 512`);
}