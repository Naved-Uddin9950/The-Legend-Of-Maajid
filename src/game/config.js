/**
 * config.js
 * Phaser game configuration: 1280x720, 16:9 responsive auto-center, WebGL with Canvas fallback, Arcade physics.
 */

import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene.js';
import { PreloadScene } from '../scenes/PreloadScene.js';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { VisualNovelScene } from '../scenes/VisualNovelScene.js';
import { NeighborhoodScene } from '../scenes/NeighborhoodScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#05070a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    VisualNovelScene,
    NeighborhoodScene
  ]
};
