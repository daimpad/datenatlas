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
      const { entries } = JSON.parse(json);
      console.log(`[search-index] ${entries.length} entries, ${(Buffer.byteLength(json) / 1048576).toFixed(2)} MB`);
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

export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(appVersion) },
  plugins: [searchIndex(), minifyDataJson()],
  build: {
    rollupOptions: {
      input: {
        main:   'index.html',
        expand: 'expand.html',
      },
    },
  },
});
