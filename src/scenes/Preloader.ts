import Phaser from 'phaser';

/**
 * Preloader scene.
 *
 * Loads the bulk of the game's assets while showing a progress bar, then
 * transitions to the MainScene. Drop images/audio/spritesheets into
 * `public/assets/` and load them here.
 */
export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init(): void {
    const { width, height } = this.scale;

    // Simple progress bar built from Graphics (no assets required).
    this.add
      .text(width / 2, height / 2 - 40, 'Loading…', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    const barWidth = 400;
    const barHeight = 24;
    const barX = (width - barWidth) / 2;
    const barY = height / 2;

    const border = this.add.graphics();
    border.lineStyle(2, 0xffffff, 1).strokeRect(barX, barY, barWidth, barHeight);

    const bar = this.add.graphics();
    this.load.on('progress', (progress: number) => {
      bar.clear();
      bar.fillStyle(0x4ade80, 1);
      bar.fillRect(barX + 4, barY + 4, (barWidth - 8) * progress, barHeight - 8);
    });
  }

  preload(): void {
    // Load your real game assets here, for example:
    // this.load.setPath('assets');
    // this.load.image('logo', 'logo.png');
    // this.load.spritesheet('player', 'player.png', { frameWidth: 32, frameHeight: 32 });
  }

  create(): void {
    this.scene.start('MainScene');
  }
}
