import Phaser from 'phaser';

/**
 * BootScene.js
 * Initializes Phaser rendering settings and launches PreloadScene.
 */

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Configure input and scaling settings
    this.input.setDefaultCursor('default');
    this.scene.start('PreloadScene');
  }
}
