/**
 * PreloadScene.js
 * Generates all game textures programmatically to guarantee 100% asset availability.
 * Cuts spritesheet frames and smoothly transitions to MainMenuScene.
 */

import Phaser from 'phaser';
import { AssetGenerator } from '../utils/AssetGenerator.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const { width, height } = this.scale;

    // Loading background
    const bg = this.add.graphics();
    bg.fillStyle(0x05070a, 1);
    bg.fillRect(0, 0, width, height);

    // Cinematic Title
    const title = this.add.text(width / 2, height / 2 - 50, 'THE LEGEND OF MAAJID', {
      fontFamily: "'Cinzel', serif",
      fontSize: '32px',
      color: '#f59e0b',
      fontStyle: 'bold',
      letterSpacing: 4
    }).setOrigin(0.5);

    const sub = this.add.text(width / 2, height / 2 - 10, 'Initializing coastal world and story archives...', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Progress bar frame
    const barFrame = this.add.graphics();
    barFrame.lineStyle(2, 0xd97706, 0.8);
    barFrame.strokeRoundedRect(width / 2 - 160, height / 2 + 30, 320, 16, 8);

    const barFill = this.add.graphics();
    barFill.fillStyle(0xf59e0b, 1);
    barFill.fillRoundedRect(width / 2 - 158, height / 2 + 32, 10, 12, 6);

    // Load high-resolution anime backgrounds
    this.load.image('bg_title', './assets/backgrounds/bg_title.jpg');
    this.load.image('bg_mohalla_adult', './assets/backgrounds/bg_mohalla_adult.jpg');
    this.load.image('bg_mohalla_childhood', './assets/backgrounds/bg_mohalla_childhood.jpg');
    this.load.image('bg_muharram', './assets/backgrounds/bg_muharram.jpg');
    this.load.image('bg_change_heart', './assets/backgrounds/bg_change_heart.jpg');
    this.load.image('bg_tuition_room', './assets/backgrounds/bg_tuition_room.jpg');

    // Load high-resolution anime character portraits
    this.load.image('portrait_basharat_age_24', './assets/characters/portrait_basharat_age_24.jpg');
    this.load.image('portrait_basharat_age_15', './assets/characters/portrait_basharat_age_15.jpg');
    this.load.image('portrait_maajid_age_21', './assets/characters/portrait_maajid_age_21.jpg');
    this.load.image('portrait_maajid_age_8', './assets/characters/portrait_maajid_age_8.jpg');
    this.load.image('portrait_firoz_age_20', './assets/characters/portrait_firoz_age_20.jpg');

    // Preload progress
    this.load.on('progress', (value) => {
      barFill.clear();
      barFill.fillStyle(0xf59e0b, 1);
      barFill.fillRoundedRect(width / 2 - 158, height / 2 + 32, 316 * value, 12, 6);
    });
  }

  create() {
    // Generate all procedural UI panels, world props, and fallback textures
    AssetGenerator.generateAll(this);

    // Cut frames for player walking spritesheet
    this.setupSpritesheetFrames();

    this.completeLoading();
  }

  setupSpritesheetFrames() {
    if (this.textures.exists('player_sprite_sheet')) {
      const texture = this.textures.get('player_sprite_sheet');
      let frameIndex = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          texture.add(frameIndex, 0, col * 48, row * 64, 48, 64);
          frameIndex++;
        }
      }
    }
  }

  completeLoading() {
    this.time.delayedCall(200, () => {
      this.cameras.main.fade(400, 0, 0, 0, false, (cam, progress) => {
        if (progress === 1) {
          this.scene.start('MainMenuScene');
        }
      });
    });
  }
}
