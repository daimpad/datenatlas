import { execSync } from 'child_process';
import { defineConfig } from 'vite';

const buildHash = (() => {
  try { return execSync('git rev-parse --short HEAD').toString().trim(); }
  catch { return 'dev'; }
})();

export default defineConfig({
  base: './',
  define: { __BUILD_HASH__: JSON.stringify(buildHash) },
  build: {
    rollupOptions: {
      input: {
        main:   'index.html',
        expand: 'expand.html',
      },
    },
  },
});
