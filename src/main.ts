import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainScene } from './scenes/MainScene';

/**
 * Global game configuration.
 * See: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL where available, Canvas fallback.
  parent: 'game', // Matches the <div id="game"> in index.html.
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  // Scenes boot in array order; the first scene starts automatically.
  scene: [Boot, Preloader, MainScene]
};

// Kick everything off.
export default new Phaser.Game(config);
