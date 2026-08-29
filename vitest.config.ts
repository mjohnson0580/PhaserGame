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
    include: ['src/**/*.spec.ts']
  }
});
