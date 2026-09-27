// Re-encodes raster images from ./legacy-images (or SRC env) into public/assets/images.
// Keeps original file names (legacy JS/CSS reference them) and emits .webp siblings.
// Usage: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, extname, basename, dirname, relative } from 'node:path';

const SRC = process.env.SRC ?? 'legacy-images';
const OUT = 'public/assets/images';
const MAX_W = { badges: 800, modules: 1400, covers: 900, default: 1800 };

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g|webp)$/i.test(name)) yield p;
  }
}

let before = 0, after = 0;
for (const file of walk(SRC)) {
  if (statSync(file).size === 0) { console.warn('skip empty', file); continue; }
  const rel = relative(SRC, file);
  const folder = dirname(rel).split('/')[0];
  const maxW = MAX_W[folder] ?? MAX_W.default;
  const outDir = join(OUT, dirname(rel));
  mkdirSync(outDir, { recursive: true });
  const base = basename(rel, extname(rel));
  const ext = extname(rel).toLowerCase();
  const input = sharp(file).rotate();
  const meta = await input.metadata();
  const width = Math.min(meta.width ?? maxW, maxW);
  before += statSync(file).size;

  // Same-name output (format inferred from the legacy extension so paths keep working).
  const outSame = join(outDir, base + ext);
  const pipeline = sharp(file).rotate().resize({ width, withoutEnlargement: true });
  if (ext === '.png') {
    // Most "png" files are actually JPEG photos; keep alpha-capable PNG only when needed.
    if (meta.hasAlpha) await pipeline.png({ compressionLevel: 9, palette: true, quality: 85 }).toFile(outSame);
    else await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(outSame);
  } else {
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(outSame);
  }
  await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(outDir, base + '.webp'));
  after += statSync(outSame).size;
  console.log(rel.padEnd(42), `${(statSync(file).size / 1024).toFixed(0)}K → ${(statSync(outSame).size / 1024).toFixed(0)}K`);
}
console.log(`\nTotal: ${(before / 1024 / 1024).toFixed(1)}M → ${(after / 1024 / 1024).toFixed(1)}M`);
