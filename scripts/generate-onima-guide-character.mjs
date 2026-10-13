import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const directory = resolve('public/assets/images/guide');
await mkdir(directory, { recursive: true });

for (const expression of ['open', 'blink']) {
  const eyes = expression === 'open'
    ? '<path d="M207 164q13-11 27 0m42 0q13-11 27 0" fill="none" stroke="#293445" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="222" cy="168" rx="7" ry="10" fill="#263747"/><ellipse cx="290" cy="168" rx="7" ry="10" fill="#263747"/><circle cx="224" cy="164" r="2.5" fill="#fff"/><circle cx="292" cy="164" r="2.5" fill="#fff"/>'
    : '<path d="M207 169q14 10 28 0m41 0q14 10 28 0" fill="none" stroke="#293445" stroke-width="4.5" stroke-linecap="round"/>';
  const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <radialGradient id="skin" cx=".34" cy=".25" r=".85"><stop stop-color="#ffe0c5"/><stop offset=".62" stop-color="#efb38e"/><stop offset="1" stop-color="#cf8067"/></radialGradient>
      <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#313848"/><stop offset=".58" stop-color="#171f2e"/><stop offset="1" stop-color="#0d1521"/></linearGradient>
      <linearGradient id="dress" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6aaad7"/><stop offset=".55" stop-color="#367db8"/><stop offset="1" stop-color="#245b91"/></linearGradient>
      <linearGradient id="book" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd86b"/><stop offset="1" stop-color="#e5a938"/></linearGradient>
      <radialGradient id="shadow"><stop stop-color="#183042" stop-opacity=".2"/><stop offset="1" stop-color="#183042" stop-opacity="0"/></radialGradient>
      <filter id="soft-shadow" x="-25%" y="-20%" width="150%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#13293a" flood-opacity=".22"/></filter>
    </defs>
    <ellipse cx="255" cy="478" rx="102" ry="17" fill="url(#shadow)"/>
    <g stroke="#314256" stroke-width="3.5" stroke-linejoin="round" filter="url(#soft-shadow)">
      <path d="M211 398l-7 54 31 2 13-56m24 0 8 56 31-2-5-57" fill="#f5f1e8"/>
      <path d="M201 449q-17 8-17 24h55l2-22m37 1 2 21h56q-2-17-23-25" fill="#263e5b"/>
      <path d="M188 470h48m47 0h48" fill="none" stroke="#182c43" stroke-width="5" stroke-linecap="round"/>
      <path d="M165 274q-19 38-25 126 111 36 230 0-8-88-27-126-76-43-178 0z" fill="url(#dress)"/>
      <path d="M163 394q102 27 207 0" fill="none" stroke="#dbeefd" stroke-width="5"/>
      <path d="M177 296q-23 33-35 71m192-71q24 33 35 71" fill="none" stroke="#8dc2e4" stroke-width="4" stroke-linecap="round"/>
      <path d="M205 249q0 27 50 39 48-12 49-39" fill="#f8fbfc"/>
      <path d="M205 249l50 39-22 25-54-49zm99 0-49 39 22 25 54-50z" fill="#fff"/>
      <path d="M237 287l18 14 18-14" fill="none" stroke="#c7dbe8" stroke-width="3"/>
      <path d="M176 276q-28 7-42-13l-20-31 25-18 23 30 30 11z" fill="url(#dress)"/>
      <path d="M124 232c-11 7-24 6-33-2l-21-23c-5-6-3-12 2-14 3-1 6 1 9 4l10 10-13-24c-3-6 0-11 5-12 5-1 8 2 10 7l8 21-7-29c-2-6 2-11 7-11s8 4 9 9l5 29-1-30c0-7 5-10 10-8 5 1 7 5 7 11v29l5-18c2-7 7-9 12-6 4 3 4 7 2 13l-5 23c-2 10-9 17-21 21z" fill="url(#skin)" stroke="#a76455" stroke-width="2.5"/>
      <path d="M91 207l-4-8m14 0-4-13m18 11-1-14m18 17 4-11m-43 27q15 8 29 0" fill="none" stroke="#bc795f" stroke-width="2" stroke-linecap="round"/>
      <path d="M334 275q26 7 33 37l8 38-29 7-12-35-27-30z" fill="url(#dress)"/>
      <path d="M347 347q5 33 24 31 17-1 15-16l-10-26z" fill="url(#skin)" stroke="#a76455" stroke-width="2.5"/>
      <g transform="rotate(7 338 359)">
        <rect x="289" y="321" width="76" height="95" rx="6" fill="url(#book)" stroke="#9f712a"/>
        <path d="M298 326v84" stroke="#fff1b8" stroke-width="4"/>
        <path d="M326 349q15-17 30 0 0 17-15 27-15-10-15-27z" fill="#ef6c73" stroke="#a6404a" stroke-width="2"/>
        <path d="M311 398h41" stroke="#fff5cf" stroke-width="5" stroke-linecap="round"/>
      </g>
      <path d="M356 347q18-7 20 5l-1 20q-6 11-16 2l-8-13q-4-9 5-14z" fill="url(#skin)" stroke="#a76455" stroke-width="2.5"/>
      <path d="M210 235l-2 34q47 35 96-1l-4-34" fill="url(#skin)" stroke="#a76455"/>
      <path d="M174 124q-53-21-65 22-10 37 35 61l38-22z" fill="url(#hair)" stroke="#182131"/>
      <path d="M338 124q53-21 65 22 10 37-35 61l-38-22z" fill="url(#hair)" stroke="#182131"/>
      <circle cx="146" cy="134" r="12" fill="#f3c64d" stroke="#aa7c27" stroke-width="2"/>
      <circle cx="366" cy="134" r="12" fill="#f3c64d" stroke="#aa7c27" stroke-width="2"/>
      <ellipse cx="175" cy="179" rx="14" ry="19" fill="url(#skin)" stroke="#a76455"/>
      <ellipse cx="337" cy="179" rx="14" ry="19" fill="url(#skin)" stroke="#a76455"/>
      <path d="M183 97q73-58 147 0l12 77q-7 77-87 79-78-4-86-79z" fill="url(#skin)" stroke="#a76455"/>
      <path d="M170 158q-4-64 40-87 51-28 101 5 35 23 31 82-42-11-68-49-28 35-104 49z" fill="url(#hair)" stroke="#182131"/>
      <path d="M184 115q25-37 70-38m27 5q33 11 46 43" fill="none" stroke="#596071" stroke-width="5" stroke-linecap="round"/>
      <path d="M206 145q14-8 29-1m41 0q15-7 29 1" fill="none" stroke="#593b3d" stroke-width="4" stroke-linecap="round"/>
      ${eyes}
      <path d="M253 171l-5 17q7 5 14 0" fill="none" stroke="#bd765f" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="203" cy="194" rx="14" ry="7" fill="#dc7c78" opacity=".32" stroke="none"/><ellipse cx="309" cy="194" rx="14" ry="7" fill="#dc7c78" opacity=".32" stroke="none"/>
      <path d="M231 207q25 19 50 0-4 28-46 8z" fill="#9f4f57" stroke="#9f4f57" stroke-width="2"/>
      <path d="M235 208q21 10 41 0l-5 8q-17 6-31 0z" fill="#fff8ee" stroke="none"/>
    </g>
  </svg>`;
  const output = resolve(directory, `onima-${expression}.webp`);
  await sharp(Buffer.from(artwork)).resize(512, 512).webp({ quality: 92, alphaQuality: 100 }).toFile(output);
  const image = await sharp(output).metadata();
  assert.equal(image.width, 512);
  assert.equal(image.height, 512);
  assert.equal(image.hasAlpha, true);
  const { channels } = await sharp(output).stats();
  assert.equal(channels[3].min, 0);
  assert.equal(channels[3].max, 255);
  console.log(`${output}: Onima story guide, transparent, 512 x 512`);
}