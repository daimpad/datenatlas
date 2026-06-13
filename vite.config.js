import { execSync } from 'child_process';
import { defineConfig } from 'vite';

const appVersion = (() => {
  try {
    const count = execSync('git rev-list --count HEAD').toString().trim();
    return `v2.${count}`;
  } catch { return 'v2.0'; }
})();

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
