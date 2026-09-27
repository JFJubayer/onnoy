// Dev QA helper: scroll a local page in headless Chrome and report/screenshot.
// Usage: node scripts/scroll-check.mjs [route] [scrollY]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const route = process.argv[2] ?? '/';
const y = Number(process.argv[3] ?? 1200);
const port = 9333;
const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${port}`, '--window-size=1400,900', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await sleep(1500);
  const [tab] = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const j = JSON.parse(m.data); if (j.id && pending.has(j.id)) { pending.get(j.id)(j.result); pending.delete(j.id); } };
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

  await send('Page.enable');
  await send('Page.navigate', { url: `http://localhost:4321${route}` });
  await sleep(2500);
  console.log('before', await ev(`JSON.stringify({navH: document.querySelector('.nav-container').getBoundingClientRect().height, hidden: document.querySelectorAll('[data-reveal]:not(.visible), .fade-in:not(.visible)').length})`));
  await ev(`scrollTo(0, ${y})`);
  await sleep(1300);
  console.log('after ', await ev(`JSON.stringify({scrollY, scrolled: document.querySelector('.navbar').classList.contains('is-scrolled'), navH: document.querySelector('.nav-container').getBoundingClientRect().height, navW: Math.round(document.querySelector('.nav-container').getBoundingClientRect().width), revealed: document.querySelectorAll('[data-reveal].visible').length, hidden: document.querySelectorAll('[data-reveal]:not(.visible)').length})`));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync('/tmp/onnoy-shots/scrolled.png', Buffer.from(shot.data, 'base64'));
  console.log('→ /tmp/onnoy-shots/scrolled.png');
} finally {
  chrome.kill();
}
