import { defineConfig, devices } from '@playwright/test';

// Must match `server.port` in vite.config.ts.
const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

// End-to-end tests — the third testing layer (see README). Vitest covers pure
// logic and scene wiring in a fake DOM; Playwright drives the *real* game in a
// real browser, which is the only place collision, physics and input actually
// behave like they do for a player.
export default defineConfig({
  // Kept out of `src/` so Vitest (which only collects `src/**/*.spec.ts`)
  // never tries to run these, and vice versa.
  testDir: './e2e',
  fullyParallel: true,
  // Fail the build if a `test.only` was committed by accident.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    // Records a full trace (DOM snapshots, console, network) on a retried
    // failure. Open it with `npx playwright show-trace <trace.zip>`.
    trace: 'on-first-retry'
  },

  // Chromium only: a Phaser game is one <canvas>, so cross-browser rendering
  // differences that matter for DOM apps mostly don't apply here. Add firefox
  // or webkit if you ship features with real engine-level differences (audio
  // codecs and WebGL extensions are the usual suspects).
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // vite.config.ts sets `server.open: true` so `npm run dev` pops a browser
    // for day-to-day work. Vite skips that when BROWSER=none, so the test run
    // stays headless without the app config needing a test-only branch.
    env: { BROWSER: 'none' }
  }
});
