import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

// Merged with the app's Vite config so tests run through the exact same
// transform pipeline as the build — any plugin, alias, or `define` added to
// vite.config.ts automatically applies here too. See https://vitest.dev/config/
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // happy-dom supplies the `window`/`document`/`HTMLCanvasElement` globals
      // Phaser reaches for at import time, so `import Phaser from 'phaser'`
      // doesn't throw. Chosen over jsdom because it's faster and has no undici
      // dependency — jsdom 30 pulls in undici 8, which needs Node >= 22.6 and
      // hard-fails the whole run on older runtimes.
      environment: 'happy-dom',
      // Use describe/it/expect without importing them in every file.
      globals: true,
      // Runs once before the suite to stub the browser APIs happy-dom leaves
      // out (canvas 2D/WebGL contexts). See test/setup.ts.
      setupFiles: ['./test/setup.ts'],
      // Spec files live alongside the code they cover (e.g. MainScene.spec.ts
      // next to MainScene.ts).
      include: ['src/**/*.spec.ts'],
      coverage: {
        // V8's built-in coverage — no extra instrumentation pass, so it's fast.
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        // Every file matching `include` is reported, not just the ones a test
        // happened to import — so untested modules show up as 0% rather than
        // vanishing from the report.
        include: ['src/**/*.ts'],
        // Note: the terminal table omits fully-covered files (they still count
        // toward the totals) — open coverage/index.html for the complete list.
        // Entry point and type shims have nothing meaningful to cover.
        exclude: ['src/main.ts', 'src/vite-env.d.ts', 'src/**/*.spec.ts']
      }
    }
  })
);
