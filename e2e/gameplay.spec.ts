import { test, expect, type Page } from '@playwright/test';
import type { MainScene } from '../src/scenes/MainScene';

// Layer 3: the real game in a real browser. Nothing here is faked — a real
// canvas, real Phaser input handling, real tweens. That makes it the only layer
// where collision, physics and input can be verified honestly, and also the
// slowest, so keep it thin and put game rules in Vitest instead.

/**
 * Boot the game under a **fake clock**, so the test controls time.
 *
 * This is the whole trick to non-flaky game tests. Left alone, a game advances
 * on `requestAnimationFrame` and every assertion races the render loop — which
 * is how you end up sprinkling arbitrary `waitForTimeout`s until CI goes green.
 * `page.clock.install()` freezes time until `runFor()` asks for it, so "600ms
 * of game time" means exactly that on every machine.
 *
 * Note it must be `page.clock`, NOT Phaser's own `game.loop.sleep()` +
 * `loop.step()`: Phaser's TweenManager reads `Date.now()` directly rather than
 * the delta handed down by the TimeStep, so hand-stepping the loop advances
 * scene updates while leaving every tween frozen. `page.clock` fakes
 * `Date.now()` too, so the whole engine moves together.
 */
const BOOT_MS = 1000;

async function bootGame(page: Page, key = 'MainScene'): Promise<void> {
  await page.clock.install();
  await page.goto('/');

  // A *fixed* slice of game time, deliberately not a "pump until ready" loop:
  // every test then starts from an identical clock position, so an interaction
  // lands on the same frame every run. (Polling until ready reintroduces the
  // flake — a boot that takes one extra slice shifts every later tween by a
  // frame.) 1000ms is ~60 frames, ample for a Preloader with no assets.
  await page.clock.runFor(BOOT_MS);

  const active = await page.evaluate((k) => Boolean(window.game?.scene.isActive(k)), key);
  if (!active) {
    throw new Error(
      `Scene "${key}" was not active after ${BOOT_MS}ms of game time. ` +
        'If you have added assets to the Preloader, raise BOOT_MS.'
    );
  }
}

/** Read live state straight out of the running game. */
function readBox(page: Page) {
  return page.evaluate(() => {
    const scene = window.game!.scene.getScene('MainScene') as MainScene;
    return { angle: scene.box.angle, tweens: scene.tweens.getTweens().length };
  });
}

test.beforeEach(async ({ page }) => {
  await bootGame(page);
});

test('boots through Boot and Preloader into MainScene', async ({ page }) => {
  // Proves the whole pipeline: Vite serves it, Phaser boots, the scene chain
  // runs and a renderer actually comes up.
  const renderer = await page.evaluate(() => window.game!.renderer.type);
  expect(renderer).toBeGreaterThan(0); // CANVAS (1) or WEBGL (2), not HEADLESS (0)

  await expect(page.locator('#game canvas')).toBeVisible();
});

test('spins the box a full turn when the player clicks', async ({ page }) => {
  // At rest: one tween running (the idle bob), box unrotated.
  expect(await readBox(page)).toEqual({ angle: 0, tweens: 1 });

  await page.locator('#game canvas').click();

  // 100ms into the 600ms spin. `Cubic.out` front-loads the motion, so the box
  // is already most of the way round.
  await page.clock.runFor(100);
  const midSpin = await readBox(page);
  expect(midSpin.tweens).toBe(2); // idle bob + the new spin
  // Asserted as a range, not a magic number: retuning the tween in MainScene
  // shouldn't force you to recompute an exact easing value here.
  expect(midSpin.angle).toBeGreaterThan(90);
  expect(midSpin.angle).toBeLessThan(180);

  // Let the spin finish, with margin: 700ms total against a 600ms tween.
  // Landing exactly on the boundary is a coin flip over whether the last frame
  // completes the tween, which is precisely the flake this layer attracts.
  await page.clock.runFor(600);

  const atRest = await readBox(page);
  expect(atRest.tweens).toBe(1); // the spin tween finished and was destroyed
  // `angle` wraps to [-180, 180], so a full 360° turn lands back on 0 — assert
  // the spin *completed* rather than looking for a 360 that can never appear.
  expect(atRest.angle).toBeCloseTo(0, 1);
});
