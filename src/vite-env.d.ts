/// <reference types="vite/client" />

import type Phaser from 'phaser';

declare global {
  interface Window {
    /**
     * The running game, exposed by `main.ts` in dev builds only so end-to-end
     * tests can assert on real game state. Undefined in production builds.
     */
    game?: Phaser.Game;
  }
}
