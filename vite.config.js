import { execSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { buildSlimIndex } from './scripts/build-search-index.js';

const DATA_DIR = fileURLToPath(new URL('./public/data', import.meta.url));

const appVersion = (() => {
  try {
    const count = execSync('git rev-list --count HEAD').toString().trim();
    return `v2.${count}`;
  } catch { return 'v2.0'; }
})();

// Generates the slim client search index (data/search-index.json) from the full
// taxonomy source files — as a dev-server route and as a build asset. The index
// is never written into the source tree and never committed; adding new data
// types stays unchanged (edit sector JSON → validate → commit; index rebuilds).
function searchIndex() {
  return {
    name: 'search-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url.endsWith('/data/search-index.json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(buildSlimIndex(DATA_DIR));
          return;
        }
        next();
      });
    },
    generateBundle() {
      const json = buildSlimIndex(DATA_DIR);
      this.emitFile({ type: 'asset', fileName: 'data/search-index.json', source: json });
      const { p, e } = JSON.parse(json);
      console.log(`[search-index] v2: ${e.length} entries, ${p.length} paths, ${(Buffer.byteLength(json) / 1048576).toFixed(2)} MB`);
    },
  };
}

// Minify the taxonomy JSON in the build output (dist/data) without touching the
// readable source files in public/data. Whitespace removal cuts the shipped
// payload ~40% and reduces client-side JSON.parse time for the search index.
function minifyDataJson() {
  return {
    name: 'minify-data-json',
    apply: 'build',
    closeBundle() {
      let dir;
      try { dir = fileURLToPath(new URL('./dist/data', import.meta.url)); }
      catch { return; }
      if (!fs.existsSync(dir)) return;
      let before = 0, after = 0;
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.json')) continue;
        const p = `${dir}/${file}`;
        const raw = fs.readFileSync(p, 'utf8');
        before += Buffer.byteLength(raw);
        let min;
        try { min = JSON.stringify(JSON.parse(raw)); }
        catch { continue; } // leave malformed files untouched
        fs.writeFileSync(p, min);
        after += Buffer.byteLength(min);
      }
      if (before) {
        const mb = n => (n / 1048576).toFixed(1);
        console.log(`[minify-data-json] dist/data: ${mb(before)} MB → ${mb(after)} MB`);
      }
    },
  };
}

// Emit pre-compressed .br/.gz siblings for the large text assets. Apache serves
// them via the rewrite rules in public/.htaccess (Netcup); GitHub Pages ignores
// them and applies its own gzip, so this is additive and never breaks a host.
// Must run after minify-data-json so the minified JSON is what gets compressed.
function precompress({ minBytes = 4096 } = {}) {
  const EXT = /\.(json|js|css|svg|html|xml|webmanifest|txt)$/;
  return {
    name: 'precompress',
    apply: 'build',
    async closeBundle() {
      let dir;
      try { dir = fileURLToPath(new URL('./dist', import.meta.url)); }
      catch { return; }
      if (!fs.existsSync(dir)) return;

      const { brotliCompressSync, gzipSync, constants } = await import('zlib');
      let files = 0, before = 0, brAfter = 0;

      const walk = (d) => {
        for (const name of fs.readdirSync(d)) {
          const p = `${d}/${name}`;
          if (fs.statSync(p).isDirectory()) { walk(p); continue; }
          if (!EXT.test(name) || name.endsWith('.br') || name.endsWith('.gz')) continue;
          const raw = fs.readFileSync(p);
          if (raw.length < minBytes) continue;
          const br = brotliCompressSync(raw, {
            params: {
              [constants.BROTLI_PARAM_QUALITY]: 11,
              [constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
            },
          });
          fs.writeFileSync(`${p}.br`, br);
          fs.writeFileSync(`${p}.gz`, gzipSync(raw, { level: 9 }));
          files++; before += raw.length; brAfter += br.length;
        }
      };
      walk(dir);

      if (files) {
        const mb = n => (n / 1048576).toFixed(2);
        console.log(`[precompress] ${files} Dateien: ${mb(before)} MB → ${mb(brAfter)} MB brotli (+ .gz)`);
      }
    },
  };
}

const SITE_URL = 'https://datenatlas.de';

function readSectors() {
  return JSON.parse(fs.readFileSync(`${DATA_DIR}/main.json`, 'utf8'));
}

// SEO plugin: injects structured data (JSON-LD) and a crawlable, screen-reader
// text outline of the sectors into index.html, and emits sitemap.xml. Both the
// JSON-LD DataCatalog and the outline are generated from public/data/main.json,
// so adding/renaming a sector requires no manual edits here — same philosophy
// as the search index. Runs in dev and build via transformIndexHtml.
function seo() {
  const isIndex = (ctx) => {
    const p = ctx.path || ctx.filename || '';
    return p.includes('index.html');
  };
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return {
    name: 'seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!isIndex(ctx)) return html;
        const sectors = readSectors();

        const org = { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'Datenatlas', url: `${SITE_URL}/`, logo: `${SITE_URL}/logo.svg` };
        const jsonLd = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`,
              name: 'Datenatlas',
              description: 'Interaktiver Atlas der deutschen Datenlandschaft: 10.149 öffentliche Datentypen aus 8 Sektoren und ihr Open-Data-Potenzial.',
              inLanguage: 'de-DE', publisher: { '@id': `${SITE_URL}/#org` },
              // Sitelinks searchbox — the ?q= parameter is handled at boot in
              // main.js, which opens the search overlay with the term applied.
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            },
            org,
            {
              '@type': 'DataCatalog', '@id': `${SITE_URL}/#catalog`,
              name: 'Datenatlas — Taxonomie öffentlicher Datentypen',
              description: 'Vierstufige Taxonomie (Sektor → Organisation → Aktivität → Datentyp) öffentlicher Datentypen in Deutschland mit Bewertung des Open-Data-Potenzials.',
              url: `${SITE_URL}/`, inLanguage: 'de-DE',
              publisher: { '@id': `${SITE_URL}/#org` },
              dataset: sectors.map((s) => ({
                '@type': 'Dataset', name: s.name, description: s.description,
                url: `${SITE_URL}/#${s.id}`, inLanguage: 'de-DE',
                isPartOf: { '@id': `${SITE_URL}/#catalog` },
                creator: { '@id': `${SITE_URL}/#org` },
              })),
            },
          ],
        };
        const ldTag = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

        const items = sectors.map((s) =>
          `<li><a href="#${esc(s.id)}"><strong>${esc(s.name)}</strong> — ${esc(s.description)}</a></li>`
        ).join('');
        const outline =
          `<section id="seo-outline" class="visually-hidden">` +
          `<h1>Datenatlas — Open-Data-Potenziale der deutschen Datenlandschaft</h1>` +
          `<p>Der Datenatlas visualisiert 10.149 öffentliche Datentypen aus 8 gesellschaftlichen Sektoren und zeigt ihr Open-Data-Potenzial. Die Taxonomie ist vierstufig: Sektor, Organisation, Aktivität, Datentyp.</p>` +
          `<nav aria-label="Sektoren"><ul>${items}</ul></nav>` +
          `</section>`;

        return html
          .replace('</head>', `${ldTag}\n</head>`)
          .replace('<body>', `<body>\n  ${outline}`);
      },
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.w3.org/2000/sitemaps/0.9">\n` +
        `  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
        `  <url><loc>${SITE_URL}/ueber.html</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n` +
        `</urlset>\n`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}

export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(appVersion) },
  plugins: [searchIndex(), minifyDataJson(), seo(), precompress()],
  build: {
    rollupOptions: {
      input: {
        main:   'index.html',
        ueber:  'ueber.html',
        expand: 'expand.html',
      },
    },
  },
});
