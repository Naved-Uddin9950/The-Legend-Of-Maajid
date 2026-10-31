/**
 * MainMenuScene.js
 * Cinematic Main Menu with animated coastal mohalla background, atmospheric soundtrack,
 * and comprehensive navigation menus.
 */

import Phaser from 'phaser';
import { MainMenuUI } from '../ui/MainMenuUI.js';
import { AudioManager } from '../systems/AudioManager.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Atmospheric Background
    this.bg = this.add.image(width / 2, height / 2, 'bg_title');
    this.bg.setDisplaySize(width, height);

    // Subtle gentle camera zoom effect for cinematic feel
    this.tweens.add({
      targets: this.bg,
      scaleX: this.bg.scaleX * 1.03,
      scaleY: this.bg.scaleY * 1.03,
      duration: 12000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtle floating dust/light particles
    const emitter = this.add.particles(0, 0, 'icon_elathalam', {
      x: { min: 0, max: 1280 },
      y: 720,
      lifespan: 8000,
      speedY: { min: -15, max: -35 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.08, end: 0.01 },
      alpha: { start: 0.35, end: 0 },
      frequency: 450,
      blendMode: 'ADD'
    });
    emitter.setDepth(10);

    // Main Menu UI overlay
    this.menuUI = new MainMenuUI(this);

    // Start title music
    AudioManager.getInstance().playMusic('title');

    // Fade in camera
    this.cameras.main.fadeIn(600, 0, 0, 0);
  }
}
