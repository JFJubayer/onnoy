import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const directory = resolve('public/assets/images/guide');
await mkdir(directory, { recursive: true });

for (const expression of ['open', 'blink']) {
  const eyes = expression === 'open'
    ? '<path d="M205 129q16-16 32 0v10q-17 16-32-1zM267 128q16-17 33-1v11q-17 16-33 0z" fill="#fffaf4" stroke="#453130" stroke-width="2.5"/><ellipse cx="224" cy="135" rx="9" ry="12" fill="#2a393c"/><ellipse cx="286" cy="134" rx="9" ry="12" fill="#2a393c"/><circle cx="227" cy="131" r="3.5" fill="#fff"/><circle cx="289" cy="130" r="3.5" fill="#fff"/><path d="M204 129l-4-4m99 2 4-4" fill="none" stroke="#453130" stroke-width="3" stroke-linecap="round"/>'
    : '<path d="M204 135q17 13 33-1m30-1q17 13 33-1" fill="none" stroke="#453130" stroke-width="4.5" stroke-linecap="round"/>';
  const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <radialGradient id="skin" cx=".3" cy=".25" r=".8"><stop stop-color="#ffdab9"/><stop offset=".58" stop-color="#eab08d"/><stop offset="1" stop-color="#c88063"/></radialGradient>
      <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#444452"/><stop offset=".5" stop-color="#282936"/><stop offset="1" stop-color="#171e2c"/></linearGradient>
      <linearGradient id="teal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#43c4aa"/><stop offset=".48" stop-color="#159a89"/><stop offset="1" stop-color="#076d68"/></linearGradient>
      <linearGradient id="scarf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe485"/><stop offset=".55" stop-color="#f7c84c"/><stop offset="1" stop-color="#dca132"/></linearGradient>
      <linearGradient id="book" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#649bdb"/><stop offset="1" stop-color="#3466a2"/></linearGradient>
      <radialGradient id="footshadow"><stop stop-color="#153d37" stop-opacity=".2"/><stop offset="1" stop-color="#153d37" stop-opacity="0"/></radialGradient>
      <filter id="shadow" x="-25%" y="-20%" width="150%" height="145%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#102d31" flood-opacity=".2"/></filter>
    </defs>
    <ellipse cx="256" cy="479" rx="106" ry="18" fill="url(#footshadow)"/>
    <g stroke="#234443" stroke-width="3.5" stroke-linejoin="round" filter="url(#shadow)">
      <path d="M297 82c47-16 70 24 53 62 29 27 24 59 5 75 21 31 12 61-10 76l-31-20 3-157z" fill="url(#hair)" stroke="#252a37"/>
      <path d="M338 159q19 12 15 33m-16 9q18 13 13 32m-14 8q13 14 5 27" fill="none" stroke="#555361" stroke-width="4"/>
      <path d="M327 275l23 8-7 15-23-9z" fill="url(#scarf)" stroke="#bb8a2d" stroke-width="2"/>
      <path d="M218 386l-6 67 33 1 12-66m14 1 2 65 32 1 6-66" fill="#edf3f6"/>
      <path d="M211 449c-13 5-20 16-15 24h48l4-22m27 0-3 22h53c4-10-9-23-23-25" fill="#e7f5eb"/>
      <path d="M199 468h45m33 0h43" stroke="#167d74" stroke-width="5" stroke-linecap="round"/>
      <path d="M231 182l-4 43q23 28 53 0l-5-43" fill="url(#skin)" stroke="#9c624f"/>
      <path d="M211 233c-13 24-22 39-40 25l-26-42 29-15 26 31z" fill="url(#teal)"/>
      <path d="M166 213l-18-30-5-30c-2-7-9-6-10 1l1 21-7-36c-2-8-10-7-10 1l3 34-11-29c-3-7-11-4-8 4l9 34-12-15c-5-6-12-1-7 6l14 28c8 16 17 17 27 13l16 17z" fill="url(#skin)" stroke="#9c624f" stroke-width="2.5"/>
      <path d="M126 190q8-10 17-4m-22 16 15-5" fill="none" stroke="#c48568" stroke-width="2" stroke-linecap="round"/>
      <path d="M213 218q39-10 76 3c19 8 27 29 28 47l6 119q-62 28-124-1l-2-118c0-23 5-39 16-50z" fill="url(#teal)"/>
      <path d="M214 259l-1 105m90-106 6 105" fill="none" stroke="#71d4bc" stroke-width="4" stroke-linecap="round"/>
      <path d="M209 377q56 22 105 0" fill="none" stroke="#075d59" stroke-width="5"/>
      <path d="M218 217l-15 27 42 37 20-23-23-17 37-12-10-15-27 17z" fill="url(#scarf)" stroke="#b48b31" stroke-width="2.5"/>
      <path d="M247 274l-14 56 27 24 16-80" fill="url(#scarf)" stroke="#b48b31" stroke-width="2.5"/>
      <path d="M241 328l17 15m-17-25 20 17" stroke="#fff0a8" stroke-width="3"/>
      <path d="M304 241c30 12 45 36 46 67l-24 11-14-43z" fill="url(#teal)"/>
      <path d="M327 302l8 39 23-7-12-32z" fill="url(#skin)" stroke="#9c624f"/>
      <g transform="rotate(-10 341 342)">
        <rect x="304" y="301" width="64" height="88" rx="5" fill="url(#book)" stroke="#264b74"/>
        <path d="M310 305v79" stroke="#b2d8f4" stroke-width="3"/>
        <path d="M319 378h39" stroke="#f4fafc" stroke-width="5"/>
        <path d="M340 323l14 8v16l-14 8-14-8v-16z" fill="none" stroke="#f6dc74" stroke-width="3"/>
        <path d="M326 331l14 8 14-8m-14 8v16" fill="none" stroke="#f6dc74" stroke-width="2"/>
      </g>
      <path d="M347 329q16-7 18 3l-3 23q-7 8-14 0l-5-12c-4-7-1-11 4-14z" fill="url(#skin)" stroke="#9c624f" stroke-width="2.5"/>
      <path d="M181 110c-13-53 36-84 83-77 66-2 101 53 77 118l-13 38-139-8z" fill="url(#hair)" stroke="#252a37"/>
      <ellipse cx="190" cy="143" rx="13" ry="18" fill="url(#skin)" stroke="#9c624f"/>
      <ellipse cx="322" cy="142" rx="12" ry="18" fill="url(#skin)" stroke="#9c624f"/>
      <path d="M194 91c28-25 78-26 115 5l10 41c-1 45-22 68-60 70-36-1-64-28-66-65z" fill="url(#skin)" stroke="#9c624f" stroke-width="3"/>
      <path d="M186 122c-8-39 4-62 40-73 37-14 82 4 96 36l5 40c-31-9-51-24-65-41-13 22-46 37-76 38z" fill="url(#hair)" stroke="#252a37"/>
      <path d="M199 81q21-22 50-21m24 3q23 8 34 27" fill="none" stroke="#626170" stroke-width="5" stroke-linecap="round"/>
      <path d="M207 114q13-7 28-2m35-1q14-7 26-1" fill="none" stroke="#473338" stroke-width="5" stroke-linecap="round"/>
      ${eyes}
      <path d="M254 138l-5 17q7 5 13 0" fill="none" stroke="#bd7a62" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="211" cy="160" rx="12" ry="6" fill="#d67c77" opacity=".3" stroke="none"/><ellipse cx="294" cy="159" rx="12" ry="6" fill="#d67c77" opacity=".3" stroke="none"/>
      <path d="M233 174q20 15 42-2c-4 23-30 27-42 2z" fill="#914d51" stroke="#914d51" stroke-width="2"/>
      <path d="M236 174q18 9 35-1l-4 7q-15 6-27 0z" fill="#fff8ef" stroke="none"/>
      <circle cx="189" cy="164" r="4" fill="#ffe48a" stroke="#bc9132" stroke-width="1.5"/><circle cx="323" cy="162" r="4" fill="#ffe48a" stroke="#bc9132" stroke-width="1.5"/>
    </g>
  </svg>`;
  const output = resolve(directory, `bindu-${expression}.webp`);
  await sharp(Buffer.from(artwork)).resize(512, 512).webp({ quality: 92, alphaQuality: 100 }).toFile(output);
  const image = await sharp(output).metadata();
  assert.equal(image.width, 512);
  assert.equal(image.height, 512);
  assert.equal(image.hasAlpha, true);
  const { channels } = await sharp(output).stats();
  assert.equal(channels[3].min, 0);
  assert.equal(channels[3].max, 255);
  console.log(`${output}: original female mentor, transparent, 512 x 512`);
}