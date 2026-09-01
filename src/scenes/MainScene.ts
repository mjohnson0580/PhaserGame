import Phaser from 'phaser';

/**
 * MainScene — the "Hello World" of the template.
 *
 * Renders a title, a tweened shape, and reacts to a pointer click so you can
 * confirm rendering, tweens, and input are all wired up. Replace this with
 * your actual gameplay.
 */
export class MainScene extends Phaser.Scene {
  /**
   * The spinning box. Public so end-to-end tests can assert on it — exposing
   * the state you want to verify beats trying to read it back out of pixels.
   */
  box!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('MainScene');
  }

  create(): void {
    const { width, height } = this.scale;

    // Title text.
    this.add
      .text(width / 2, height / 2 - 120, 'Hello, Phaser 4! 🎮', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '56px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 60, 'Click anywhere to spin the box', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#a0a0c0'
      })
      .setOrigin(0.5);

    // A simple sprite drawn from Graphics — no image asset needed.
    const box = this.add.rectangle(width / 2, height / 2 + 60, 120, 120, 0x4ade80);
    box.setStrokeStyle(4, 0xffffff);
    this.box = box;

    // Gentle idle bob so something is always moving.
    this.tweens.add({
      targets: box,
      y: box.y - 20,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    // Spin the box on click, anywhere on screen.
    this.input.on('pointerdown', () => {
      this.tweens.add({
        targets: box,
        angle: box.angle + 360,
        duration: 600,
        ease: 'Cubic.out'
      });
    });
  }
}
