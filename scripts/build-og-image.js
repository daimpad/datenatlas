// Generates the 1200×630 social-share (Open Graph / Twitter) image at
// public/og-image.png. Composes a light, brand-aligned card that embeds the
// vector wordmark from public/logo.svg (font-independent) plus a tagline and
// the headline stat. Run with:  node scripts/build-og-image.js
// Requires `sharp` (install ad-hoc: `npm i --no-save sharp`); not a build
// dependency — the PNG is committed as a static asset and only regenerated when
// the branding or headline numbers change.
import fs from 'fs';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('..', import.meta.url));
const logoRaw = fs.readFileSync(`${root}public/logo.svg`, 'utf8');

// Strip the outer <svg …> wrapper, keep inner markup (defs + paths) so it can be
// nested with its own coordinate system.
const logoInner = logoRaw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const W = 1200, H = 630;
const LOGO_W = 660, LOGO_AR = 1110.87 / 191.14;
const LOGO_H = LOGO_W / LOGO_AR;          // ≈ 113.6
const LOGO_X = (W - LOGO_W) / 2;
const LOGO_Y = 232;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f7f7f7"/>
  <rect width="${W}" height="${H}" fill="none" stroke="#e6d5ff" stroke-width="2"/>
  <!-- top accent bar (brand → sector hues) -->
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6200a8"/>
      <stop offset="0.55" stop-color="#8b2be2"/>
      <stop offset="1" stop-color="#db2777"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${W}" height="10" fill="url(#bar)"/>

  <!-- brand diamond mark -->
  <g transform="translate(${W / 2}, 138)">
    <rect x="-34" y="-34" width="68" height="68" rx="14" fill="#6200a8"/>
    <path d="M0 -22 22 0 0 22 -22 0Z" fill="none" stroke="#ffffff" stroke-width="3.6"/>
    <path d="M0 -11 11 0 0 11 -11 0Z" fill="#ffffff"/>
  </g>

  <!-- wordmark (vector, embedded from logo.svg) -->
  <svg x="${LOGO_X}" y="${LOGO_Y}" width="${LOGO_W}" height="${LOGO_H}" viewBox="0 0 1110.87 191.14" preserveAspectRatio="xMidYMid meet">${logoInner}</svg>

  <!-- tagline -->
  <text x="${W / 2}" y="408" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="30" fill="#5c4a7a">Open-Data-Potenziale der deutschen Datenlandschaft</text>

  <!-- headline stat -->
  <text x="${W / 2}" y="478" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="34" font-weight="bold" fill="#6200a8">10.149 Datentypen · 8 Sektoren · 4-stufige Taxonomie</text>

  <!-- domain -->
  <text x="${W / 2}" y="560" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="22" letter-spacing="2" fill="#a899be">datenatlas.de</text>
</svg>`;

const { default: sharp } = await import('sharp');
await sharp(Buffer.from(og)).png().toFile(`${root}public/og-image.png`);
const { width, height, size } = await sharp(`${root}public/og-image.png`).metadata();
console.log(`og-image.png: ${width}×${height}, ${(size / 1024).toFixed(1)} kB`);
