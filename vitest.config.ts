import { defineConfig } from 'vitest/config';

// Vitest reuses Vite's transform pipeline, so TypeScript + path handling match
// the app build exactly. See https://vitest.dev/config/
export default defineConfig({
  test: {
    // jsdom gives Phaser the `window`/`document`/`HTMLCanvasElement` globals it
    // reaches for at import time, so `import Phaser from 'phaser'` doesn't throw.
    environment: 'jsdom',
    // Use describe/it/expect without importing them in every file.
    globals: true,
    // Runs once before the suite to stub the browser APIs jsdom leaves out
    // (canvas 2D/WebGL contexts). See test/setup.ts.
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
});
