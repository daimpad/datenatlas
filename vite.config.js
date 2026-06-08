import { readFileSync, writeFileSync } from 'fs';
import { defineConfig } from 'vite';

const versionFile = new URL('./version.json', import.meta.url).pathname;
const versionData = JSON.parse(readFileSync(versionFile, 'utf8'));

// Increment build counter on every production build
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  versionData.build += 1;
  writeFileSync(versionFile, JSON.stringify(versionData, null, 0) + '\n');
}

const appVersion = `v2.${versionData.build}`;

export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(appVersion) },
  build: {
    rollupOptions: {
      input: {
        main:   'index.html',
        expand: 'expand.html',
      },
    },
  },
});
