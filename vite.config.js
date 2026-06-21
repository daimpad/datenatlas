import { execSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const appVersion = (() => {
  try {
    const count = execSync('git rev-list --count HEAD').toString().trim();
    return `v2.${count}`;
  } catch { return 'v2.0'; }
})();

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
  plugins: [minifyDataJson()],
  build: {
    rollupOptions: {
      input: {
        main:   'index.html',
        expand: 'expand.html',
      },
    },
  },
});
