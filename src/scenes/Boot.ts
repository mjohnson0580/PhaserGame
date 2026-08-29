import Phaser from 'phaser';

/**
 * Boot scene.
 *
 * Runs first and stays tiny. Load only the few assets needed by the
 * Preloader itself (e.g. a background or loading-bar graphic), then hand
 * off to the Preloader which loads the rest of the game.
 */
export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Example: this.load.image('loading-background', 'assets/bg.png');
  }

  create(): void {
    this.scene.start('Preloader');
  }
}
