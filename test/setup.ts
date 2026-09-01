// Global test setup, loaded once by Vitest (see vitest.config.ts).
//
// happy-dom implements the DOM but NOT canvas rendering contexts, so any code that
// calls `canvas.getContext('2d' | 'webgl')` — including Phaser's renderers —
// gets `null` and blows up. We stub a no-op 2D context so modules that touch a
// canvas at import/boot time stay quiet in tests.
//
// This is deliberately minimal: it lets Phaser *load* and lets you unit-test
// game logic. It does NOT actually render. To boot a real Phaser.Game in tests,
// prefer `Phaser.HEADLESS` and add `vitest-canvas-mock` for a fuller fake.

import { vi } from 'vitest';

if (typeof HTMLCanvasElement !== 'undefined') {
  const noopContext = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    getContextAttributes: vi.fn(() => ({ willReadFrequently: false }))
  } as unknown as CanvasRenderingContext2D;

  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => noopContext
  ) as unknown as HTMLCanvasElement['getContext'];
}
